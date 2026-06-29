'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { NewsEditorToolbar } from './NewsEditorToolbar';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function NewsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      <NewsEditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[400px] border border-t-0 border-border-light rounded-b-md px-4 py-3 focus:outline-none text-body-dark text-sm font-body [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[380px] [&_.ProseMirror]:prose [&_.ProseMirror]:max-w-none"
      />
    </div>
  );
}
