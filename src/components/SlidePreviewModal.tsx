import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Monitor, Layers } from 'lucide-react';

interface SlidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

export function SlidePreviewModal({
  isOpen,
  onClose,
  text,
}: SlidePreviewModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Divide os slides por 2 ou mais quebras de linha
  const slides = useMemo(() => {
    if (!text || !text.trim()) return [];
    return text
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [text]);

  const totalSlides = slides.length;

  // Reinicia o índice ao abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
    }
  }, [isOpen, text]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  // Navegação por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  const currentContent = slides[currentSlideIndex] || '';
  const isTitleSlide = currentSlideIndex === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-preview-title"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-950 text-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden border border-gray-800"
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
                <Monitor className="w-4 h-4" />
              </div>
              <h3
                id="slide-preview-title"
                className="font-medium text-sm text-gray-200"
              >
                Prévia de Projeção 16:9
              </h3>
              <span className="text-gray-500 text-xs hidden sm:inline">·</span>
              <span className="text-xs text-gray-400 hidden sm:inline tabular-nums">
                {totalSlides > 0 ? `Slide ${currentSlideIndex + 1} de ${totalSlides}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 hidden md:inline">
                Use as setas ← e → do teclado para navegar
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Telão 16:9 */}
          <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-900/60">
            <div className="relative w-full aspect-video max-h-[50vh] bg-black rounded-xl border border-gray-800 shadow-2xl flex flex-col items-center justify-center p-6 sm:p-10 select-none overflow-hidden group">
              {/* Iluminação ambiente do telão */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-black pointer-events-none" />

              {/* Marca sutil de formato */}
              <div className="absolute top-4 left-4 flex items-center gap-2 opacity-30 text-[10px] uppercase font-mono tracking-widest text-gray-400">
                <Layers className="w-3 h-3" />
                <span>Formato Telão 16:9</span>
              </div>

              {/* Conteúdo do Slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="z-10 text-center max-w-2xl px-4"
                >
                  {isTitleSlide ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                        Título da Música
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        {currentContent}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentContent.split('\n').map((line, idx) => (
                        <p
                          key={idx}
                          className="text-lg sm:text-2xl md:text-3xl font-medium tracking-normal text-gray-100 leading-snug drop-shadow-md"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Botões de Navegação Direta na Tela */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Contador Interno */}
              <div className="absolute bottom-3 right-4 text-[11px] font-mono text-gray-500 tabular-nums">
                {currentSlideIndex + 1} / {totalSlides}
              </div>
            </div>
          </div>

          {/* Rodapé de Navegação */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-950 shrink-0">
            <button
              onClick={handlePrev}
              disabled={totalSlides <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Trilha de Pontos */}
            <div className="flex items-center gap-1 max-w-[200px] overflow-hidden">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-5 bg-blue-500'
                      : 'w-1.5 bg-gray-700 hover:bg-gray-500'
                  }`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={totalSlides <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
