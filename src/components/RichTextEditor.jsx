"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
    FiBold,
    FiItalic,
    FiUnderline,t,
} from "react-icons/fi";
import { MdHighlight } from "react-icons/md";

export default function RichTextEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class: "min-h-[250px] p-4 focus:outline-none",
            },
        },

        immediatelyRender: false,
    });

    if (!editor) return null;

    return (
        <div className="rounded-xl border bg-white">

            {/* Toolbar */}
            <div className="flex items-center gap-2 border-b p-3">
                {/* Bold */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor.isActive("bold") ? "bg-blue-100" : "hover:bg-gray-200"
                        }`}
                >
                    <FiBold />
                </button>

                {/* Italic */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor.isActive("italic") ? "bg-blue-100" : "hover:bg-gray-200"
                        }`}
                >
                    <FiItalic />
                </button>

                {/* Underline */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded ${editor.isActive("underline") ? "bg-blue-100" : "hover:bg-gray-200"
                        }`}
                >
                    <FiUnderline />
                </button>

                {/* Highlight */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`p-2 rounded ${editor.isActive("highlight") ? "bg-yellow-200" : "hover:bg-yellow-100"
                        }`}
                >
                    <MdHighlight />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />
            </div>

            {/* 👇 Add className here */}
            <EditorContent
                editor={editor}
                className="tiptap"
            />

        </div>
    );
}