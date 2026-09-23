import React, { useMemo, useState, useCallback } from 'react';
import { Copy, Check, Edit3, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/utils';
import { calculateLyricStats } from '../lib/cleaner';
import { Translations } from '../lib/i18n';

interface OutputPaneProps {
  value: string;
  onChange: (value: string) => void;
  onCopy?: () => void;
  onOpenPreview?: () => void;
  t: Translations;
}

export function OutputPane({
  value,
  onChange,
  onCopy,
  onOpenPreview,
  t,
}: OutputPaneProps) {
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    return calculateLyricStats(value);
  }, [value]);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      triggerHaptic(30);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }, [value, onCopy]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800/80 overflow-hidden shadow-xs transition-colors duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-xs tracking-wider uppercase">
            {t.outputTitle}
          </h2>
          <span
            className="flex items-center text-xs text-gray-400 dark:text-gray-500"
            title={t.editableHint}
          >
            <Edit3 className="w-3 h-3" />
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Slide Preview Button */}
          {stats.slides > 0 && onOpenPreview && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenPreview}
              title={t.previewSlides}
              className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 min-h-[38px] sm:min-h-[40px] text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t.previewSlides}</span>
            </motion.button>
          )}

          {/* Copy Button */}
          <motion.button
            whileTap={value ? { scale: 0.95 } : undefined}
            onClick={handleCopy}
            disabled={!value}
            className={`flex items-center justify-center gap-1.5 px-3 min-h-[38px] sm:min-h-[40px] text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-xs ${
              copied
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed border border-blue-500'
            }`}
            title={t.copyButton}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.copiedButton}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyButton}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.outputPlaceholder}
          className="w-full h-full resize-none outline-none bg-transparent font-sans text-gray-800 dark:text-gray-100 leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600 pb-20 lg:pb-0"
          aria-label={t.outputTitle}
        />
      </div>

      {/* Footer Stats with Tabular Numerals */}
      <div className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center shrink-0">
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          {stats.slides > 0 ? t.slidesCount(stats.slides) : t.waitingLyrics}
        </span>
        <div className="flex gap-3 tabular-nums">
          <span>{t.wordsCount(stats.words)}</span>
          <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
          <span>{t.charsCount(stats.chars)}</span>
        </div>
      </div>
    </div>
  );
}
