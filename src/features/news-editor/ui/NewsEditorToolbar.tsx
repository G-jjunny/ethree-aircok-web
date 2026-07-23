'use client';

import type { Editor } from '@tiptap/core';
import { useRef } from 'react';
import { toast } from 'sonner';
import { uploadNewsImage } from '../api/uploadImage';

interface Props {
  editor: Editor | null;
}

const btnBase =
  'inline-flex items-center justify-center px-2 py-1 rounded text-sm transition-colors max-sm:min-h-11 max-sm:min-w-11';
const btnActive = 'bg-brand text-white';
const btnInactive = 'text-ink-soft hover:bg-hairline';

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${btnBase} ${active ? btnActive : btnInactive}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-hairline mx-0.5 self-center" />;
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('URL 입력');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else if (url === '') {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="flex gap-1 flex-wrap items-center border border-hairline rounded-t-btn bg-surface px-2 py-1">
      {/* 텍스트 서식 */}
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <Divider />

      {/* 제목 (H1은 기사 제목이 페이지 h1이므로 제외, H2/H3만 제공) */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>

      <Divider />

      {/* 목록 */}
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        UL
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        OL
      </ToolbarButton>

      <Divider />

      {/* 블록 요소 */}
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo;
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {'</>'}
      </ToolbarButton>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`${btnBase} ${btnInactive}`}
      >
        &mdash;
      </button>

      <Divider />

      {/* 링크 */}
      <ToolbarButton
        active={editor.isActive('link')}
        onClick={handleLinkInsert}
      >
        Link
      </ToolbarButton>

      <Divider />

      {/* 이미지 */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`${btnBase} ${btnInactive}`}
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
