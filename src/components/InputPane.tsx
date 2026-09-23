import React, { useMemo, useState } from 'react';
import { ClipboardPaste, Trash2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../lib/utils';
import { SAMPLE_LYRICS } from '../lib/sampleLyrics';

interface InputPaneProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onPaste: () => void;
  onLoadSample?: () => void;
}

export function InputPane({
  value,
  onChange,
  onClear,
  onPaste,
  onLoadSample,
}: InputPaneProps) {
  const [isClearing, setIsClearing] = useState(false);

  const stats = useMemo(() => {
    const chars = value.length;
    const lines = value ? value.split('\n').filter((l) => l.trim().length > 0).length : 0;
    return { chars, lines };
  }, [value]);

  const handleClear = () => {
    triggerHaptic(30);
    setIsClearing(true);
    setTimeout(() => {
      onClear();
      setIsClearing(false);
    }, 200);
  };

  const handleLoadSample = () => {
    triggerHaptic(20);
    if (onLoadSample) {
      onLoadSample();
    } else {
      onChange(SAMPLE_LYRICS);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800/80 overflow-hidden shadow-xs transition-colors duration-200">
      {/* Barra Superior */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-xs tracking-wider uppercase">
          Letras Originais
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadSample}
            title="Carregar música de exemplo com cifras e seções"
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 min-h-[38px] sm:min-h-[40px] text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors border border-blue-200/60 dark:border-blue-800/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Exemplo</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPaste}
            title="Colar texto da área de transferência"
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 min-h-[38px] sm:min-h-[40px] text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700/60"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Colar</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            disabled={!value}
            title="Limpar texto"
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 min-h-[38px] sm:min-h-[40px] text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-red-200/50 dark:border-red-900/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 relative overflow-hidden">
        <motion.textarea
          animate={{
            opacity: isClearing ? 0 : 1,
            y: isClearing ? 15 : 0,
            scale: isClearing ? 0.99 : 1,
          }}
          transition={{ duration: 0.15 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole as letras originais aqui... (com cifras, emojis, anotações de repetição, etc.)&#10;&#10;Dica: Clique no botão 'Exemplo' acima para ver uma demonstração imediata!"
          className="w-full h-full resize-none outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 leading-relaxed font-sans pb-20 lg:pb-0"
          aria-label="Área de entrada para letras originais"
        />
      </div>

      {/* Rodapé com Estatísticas */}
      <div className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center shrink-0">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:inline">
          Cifras, acordes e seções limpos automaticamente
        </span>
        <div className="flex gap-3 tabular-nums ml-auto sm:ml-0">
          <span>{stats.lines} {stats.lines === 1 ? 'linha' : 'linhas'}</span>
          <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
          <span>{stats.chars} caracteres</span>
        </div>
      </div>
    </div>
  );
}
