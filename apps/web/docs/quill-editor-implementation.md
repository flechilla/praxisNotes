# QuillJS Editor Implementation

## Overview

This document explains the implementation of a rich text editor component using QuillJS in the PraxisNotes application. The editor is used for viewing and editing report content with a more user-friendly interface than raw Markdown.

## Components

### 1. QuillEditor Component

The `QuillEditor` component (`apps/web/components/ui/QuillEditor.tsx`) is a reusable React component that wraps QuillJS functionality. It provides:

- HTML content editing with formatting options
- Read-only mode
- Custom styling
- Automatic content synchronization

```typescript
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
};

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder = "Enter content here...",
  className = "",
}) => {
  // Implementation...
};
```

### 2. Markdown Conversion Utilities

Since the application uses Markdown format internally but the QuillJS editor uses HTML, we've created conversion utilities in `apps/web/utils/markdown-converter.ts`:

- `markdownToHtml`: Converts Markdown content to HTML for display in the editor
- `htmlToMarkdown`: Converts HTML from the editor back to Markdown for storage

## Usage

### In Report Generation

The QuillJS editor is used in the `ReportGeneration` component to allow users to view and edit generated reports:

```tsx
import QuillEditor from "../../../../components/ui/QuillEditor";
import {
  markdownToHtml,
  htmlToMarkdown,
} from "../../../../utils/markdown-converter";

// Inside component:
const [editableMarkdown, setEditableMarkdown] = useState<string>("");
const [editableHtml, setEditableHtml] = useState<string>("");

// Convert markdown to HTML for Quill
useEffect(() => {
  const convertToHtml = async () => {
    const html = await markdownToHtml(markdown);
    setEditableHtml(html);
  };

  convertToHtml();
}, [markdown]);

// Handle Quill editor content changes
const handleQuillChange = async (html: string) => {
  setEditableHtml(html);

  // Convert HTML back to markdown for storage
  const markdown = await htmlToMarkdown(html);
  setEditableMarkdown(markdown);
};

// In render:
<QuillEditor
  value={editableHtml}
  onChange={handleQuillChange}
  readOnly={false}
  className="min-h-[500px]"
/>;
```

## Dependencies

The implementation relies on the following packages:

- `quill`: The core QuillJS editor
- `remark`, `remark-html`, etc.: For Markdown to HTML conversion
- `rehype-parse`, `rehype-remark`, etc.: For HTML to Markdown conversion

## Toolbar Options

The QuillJS editor includes the following formatting options:

- Headers (H1, H2, H3)
- Bold, italic, underline, strikethrough
- Ordered and unordered lists
- Links
- Clear formatting

## Future Enhancements

Potential future enhancements include:

1. Custom toolbar configuration based on report type
2. Support for images and tables
3. Custom QuillJS formats for specific report elements
4. Direct HTML export for print or PDF generation

## References

- [QuillJS Documentation](https://quilljs.com/docs/api/)
- [QuillJS Content API](https://quilljs.com/docs/api/#content)
- [QuillJS Formatting API](https://quilljs.com/docs/api/#formatting)
