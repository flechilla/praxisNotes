# QuillJS Editor Enhancement Plan

## Overview

This document outlines the plan for enhancing the QuillJS editor implementation in the PraxisNotes application. The goal is to improve the text editing experience, add more formatting options, and ensure compatibility with existing Markdown-based data structures.

## Current Implementation

- Basic QuillJS editor with default toolbar options
- Markdown to HTML and HTML to Markdown conversion
- Integration with the ReportGeneration component

## Enhancement Goals

1. Improve editor UX and formatting options
2. Add specialized content blocks for report elements
3. Optimize performance with large documents
4. Ensure data format consistency

## Implementation Tasks

### 1. Extended Toolbar Configuration

- [ ] Implement customizable toolbar based on report type
- [ ] Add table support for structured data
- [ ] Add image insertion and sizing controls
- [ ] Files to modify:
  - `apps/web/components/ui/QuillEditor.tsx` - Add toolbar configuration options
  - `apps/web/app/rbt/report/form/ReportGeneration.tsx` - Pass toolbar config based on report type

```typescript
// Example extended toolbar configuration
const toolbarOptions = {
  regular: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
  narrative: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};
```

### 2. Custom Report Formats

- [ ] Create custom Blots (Quill's content format) for report-specific elements
- [ ] Implement specialized formats for behavior tracking, skill acquisition, etc.
- [ ] Files to create/modify:
  - `apps/web/components/quill-formats/BehaviorBlot.ts` - Custom format for behavior entries
  - `apps/web/components/quill-formats/SkillBlot.ts` - Custom format for skill entries
  - `apps/web/components/ui/QuillEditor.tsx` - Register custom formats

```typescript
// Example custom Blot registration
import Quill from "quill";
const Inline = Quill.import("blots/inline");

class BehaviorBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-behavior-id", value.id);
    node.setAttribute("class", "behavior-highlight");
    return node;
  }

  static formats(node) {
    return {
      id: node.getAttribute("data-behavior-id"),
    };
  }
}

BehaviorBlot.blotName = "behavior";
BehaviorBlot.tagName = "span";

Quill.register(BehaviorBlot);
```

### 3. Enhanced Markdown Conversion

- [ ] Improve HTML to Markdown conversion handling for complex elements
- [ ] Add support for tables in markdown conversion
- [ ] Files to modify:
  - `apps/web/utils/markdown-converter.ts` - Enhance conversion logic

### 4. Performance Optimizations

- [ ] Implement lazy loading for large reports
- [ ] Add content debouncing to reduce conversion calls
- [ ] Files to modify:
  - `apps/web/app/rbt/report/form/ReportGeneration.tsx` - Add debounced state updates
  - `apps/web/components/ui/QuillEditor.tsx` - Add performance optimization

```typescript
// Example debounced update implementation
import { useCallback } from "react";
import debounce from "lodash/debounce";

// Inside component
const debouncedHtmlChange = useCallback(
  debounce((html: string) => {
    const convertToMarkdown = async () => {
      try {
        const markdown = await htmlToMarkdown(html);
        setEditableMarkdown(markdown);
      } catch (err) {
        console.error("Failed to convert HTML to markdown:", err);
      }
    };

    convertToMarkdown();
  }, 300),
  [],
);
```

### 5. Print/Export Improvements

- [ ] Add direct HTML export for better print formatting
- [ ] Implement PDF generation with proper styles
- [ ] Files to modify:
  - `apps/web/app/rbt/report/form/ReportGeneration.tsx` - Add export functionality
  - `apps/web/utils/report-export.ts` (new file) - Add export utilities

## Timeline

- Phase 1 (1-2 weeks): Extended toolbar and basic format improvements
- Phase 2 (2-3 weeks): Custom report formats and enhanced markdown conversion
- Phase 3 (1-2 weeks): Performance optimizations and export functionality

## Dependencies

- Additional packages needed:
  - `html-to-pdfmake` or `jspdf` for PDF generation
  - `lodash` for debounce functionality
  - `table` plugin for QuillJS

## Considerations

- Maintain backward compatibility with existing reports
- Ensure consistent rendering between edit and view modes
- Optimize for mobile devices
- Add appropriate tests for conversion accuracy
