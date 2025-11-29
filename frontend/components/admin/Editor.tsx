"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Heading1, Heading2, List } from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-light-text',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-card-dark rounded-lg border border-dark-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-dark-border p-2 bg-white/5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'text-primary bg-white/10' : 'text-light-text-secondary'}`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'text-primary bg-white/10' : 'text-light-text-secondary'}`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-white/10' : 'text-light-text-secondary'}`}
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'text-primary bg-white/10' : 'text-light-text-secondary'}`}
        >
          <List size={18} />
        </button>
      </div>

      {/* Editör Alanı */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}