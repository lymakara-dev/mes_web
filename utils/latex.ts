export function detectLatexType(content: string): "inline" | "block" {
  // If the content has \\ (line breaks) or starts/ends with $$, treat it as block
  if (
    content.includes("\\\\") ||
    content.startsWith("$$") ||
    content.endsWith("$$")
  ) {
    return "block";
  }
  return "inline";
}
