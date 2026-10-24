import { Plugin } from "@opencode/plugin"

const CHATGPT_RESPONSES_URL = "https://chatgpt.com/backend-api/codex/responses"

export default Plugin.define({
  id: "chatgpt-websearch",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: "web-search",
        description:
          "Search the web using the current OpenAI model through the signed-in ChatGPT account. Use for current information and include source links in the answer.",
        input: {
          type: "object",
          properties: {
            query: { type: "string", minLength: 2, description: "The web search query" },
          },
          required: ["query"],
          additionalProperties: false,
        },
        async execute(input, toolContext) {
          const query = (input as { query: string }).query
          await ctx.permission.assert({
            sessionID: toolContext.sessionID,
            agent: toolContext.agent,
            source: { type: "tool", messageID: toolContext.messageID, id: toolContext.id },
            action: "websearch",
            resources: [query],
          })
          const session = await ctx.session.get({ sessionID: toolContext.sessionID })
          if (session.model?.providerID !== "openai") {
            return { content: "ChatGPT web search requires an OpenAI model in this session." }
          }
          const models = await ctx.model.list()
          const model = models.data?.find(
            (candidate) => candidate.providerID === "openai" && candidate.id === session.model?.id,
          )

          const connection = await ctx.integration.connection.active("openai")
          if (!connection) {
            return { content: "Sign in to OpenAI with ChatGPT in /connect to use ChatGPT web search." }
          }
          const credential = await ctx.integration.connection.resolve(connection)
          if (!credential || credential.type !== "oauth") {
            return { content: "An active ChatGPT OAuth sign-in is required for web search." }
          }

          const metadata = credential.metadata as Record<string, unknown> | undefined
          const accountID =
            (typeof metadata?.accountId === "string" && metadata.accountId) ||
            (typeof metadata?.account_id === "string" && metadata.account_id) ||
            accountIDFromAccessToken(credential.access)
          if (typeof accountID !== "string" || !accountID) {
            return { content: "The active ChatGPT sign-in is missing its account identifier. Reconnect OpenAI in /connect." }
          }

          const response = await fetch(CHATGPT_RESPONSES_URL, {
            method: "POST",
            signal: toolContext.signal,
            headers: {
              Accept: "text/event-stream",
              Authorization: `Bearer ${credential.access}`,
              "Content-Type": "application/json",
              "ChatGPT-Account-Id": accountID,
              "User-Agent": "opencode-chatgpt-websearch",
            },
            body: JSON.stringify({
              include: ["web_search_call.action.sources"],
              input: [{ role: "user", content: [{ type: "input_text", text: `Perform a web search for the query: ${query}` }] }],
              instructions: "You are an assistant for performing a web search tool use.",
              model: model?.modelID ?? session.model.id,
              store: false,
              stream: true,
              tool_choice: "auto",
              tools: [{ type: "web_search" }],
            }),
          })

          if (!response.ok) {
            let detail = ""
            try {
              const body: unknown = await response.json()
              if (body && typeof body === "object") {
                const error = (body as Record<string, unknown>).error
                if (error && typeof error === "object") {
                  const value = (error as Record<string, unknown>).message
                  if (typeof value === "string") detail = value
                }
              }
            } catch {
              // Keep non-JSON error bodies private.
            }
            detail = detail.replaceAll(credential.access, "[redacted]").replaceAll(accountID, "[redacted]")
            return {
              content: `ChatGPT web search failed (HTTP ${response.status})${detail ? `: ${detail}` : "."}`,
            }
          }
          if (!response.body) {
            return { content: "ChatGPT web search returned an empty response." }
          }

          const { text, sources } = await readSearchResponse(response, toolContext.signal)
          if (!text && sources.length === 0) {
            return { content: "ChatGPT web search returned no results." }
          }
          return {
            content: JSON.stringify({
              answer: text,
              sources,
            }),
          }
        },
      })
    })
  },
})

async function readSearchResponse(response: Response, signal: AbortSignal) {
  let buffer = ""
  let text = ""
  const sources = new Map<string, string>()
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      signal.throwIfAborted()
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true }).replaceAll("\r\n", "\n")

      let delimiter = buffer.indexOf("\n\n")
      while (delimiter !== -1) {
        const block = buffer.slice(0, delimiter)
        buffer = buffer.slice(delimiter + 2)
        const event = parseEvent(block)
        if (event) {
          if (event.type === "response.output_text.delta" && typeof event.data.delta === "string") {
            text += event.data.delta
          }
          if (event.type === "response.output_item.done") {
            collectSources(event.data.item, sources)
          }
        }
        delimiter = buffer.indexOf("\n\n")
      }
    }
    buffer += decoder.decode()
    const event = parseEvent(buffer)
    if (event?.type === "response.output_text.delta" && typeof event.data.delta === "string") {
      text += event.data.delta
    }
    if (event?.type === "response.output_item.done") collectSources(event.data.item, sources)
  } finally {
    reader.releaseLock()
  }

  return { text: text.trim(), sources: [...sources].map(([url, title]) => ({ title, url })) }
}

function parseEvent(block: string): { type: string; data: Record<string, unknown> } | undefined {
  let type = ""
  let data = ""
  for (const line of block.split("\n")) {
    if (line.startsWith("event: ")) type = line.slice(7)
    if (line.startsWith("data: ")) data += line.slice(6)
  }
  if (!type || !data) return
  try {
    const parsed: unknown = JSON.parse(data)
    if (parsed && typeof parsed === "object") return { type, data: parsed as Record<string, unknown> }
  } catch {
    return
  }
}

function accountIDFromAccessToken(accessToken: string): string | undefined {
  const payload = accessToken.split(".")[1]
  if (!payload) return
  try {
    const base64 = payload.replaceAll("-", "+").replaceAll("_", "/")
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
    const claims: unknown = JSON.parse(decoded)
    if (!claims || typeof claims !== "object") return
    const auth = (claims as Record<string, unknown>)["https://api.openai.com/auth"]
    if (!auth || typeof auth !== "object") return
    const accountID = (auth as Record<string, unknown>).chatgpt_account_id
    return typeof accountID === "string" && accountID ? accountID : undefined
  } catch {
    return
  }
}

function collectSources(item: unknown, sources: Map<string, string>) {
  if (!item || typeof item !== "object") return
  const record = item as { type?: unknown; action?: { type?: unknown; sources?: unknown } }
  if (record.type !== "web_search_call" || record.action?.type !== "search" || !Array.isArray(record.action.sources)) return
  for (const source of record.action.sources) {
    if (!source || typeof source !== "object") continue
    const hit = source as { url?: unknown; title?: unknown }
    if (typeof hit.url === "string" && hit.url) {
      sources.set(hit.url, typeof hit.title === "string" && hit.title ? hit.title : hit.url)
    }
  }
}
