'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Loader2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../data/siteConfig';

const ResumeModal = ({ isOpen, onClose, resumeUrl }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  const url = resumeUrl || siteConfig.resumeUrl;
  const modalText = t.resumeModal || {
    title: 'Hồ sơ năng lực (CV)',
    badge: 'RESUME PREVIEW',
    fileName: 'CV_TranMinhHieu.pdf',
    download: 'Tải PDF',
    openTab: 'Mở tab mới',
    close: 'Đóng',
    fallback: 'Trình duyệt không hỗ trợ xem trước PDF trực tiếp? Bạn có thể mở tab mới hoặc tải file về.',
  };

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset loading state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={modalText.title}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl h-[90vh] flex flex-col rounded-lg border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground shrink-0">
                  <FileText size={14} />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                    // {modalText.badge}
                  </span>
                  <p className="font-mono text-xs font-semibold text-foreground truncate">
                    {modalText.fileName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={url}
                  download="CV_TranMinhHieu.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  title={modalText.download}
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">{modalText.download}</span>
                </a>

                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  title={modalText.openTab}
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">{modalText.openTab}</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={modalText.close}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="relative flex-1 w-full bg-muted/30 overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-background/80 backdrop-blur-xs text-muted-foreground">
                  <Loader2 className="animate-spin text-foreground" size={24} />
                  <span className="font-mono text-xs">Loading PDF...</span>
                </div>
              )}

              <iframe
                src={`${url}#toolbar=0&navpanes=0`}
                title={modalText.title}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
              />
            </div>

            {/* Footer fallback */}
            <div className="px-4 py-2 border-t border-border bg-background/90 text-center font-mono text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
              <span className="truncate">{modalText.fallback}</span>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={url}
                  download="CV_TranMinhHieu.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-semibold hover:text-foreground transition-colors"
                >
                  {modalText.download}
                </a>
                <span>•</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-semibold hover:text-foreground transition-colors"
                >
                  {modalText.openTab}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
