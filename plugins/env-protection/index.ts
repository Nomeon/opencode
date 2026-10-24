import { Plugin } from "@opencode/plugin"

const READABLE_ENV_SUFFIXES = [".example", ".template", ".sample"]

export default Plugin.define({
  id: "env-protection",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", (event) => {
      if (event.tool !== "read") return

      const filePath = (event.input as { path?: unknown }).path

      if (typeof filePath === "string" && isProtectedEnvFile(filePath)) {
        throw new Error("Do not read protected environment files")
      }
    })
  },
})

function isProtectedEnvFile(filePath: string): boolean {
  const fileName = filePath.split(/[\\/]/).pop()

  if (!fileName) return false
  if (fileName === ".env") return true
  if (!fileName.startsWith(".env.")) return false

  return !READABLE_ENV_SUFFIXES.some((suffix) => fileName.endsWith(suffix))
}
