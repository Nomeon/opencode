type ToolExecuteBeforeInput = {
  tool: string
}

type ToolExecuteBeforeOutput = {
  args?: {
    filePath?: string
    [key: string]: unknown
  }
}

const BLOCKED_ENV_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",
]

export const EnvProtection = async () => {
  return {
    "tool.execute.before": async (
      input: ToolExecuteBeforeInput,
      output: ToolExecuteBeforeOutput,
    ): Promise<void> => {
      if (input.tool !== "read") return

      const filePath = output.args?.filePath

      if (typeof filePath !== "string") return

      const fileName = filePath.split("/").pop()

      if (fileName && BLOCKED_ENV_FILES.includes(fileName)) {
        throw new Error("Do not read protected .env files")
      }
    },
  }
}
