type ToolExecuteBeforeInput = {
  tool: string
}

type ToolExecuteBeforeOutput = {
  args?: {
    filePath?: string
    [key: string]: unknown
  }
}

const READABLE_ENV_SUFFIXES = [".example", ".template", ".sample"]

export const EnvProtection = async () => {
  return {
    "tool.execute.before": async (
      input: ToolExecuteBeforeInput,
      output: ToolExecuteBeforeOutput,
    ): Promise<void> => {
      if (input.tool !== "read") return

      const filePath = output.args?.filePath

      if (typeof filePath === "string" && isProtectedEnvFile(filePath)) {
        throw new Error("Do not read protected environment files")
      }
    },
  }
}

function isProtectedEnvFile(filePath: string): boolean {
  const fileName = filePath.split(/[\\/]/).pop()

  if (!fileName) return false
  if (fileName === ".env") return true
  if (!fileName.startsWith(".env.")) return false

  return !READABLE_ENV_SUFFIXES.some((suffix) => fileName.endsWith(suffix))
}
