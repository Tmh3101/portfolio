'use client';

import { useEffect } from 'react';

// Temporary anti-DevTools test flags. Set to false to disable the trap quickly.
const ENABLE_DEVTOOLS_TRAP = true;
// Docked DevTools usually changes the visible browser size by a noticeable amount.
const DEVTOOLS_SIZE_THRESHOLD = 160;
// How aggressively the page should pause execution while DevTools is detected.
const DEBUGGER_SPAM_INTERVAL_MS = 120;

export default function DevToolsTrap() {
  useEffect(() => {
    if (!ENABLE_DEVTOOLS_TRAP) {
      return undefined;
    }

    let debuggerIntervalId = null;
    let hasWarnedAboutDevTools = false;

    const runDebuggerTrap = () => {
      // eslint-disable-next-line no-debugger
      debugger;
    };

    const showDevToolsWarning = () => {
      if (hasWarnedAboutDevTools) {
        return;
      }

      hasWarnedAboutDevTools = true;
      console.warn(
        '%cStop',
        'color: #b91c1c; font-size: 48px; font-weight: 800; letter-spacing: 0.08em;',
      );
      console.warn(
        '%cThis panel is for developers. Do not paste code or run commands here unless you understand exactly what they do.',
        'color: #f59e0b; font-size: 14px; font-weight: 600;',
      );
    };

    const startDebuggerSpam = () => {
      if (debuggerIntervalId !== null) {
        return;
      }

      runDebuggerTrap();
      debuggerIntervalId = window.setInterval(runDebuggerTrap, DEBUGGER_SPAM_INTERVAL_MS);
    };

    const stopDebuggerSpam = () => {
      if (debuggerIntervalId === null) {
        return;
      }

      window.clearInterval(debuggerIntervalId);
      debuggerIntervalId = null;
    };

    const isDevToolsOpen = () => {
      const widthGap = window.outerWidth - window.innerWidth > DEVTOOLS_SIZE_THRESHOLD;
      const heightGap = window.outerHeight - window.innerHeight > DEVTOOLS_SIZE_THRESHOLD;
      return widthGap || heightGap;
    };

    const syncDebuggerTrap = () => {
      if (isDevToolsOpen()) {
        showDevToolsWarning();
        startDebuggerSpam();
        return;
      }

      hasWarnedAboutDevTools = false;
      stopDebuggerSpam();
    };

    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const isF12 = key === 'F12';
      const isWindowsDevToolsShortcut =
        event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(key);
      const isMacDevToolsShortcut =
        event.metaKey && event.altKey && ['I', 'J', 'C'].includes(key);
      const isViewSourceShortcut =
        (event.ctrlKey && key === 'U') || (event.metaKey && event.altKey && key === 'U');

      if (!isF12 && !isWindowsDevToolsShortcut && !isMacDevToolsShortcut && !isViewSourceShortcut) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      showDevToolsWarning();
      startDebuggerSpam();
    };

    const pollId = window.setInterval(syncDebuggerTrap, 500);

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', syncDebuggerTrap);
    syncDebuggerTrap();

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', syncDebuggerTrap);
      window.clearInterval(pollId);
      stopDebuggerSpam();
    };
  }, []);

  return null;
}
