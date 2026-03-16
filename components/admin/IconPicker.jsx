'use client';

import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Search, X, Check } from 'lucide-react';

const COMMON_SOCIAL_ICONS = [
  // Social & Communication
  'Github',
  'Linkedin',
  'Facebook',
  'Twitter',
  'Instagram',
  'Youtube',
  'Globe',
  'Mail',
  'Phone',
  'MessageCircle',
  'Slack',
  'Discord',
  'Twitch',

  // Developer & Tech
  'Code2',
  'Terminal',
  'Database',
  'ServerCog',
  'Layers3',
  'Boxes',
  'Braces',
  'Workflow',
  'AppWindow',
  'Cpu',
  'Cloud',
  'Webhook',
  'Bug',
  'Wrench',
  'Infinity',
  'Binary',
  'Command',
  'SquareCode',
  'FileJson',
  'FileCode',

  // UI & Misc
  'ExternalLink',
  'Link2',
  'Share2',
  'User',
  'Briefcase',
  'GraduationCap',
  'Award',
  'Settings',
  'ShieldCheck',
  'Zap',
  'Rocket',
];

export const IconPicker = ({ value, onChange, label, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    // If empty search, show common ones first
    if (!term) {
      return COMMON_SOCIAL_ICONS.filter((name) => typeof Icons[name] !== 'undefined');
    }

    // Otherwise search through all available Lucide icons
    return Object.keys(Icons)
      .filter(
        (name) =>
          typeof Icons[name] === 'function' &&
          /^[A-Z]/.test(name) &&
          name !== 'createLucideIcon' &&
          name.toLowerCase().includes(term)
      )
      .slice(0, 50); // Limit results for performance
  }, [searchTerm]);

  const SelectedIcon = value && typeof Icons[value] !== 'undefined' ? Icons[value] : null;

  const handleSelect = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1.5 relative">
      {label && <label className="block text-sm font-bold text-[#4a5968]">{label}</label>}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`admin-form-input flex items-center justify-between cursor-pointer hover:border-[#1f4f82]/40 transition-colors ${
          error ? 'border-red-500' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {SelectedIcon ? (
            <SelectedIcon size={18} className="text-[#1f4f82]" />
          ) : (
            <div className="w-[18px] h-[18px] border border-dashed border-gray-300 rounded" />
          )}
          <span className={value ? 'text-[#13202a]' : 'text-gray-400'}>
            {value || 'Select an icon...'}
          </span>
        </div>
        <Icons.ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-[60] mt-2 w-full bg-white border border-[#e3e8ee] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-[#f1f4f8] bg-[#f8fafc]">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                autoFocus
                placeholder="Search icons (e.g. Github, Link...)"
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f4f82]/10 focus:border-[#1f4f82]/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-2 grid grid-cols-4 gap-1 custom-scrollbar">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((iconName) => {
                const Icon = Icons[iconName];
                if (!Icon) return null;

                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(iconName);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#1f4f82]/10 text-[#1f4f82] ring-1 ring-[#1f4f82]/20'
                        : 'hover:bg-[#f1f4f8] text-[#4a5968]'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="mt-1.5 text-[10px] truncate w-full text-center font-medium">
                      {iconName.length > 8 ? iconName.slice(0, 6) + '..' : iconName}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#1f4f82] text-white rounded-full p-0.5">
                        <Check size={8} />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-4 py-8 text-center text-sm text-gray-400">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>

          {!searchTerm && (
            <div className="p-2 border-t border-[#f1f4f8] bg-[#f8fafc]">
              <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Common Social Icons
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Overlay to close when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-[50]" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
