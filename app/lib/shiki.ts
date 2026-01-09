import { createHighlighter } from "shiki";

let highlighter: any = null;

export async function highlightCode(
  code: string,
  lang: string = "ts"
): Promise<string> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: [
        "ts",
        "js",
        "tsx",
        "jsx",
        "json",
        "python",
        "java",
        "cpp",
        "c",
        "bash",
      ],
    });
  }

  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}
