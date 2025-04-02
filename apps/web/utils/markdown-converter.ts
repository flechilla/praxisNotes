"use client";

/**
 * Converts Markdown content to HTML for rendering in Quill
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // Dynamically import packages on client-side
    const [{ remark }, remarkParse, remarkHtml] = await Promise.all([
      import("remark"),
      import("remark-parse"),
      import("remark-html"),
    ]);

    const result = await remark()
      .use(remarkParse.default)
      .use(remarkHtml.default)
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    // Fallback to basic conversion
    return markdown.replace(/\n/g, "<br>");
  }
}

/**
 * Converts HTML content from Quill to Markdown for storage/submission
 */
export async function htmlToMarkdown(html: string): Promise<string> {
  // If HTML is empty or just contains a few empty paragraphs, return empty string
  if (!html || html.trim() === "" || html === "<p><br></p>") {
    return "";
  }

  try {
    // Dynamically import packages on client-side
    const [{ unified }, rehypeParse, rehypeRemark, remarkStringify] =
      await Promise.all([
        import("unified"),
        import("rehype-parse"),
        import("rehype-remark"),
        import("remark-stringify"),
      ]);

    const result = await unified()
      .use(rehypeParse.default, { fragment: true })
      .use(rehypeRemark.default)
      .use(remarkStringify.default)
      .process(html);

    return result.toString();
  } catch (error) {
    console.error("Error converting HTML to markdown:", error);
    // Fallback to basic conversion by stripping HTML tags
    return html.replace(/<[^>]*>/g, "");
  }
}
