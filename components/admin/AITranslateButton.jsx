'use client';

import React, { useState } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

/**
 * AITranslateButton component to handle AI translations.
 *
 * @param {string} sourceText - The text to be translated.
 * @param {function} onTranslate - Callback function called with the translated text.
 * @param {string} className - Additional CSS classes.
 */
export const AITranslateButton = ({ sourceText, onTranslate, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleTranslate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sourceText || sourceText.trim() === '') {
      showToast('Please enter some text in the Vietnamese field first.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: sourceText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Translation failed');
      }

      const data = await response.json();
      onTranslate(data.translatedText);
      showToast('Translated successfully!', 'success');
    } catch (error) {
      console.error('Translation error:', error);
      showToast(error.message || 'Failed to translate. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all
        ${
          loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-[#1f4f82]/5 text-[#1f4f82] hover:bg-[#1f4f82]/10 active:scale-95 border border-[#1f4f82]/10'
        } ${className}`}
      title="Translate to English using AI"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Languages className="w-3.5 h-3.5" />
      )}
      <span>{loading ? 'Translating...' : 'Auto-Translate (AI)'}</span>
    </button>
  );
};
