'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the MD editor to prevent SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

/**
 * MarkdownEditor component for admin forms.
 *
 * @param {Object} props
 * @param {string} props.value - Current markdown text.
 * @param {function} props.onChange - Callback with the updated text.
 * @param {string} props.label - Label for the editor.
 * @param {string} props.error - Error message if validation fails.
 */
const MarkdownEditor = ({ value, onChange, label, error }) => {
  return (
    <div className="space-y-1.5" data-color-mode="light">
      {label && <label className="block text-sm font-bold text-[#4a5968]">{label}</label>}

      <div
        className={`rounded-xl overflow-hidden border transition-all duration-200
          ${error ? 'border-red-500 bg-red-50' : 'border-[#d8e0e8] focus-within:border-[#7aa5d8] focus-within:ring-4 focus-within:ring-[#7aa5d8]/10'}`}
      >
        <MDEditor
          value={value}
          onChange={onChange}
          height={300}
          preview="live"
          className="admin-md-editor"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <style jsx global>{`
        .admin-md-editor {
          background-color: #ffffff !important;
          border-radius: 0.85rem;
          border: none !important;
          box-shadow: none !important;
        }
        .w-md-editor-toolbar {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #edf1f5 !important;
          padding: 8px !important;
        }
        .w-md-editor-toolbar button {
          color: #4a5968 !important;
        }
        .w-md-editor-toolbar button:hover {
          color: #13202a !important;
          background-color: #eef3f7 !important;
        }
        .w-md-editor-content {
          background-color: #ffffff !important;
        }
        .w-md-editor-preview {
          background-color: #f7f9fb !important;
          color: #13202a !important;
          border-left: 1px solid #edf1f5 !important;
        }
      `}</style>
    </div>
  );
};

export default MarkdownEditor;
