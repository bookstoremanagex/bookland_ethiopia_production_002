"use client"

import React, { useCallback, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    minHeight?: string
}

const HIGHLIGHT_COLORS = [
    { label: 'Yellow', value: '#fef08a' },
    { label: 'Green', value: '#bbf7d0' },
    { label: 'Blue', value: '#bfdbfe' },
    { label: 'Pink', value: '#fbcfe8' },
    { label: 'Orange', value: '#fed7aa' },
    { label: 'Purple', value: '#e9d5ff' },
    { label: 'Red', value: '#fecaca' },
    { label: 'Cyan', value: '#a5f3fc' },
]

export default function RichTextEditor({ value, onChange, placeholder, className, minHeight = '80px' }: RichTextEditorProps) {
    const [showHighlightPicker, setShowHighlightPicker] = useState(false)
    const highlightPickerRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Highlight.configure({ multicolor: true }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'rich-text focus:outline-none text-xs',
                style: `min-height: ${minHeight}; padding: 12px;`,
                placeholder: placeholder || '',
            },
        },
    })

    if (!editor) {
        return (
            <div className={cn('border-2 border-slate-100 rounded-xl bg-transparent', className)} style={{ minHeight }}>
                <div className="p-3 text-xs font-bold text-slate-400">Loading editor...</div>
            </div>
        )
    }

    const toggleBold = () => editor.chain().focus().toggleBold().run()
    const toggleItalic = () => editor.chain().focus().toggleItalic().run()
    const toggleUnderline = () => editor.chain().focus().toggleUnderline().run()

    const clearHighlight = () => {
        editor.chain().focus().unsetHighlight().run()
        setShowHighlightPicker(false)
    }

    const applyHighlight = (color: string) => {
        editor.chain().focus().toggleHighlight({ color }).run()
        setShowHighlightPicker(false)
    }

    const isActive = (type: string, attrs?: Record<string, string>) => editor.isActive(type, attrs)

    const ToolbarButton = ({ onClick, active, children, title }: { onClick: () => void; active: boolean; children: React.ReactNode; title: string }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick() }}
            className={cn(
                'size-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all',
                active
                    ? 'bg-primarycolor text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            )}
        >
            {children}
        </button>
    )

    return (
        <div className={cn('border-2 border-slate-100 rounded-xl overflow-visible focus-within:border-primarycolor transition-all bg-transparent', className)}>
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <ToolbarButton onClick={toggleBold} active={isActive('bold')} title="Bold (Ctrl+B)">
                    <span className="font-black">B</span>
                </ToolbarButton>
                <ToolbarButton onClick={toggleItalic} active={isActive('italic')} title="Italic (Ctrl+I)">
                    <span className="italic font-serif">I</span>
                </ToolbarButton>
                <ToolbarButton onClick={toggleUnderline} active={isActive('underline')} title="Underline (Ctrl+U)">
                    <span className="underline">U</span>
                </ToolbarButton>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <div className="relative">
                    <ToolbarButton
                        onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                        active={isActive('highlight')}
                        title="Highlight"
                    >
                        <span className="font-bold" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fef08a 100%)', padding: '0 2px', borderRadius: 2 }}>H</span>
                    </ToolbarButton>
                    {showHighlightPicker && (
                        <div
                            ref={highlightPickerRef}
                            className="absolute top-full left-0 mt-1 z-50 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-2 min-w-[180px]"
                        >
                            <div className="grid grid-cols-4 gap-1">
                                {HIGHLIGHT_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onMouseDown={(e) => { e.preventDefault(); applyHighlight(c.value) }}
                                        className={cn(
                                            'size-7 rounded-lg border-2 transition-all hover:scale-110',
                                            isActive('highlight', { color: c.value })
                                                ? 'border-primarycolor ring-2 ring-primarycolor/30'
                                                : 'border-transparent'
                                        )}
                                        style={{ backgroundColor: c.value }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); clearHighlight() }}
                                className="mt-1.5 w-full text-[10px] font-bold text-slate-500 hover:text-red-500 uppercase tracking-widest py-1 rounded-lg hover:bg-slate-50 transition-all"
                            >
                                Remove Highlight
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
