import React from "react";

import "./TextToolbar.scss";

const TextToolbar = ({ editor }) => {
  return (
    <div className="editor-toolbar">
        <button
            className={`toolbar-button ${
            editor.isActive("paragraph") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().setParagraph().run()}
            disabled={!editor.can().chain().focus().setParagraph().run()}
            title="Paragraph"
        >
            P
        </button>
        <button
            className={`toolbar-button ${editor.isActive("bold") ? "active" : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            title="Bold"
        >
            B
        </button>
        <button
            className={`toolbar-button ${
            editor.isActive("italic") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            title="Italic"
        >
            I
        </button>
        <button
            className={`toolbar-button ${
            editor.isActive("underline") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            title="Underline"
        >
            U
        </button>
        <button
            className={`toolbar-button ${
            editor.isActive("strike") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            title="Strikethrough"
        >
            -
        </button>
        <button
            className={`toolbar-button ${
            editor.isActive("bulletList") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            title="Bullet List"
        >
            •
        </button>
        <button
            className={`toolbar-button ${
            editor.isActive("orderedList") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            title="Numbered List"
        >
            1.
        </button>
    </div>
  );
};

export default TextToolbar;
