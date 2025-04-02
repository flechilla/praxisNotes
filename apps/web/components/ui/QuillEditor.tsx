"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="border rounded min-h-[250px] flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    ),
  },
);

// Define the modules outside the component to prevent recreation on each render
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

// Use only formats that are properly registered in Quill
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "link",
];

export type QuillEditorHandle = {
  getContent: () => string;
  setContent: (html: string) => void;
};

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
};

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
  (
    {
      value,
      onChange,
      readOnly = false,
      placeholder = "Enter content here...",
      className = "",
    },
    ref,
  ) => {
    const [editorValue, setEditorValue] = useState(value);
    const [mounted, setMounted] = useState(false);

    // Handle changes from the editor
    const handleChange = (content: string) => {
      setEditorValue(content);
      onChange(content);
    };

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getContent: () => editorValue,
      setContent: (html: string) => setEditorValue(html),
    }));

    // Update editor when value prop changes
    useEffect(() => {
      if (value !== editorValue) {
        setEditorValue(value);
      }
    }, [value, editorValue]);

    // Set mounted state to true after component mounts
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // Only render the editor on the client side
    if (!mounted) {
      return (
        <div
          className={`border rounded min-h-[250px] flex items-center justify-center bg-gray-50 ${className}`}
        >
          <span className="text-gray-500">Loading editor...</span>
        </div>
      );
    }

    return (
      <div className={`quill-editor-container ${className}`}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          placeholder={placeholder}
          className="min-h-[250px]"
        />
      </div>
    );
  },
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
