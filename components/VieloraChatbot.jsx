'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function VieloraChatbot() {
  const pathname = usePathname();
  const isAdminOrLogin = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  useEffect(() => {
    if (isAdminOrLogin) {
      if (typeof window !== 'undefined' && window.Vielora?.remove) {
        window.Vielora.remove();
      } else if (typeof document !== 'undefined') {
        const bubble = document.getElementById('chatbotai-bubble');
        const chat = document.getElementById('chatbotai-chat');
        bubble?.remove();
        chat?.remove();
      }
    } else if (typeof window !== 'undefined' && window.Vielora?.init) {
      if (!document.getElementById('chatbotai-bubble')) {
        window.Vielora.init('c4b51f5a-2188-4b0a-a851-94ce08eff685', {
          baseUrl: 'https://vielora.vn',
        });
      }
    }
  }, [isAdminOrLogin]);

  if (isAdminOrLogin) {
    return null;
  }

  return (
    <Script
      src="https://vielora.vn/widget.js"
      data-bot-id="c4b51f5a-2188-4b0a-a851-94ce08eff685"
      data-base-url="https://vielora.vn"
      id="vielora-script"
      strategy="afterInteractive"
    />
  );
}
