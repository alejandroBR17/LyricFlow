import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { InputPane } from './components/InputPane';
import { OutputPane } from './components/OutputPane';
import { HistoryModal } from './components/HistoryModal';
import { SlidePreviewModal } from './components/SlidePreviewModal';
import { processLyrics } from './lib/cleaner';
import { triggerHaptic } from './lib/utils';
import { useLyricsHistory } from './hooks/useLyricsHistory';
import { SAMPLE_LYRICS } from './lib/sampleLyrics';
import { CleanOptions, HistoryItem } from './types';
import { Copy, Sparkles, SlidersHorizontal, Monitor } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [autoClean, setAutoClean] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [toastMessage, setToastMessage] = useState('');
  const [isDesktop, setIsDesktop] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Regras de formatação
  const [options, setOptions] = useState<CleanOptions>({
    linesPerBlock: 2,
    uppercaseTitle: true,
    removeChords: true,
    removeSections: true,
    removeRepetitions: true,
  });

  // Histórico local
  const { history, saveToHistory, removeItem, clearHistory } = useLyricsHistory();

  // Gestos de toque mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Sincroniza tema e escuta largura de tela
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const showToast = useCallback((msg: string, duration = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), duration);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Processamento de letra
  const runCleaning = useCallback(
    (text: string, currentOptions: CleanOptions) => {
      return processLyrics(text, currentOptions);
    },
    []
  );

  useEffect(() => {
    if (autoClean) {
      setOutputText(runCleaning(inputText, options));
    }
  }, [inputText, autoClean, options, runCleaning]);

  const handleManualClean = useCallback(() => {
    setOutputText(runCleaning(inputText, options));
    showToast('Letra formatada com sucesso!');
  }, [inputText, options, runCleaning, showToast]);

  const handleSaveToHistory = useCallback(() => {
    if (inputText.trim() && outputText.trim()) {
      saveToHistory(inputText, outputText);
    }
  }, [inputText, outputText, saveToHistory]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      showToast('Texto colado da área de transferência!');
      if (autoClean) {
        setTimeout(() => setActiveTab('output'), 200);
      }
    } catch (err) {
      showToast('Permissão negada. Use Ctrl+V para colar na caixa de texto.', 4000);
    }
  }, [autoClean, showToast]);

  const handleLoadSample = useCallback(() => {
    setInputText(SAMPLE_LYRICS);
    showToast('Música de exemplo carregada!');
    if (autoClean) {
      setTimeout(() => setActiveTab('output'), 200);
    }
  }, [autoClean, showToast]);

  const handleCopyFab = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      triggerHaptic(30);
      showToast('Copiado para a área de transferência!');
      handleSaveToHistory();
    } catch (err) {
      showToast('Erro ao copiar.');
    }
  }, [outputText, handleSaveToHistory, showToast]);

  const handleSelectHistoryItem = useCallback(
    (item: HistoryItem) => {
      setInputText(item.original);
      setIsHistoryOpen(false);
      showToast(item.title);
      if (autoClean) {
        setTimeout(() => setActiveTab('output'), 200);
      } else {
        setActiveTab('input');
      }
    },
    [autoClean, showToast]
  );

  // Atalho de teclado: Ctrl/Cmd + Enter para formatar ou copiar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!autoClean) {
          handleManualClean();
          setActiveTab('output');
        } else if (outputText) {
          handleCopyFab();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoClean, handleManualClean, outputText, handleCopyFab]);

  // Gestos de toque mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && activeTab === 'input') {
      setActiveTab('output');
    }
    if (isRightSwipe && activeTab === 'output') {
      setActiveTab('input');
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden font-sans">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main
        className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-3 sm:gap-4 overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Barra de Preferências e Ações Rápidas */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-gray-900/90 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800/80 shadow-xs transition-colors duration-200 shrink-0">
          <div className="flex items-center gap-4">
            {/* Formatação Automática */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={autoClean}
                  onChange={(e) => setAutoClean(e.target.checked)}
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors ${
                    autoClean ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
                <div
                  className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                    autoClean ? 'transform translate-x-4' : ''
                  }`}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Formatação Automática
              </span>
            </label>

            {/* Gaveta de Regras */}
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                showOptions
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title="Ajustar regras de limpeza e tamanho do slide"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Regras</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!autoClean && isDesktop && (
              <button
                onClick={() => {
                  handleManualClean();
                  setActiveTab('output');
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-colors"
              >
                Formatar Agora
              </button>
            )}
          </div>
        </div>

        {/* Gaveta de Regras */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Linhas por slide:
                  </span>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                    {[2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setOptions((prev) => ({ ...prev, linesPerBlock: num }))
                        }
                        className={`px-2.5 py-0.5 rounded-md font-semibold text-xs transition-all ${
                          options.linesPerBlock === num
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.uppercaseTitle}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        uppercaseTitle: e.target.checked,
                      }))
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                  />
                  <span>Título em CAIXA ALTA</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.removeChords}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        removeChords: e.target.checked,
                      }))
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                  />
                  <span>Remover Cifras e Acordes</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Abas Mobile */}
        <div className="lg:hidden flex bg-gray-200/70 dark:bg-gray-800/70 p-1 rounded-xl shrink-0 relative">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 relative z-10 py-2 px-4 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === 'input'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Entrada
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex-1 relative z-10 py-2 px-4 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === 'output'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Slides Prontos
          </button>
          <motion.div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-gray-900 rounded-lg shadow-xs"
            animate={{ x: activeTab === 'input' ? 0 : '100%' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
        </div>

        {/* Layout Duplo (Desktop) ou Abas Deslizáveis (Mobile) */}
        {isDesktop ? (
          <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
            <InputPane
              value={inputText}
              onChange={setInputText}
              onClear={() => setInputText('')}
              onPaste={handlePaste}
              onLoadSample={handleLoadSample}
            />
            <OutputPane
              value={outputText}
              onChange={setOutputText}
              onCopy={handleSaveToHistory}
              onOpenPreview={() => setIsPreviewOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 relative min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'input' ? (
                <motion.div
                  key="input"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 h-full"
                >
                  <InputPane
                    value={inputText}
                    onChange={setInputText}
                    onClear={() => setInputText('')}
                    onPaste={handlePaste}
                    onLoadSample={handleLoadSample}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 h-full"
                >
                  <OutputPane
                    value={outputText}
                    onChange={setOutputText}
                    onCopy={handleSaveToHistory}
                    onOpenPreview={() => setIsPreviewOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões Flutuantes Mobile (FABs) */}
            <AnimatePresence>
              {!autoClean && activeTab === 'input' && inputText.length > 0 && (
                <motion.button
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    handleManualClean();
                    setActiveTab('output');
                  }}
                  className="absolute bottom-6 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center border border-blue-500"
                  title="Formatar Agora"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.button>
              )}
              {activeTab === 'output' && outputText.length > 0 && (
                <div className="absolute bottom-6 right-4 z-40 flex items-center gap-2">
                  <motion.button
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPreviewOpen(true)}
                    className="bg-indigo-600 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center border border-indigo-500"
                    title="Visualizar em Telão 16:9"
                  >
                    <Monitor className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyFab}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center border border-blue-500"
                    title="Copiar Letra"
                  >
                    <Copy className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Notificação Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-6 left-1/2 bg-gray-950 dark:bg-gray-100 text-white dark:text-gray-950 px-4 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm font-medium z-50 whitespace-nowrap border border-gray-800 dark:border-gray-200"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Histórico */}
        <HistoryModal
          isOpen={isHistoryOpen}
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onSelectItem={handleSelectHistoryItem}
          onDeleteItem={removeItem}
          onClearAll={clearHistory}
        />

        {/* Modal de Prévia de Projeção 16:9 */}
        <SlidePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          text={outputText}
        />
      </main>
    </div>
  );
}
