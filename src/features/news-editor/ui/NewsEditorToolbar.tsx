'use client';

import type { Editor } from '@tiptap/core';
import { useRef } from 'react';
import { toast } from 'sonner';
import { uploadNewsImage } from '../api/uploadImage';

interface Props {
  editor: Editor | null;
}

export function NewsEditorToolbar({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadNewsImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      // 같은 파일 재선택 가능하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-1 flex-wrap border border-border-light rounded-t-md bg-surface-light px-2 py-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('bold')
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('italic')
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        UL
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-sm transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-aircok-blue text-heading-light'
            : 'text-body-dark hover:bg-border-light'
        }`}
      >
        OL
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-2 py-1 rounded text-body-dark text-sm hover:bg-border-light transition-colors"
      >
        이미지
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageInsert}
      />
    </div>
  );
}
