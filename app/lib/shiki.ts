import { getHighlighter } from "shiki";

let highlighter: any;

export async function highlight(code: string, lang = "ts") {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ["github-dark"],
      langs: ["ts", "js", "tsx", "json", "python", "java", "cpp"],
    });
  }

  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}
