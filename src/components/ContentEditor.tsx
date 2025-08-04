"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import ImageExtension from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import {
  Bold, Italic, Link2, Download, Quote, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Youtube as YoutubeIcon, Pilcrow, Heading2, Heading3, Check
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-neutral-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {text}
    </div>
  </div>
);

const UrlModal = ({ isOpen, onClose, onSubmit, type }: { isOpen: boolean; onClose: () => void; onSubmit: (url: string) => void; type: string }) => {
    const [url, setUrl] = useState("");
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalRoot(document.getElementById("portal-root"));
    }, []);

    const typeLabels = {
        link: { title: "Wstaw link", placeholder: "https://example.com" },
        youtube: { title: "Wstaw wideo z YouTube", placeholder: "https://youtube.com/watch?v=..." },
        download: { title: "Wstaw przycisk pobierania", placeholder: "Link do pliku..." },
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(url);
        setUrl("");
    }

    if (!portalRoot) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">{typeLabels[type as keyof typeof typeLabels].title}</h3>
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={typeLabels[type as keyof typeof typeLabels].placeholder} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white mb-4" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-neutral-300">Anuluj</button>
                                <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm bg-accent text-black rounded-lg">Wstaw</button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        portalRoot
    )
}

const TiptapEditor = ({ content, onChange }: { content: string; onChange: (richText: string) => void; }) => {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlModalConfig, setUrlModalConfig] = useState({ type: "", callback: (url: string) => {} });
  const [tempColor, setTempColor] = useState('#ffffff');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-accent hover:underline" } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ImageExtension.configure({ inline: false, HTMLAttributes: { class: 'rounded-lg' } }),
      Youtube.configure({ nocookie: true, HTMLAttributes: { class: 'aspect-video w-full rounded-lg' } }),
      TextStyle,
      FontFamily,
      Color,
    ],
    content: content,
    onUpdate({ editor }) { onChange(editor.getHTML()); },
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-2xl max-w-none p-6 border border-neutral-700 rounded-b-lg min-h-[500px] focus:outline-none focus:ring-2 focus:ring-accent prose-h2:font-druk-wide prose-h3:font-druk-wide prose-blockquote:border-accent prose-blockquote:text-neutral-200",
      },
    },
    immediatelyRender: false,
  });

  const openUrlModal = (type: string, callback: (url: string) => void) => {
    setUrlModalConfig({ type, callback });
    setIsUrlModalOpen(true);
  };

  const handleUrlSubmit = (url: string) => {
    urlModalConfig.callback(url);
    setIsUrlModalOpen(false);
  };

  const addImage = useCallback((url: string) => {
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  useEffect(() => {
    if (editor) {
      setTempColor(editor.getAttributes('textStyle').color || '#ffffff');
    }
  }, [editor?.state.selection]);

  if (!editor) return null;

  return (
    <div className="relative">
      <div className="sticky top-24 z-20 flex items-center gap-1 flex-wrap p-2 border border-neutral-700 border-b-0 rounded-t-lg bg-neutral-900">
        <Tooltip text="Paragraf"><button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`p-2 rounded ${editor.isActive('paragraph') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Pilcrow size={16} /></button></Tooltip>
        <Tooltip text="Nagłówek 2"><button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Heading2 size={16} /></button></Tooltip>
        <Tooltip text="Nagłówek 3"><button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Heading3 size={16} /></button></Tooltip>
        <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} value={editor.getAttributes('textStyle').fontFamily || ''} className="bg-neutral-900 text-white text-sm p-1 rounded border border-neutral-700 hover:bg-neutral-800">
            <option value="">Domyślny (Geist)</option>
            <option value="Druk Wide Bold">Druk Wide</option>
            <option value="Inter">Inter</option>
        </select>
        <div className="flex items-center gap-1 p-1 border border-neutral-700 rounded-md">
            <Tooltip text="Kolor tekstu"><input type="color" value={tempColor} onChange={e => setTempColor(e.target.value)} className="w-6 h-6 bg-transparent border-none cursor-pointer" /></Tooltip>
            <Tooltip text="Zastosuj kolor"><button type="button" onClick={() => editor.chain().focus().setColor(tempColor).run()} className="p-1 rounded hover:bg-neutral-800"><Check size={16}/></button></Tooltip>
        </div>
        <div className="w-px h-6 bg-neutral-700 mx-2" />
        <Tooltip text="Pogrubienie"><button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Bold size={16} /></button></Tooltip>
        <Tooltip text="Kursywa"><button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Italic size={16} /></button></Tooltip>
        <Tooltip text="Link"><button type="button" onClick={() => openUrlModal('link', url => editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run())} className={`p-2 rounded ${editor.isActive('link') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Link2 size={16} /></button></Tooltip>
        <div className="w-px h-6 bg-neutral-700 mx-2" />
        <Tooltip text="Wyrównaj do lewej"><button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><AlignLeft size={16} /></button></Tooltip>
        <Tooltip text="Wyśrodkuj"><button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><AlignCenter size={16} /></button></Tooltip>
        <Tooltip text="Wyrównaj do prawej"><button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><AlignRight size={16} /></button></Tooltip>
        <div className="w-px h-6 bg-neutral-700 mx-2" />
        <Tooltip text="Cytat"><button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><Quote size={16} /></button></Tooltip>
        <CldUploadWidget
  uploadPreset="ml_default"
  onSuccess={(result) => {
    const typedResult = result as { info?: { secure_url?: string } };
    addImage(typedResult.info?.secure_url || "");
  }}
>
            {({ open }) => <Tooltip text="Wstaw obrazek"><button type="button" onClick={() => open()} className="p-2 rounded hover:bg-neutral-800"><ImageIcon size={16} /></button></Tooltip>}
        </CldUploadWidget>
        <Tooltip text="Wstaw wideo YouTube"><button type="button" onClick={() => openUrlModal('youtube', url => editor.chain().focus().setYoutubeVideo({ src: url }).run())} className={`p-2 rounded ${editor.isActive('youtube') ? 'bg-accent text-black' : 'hover:bg-neutral-800'}`}><YoutubeIcon size={16} /></button></Tooltip>
        <Tooltip text="Przycisk pobierania"><button type="button" onClick={() => openUrlModal('download', url => editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-block bg-accent text-black font-bold px-6 py-3 rounded-lg my-4 no-underline hover:bg-accent-muted">Pobierz w pełnej rozdzielczości</a>`).run())} className="p-2 rounded hover:bg-neutral-800"><Download size={16} /></button></Tooltip>
      </div>
      <EditorContent editor={editor} />
      <UrlModal isOpen={isUrlModalOpen} onClose={() => setIsUrlModalOpen(false)} onSubmit={handleUrlSubmit} type={urlModalConfig.type} />
    </div>
  );
};

export default TiptapEditor;
