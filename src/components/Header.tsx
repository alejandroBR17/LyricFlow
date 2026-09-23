import React from 'react';
import { Moon, Sun, Layers, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export function Header({
  theme,
  toggleTheme,
  onOpenHistory,
  historyCount = 0,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-colors duration-200 shrink-0 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Marca: Nome em inglês com identidade moderna */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100 font-sans">
                LyricFlow
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden md:block">
              Formatador de Letras para Projeção & Louvor
            </span>
          </div>
        </div>

        {/* Zona Central: Compatibilidade com softwares usados no Brasil */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Holyrics</span>
          <span aria-hidden="true">·</span>
          <span>ProPresenter</span>
          <span aria-hidden="true">·</span>
          <span>OpenLP</span>
          <span aria-hidden="true">·</span>
          <span>PowerPoint</span>
        </div>

        {/* Ações: Histórico e Tema */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botão de Histórico */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Ver histórico de músicas salvas"
            aria-label="Abrir histórico de letras"
          >
            <Clock className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 ring-2 ring-white dark:ring-gray-950" />
            )}
          </motion.button>

          {/* Alternador de Tema */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center overflow-hidden"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar tema de cores"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
