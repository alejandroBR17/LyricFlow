import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Trash2, Clock, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryModal({
  isOpen,
  history,
  onClose,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}: HistoryModalProps) {
  // Fecha ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="history-modal-title"
                    className="font-semibold text-base text-gray-900 dark:text-white"
                  >
                    Histórico de Letras
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {history.length} {history.length === 1 ? 'música salva' : 'músicas salvas'} no aparelho
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearAll}
                    title="Limpar todo o histórico"
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Limpar tudo
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lista */}
            <div className="overflow-y-auto p-3 flex-1">
              {history.length === 0 ? (
                <div className="py-14 px-4 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nenhuma letra salva ainda
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                      Ao clicar em "Copiar Letra", a música será salva automaticamente aqui para consultas e reutilizações futuras.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 bg-white dark:bg-gray-800/40 hover:bg-blue-50/40 dark:hover:bg-gray-800 transition-all cursor-pointer"
                      onClick={() => onSelectItem(item)}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {item.title}
                          </span>
                          {item.slideCount !== undefined && item.slideCount > 0 && (
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shrink-0 tabular-nums">
                              {item.slideCount} slides
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">
                          {item.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          title="Remover do histórico"
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="p-2 text-blue-600 dark:text-blue-400 rounded-lg">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
