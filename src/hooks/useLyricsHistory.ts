import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../types';
import { calculateLyricStats } from '../lib/cleaner';

const STORAGE_KEY = 'lyricCleanerHistory';
const MAX_HISTORY_ITEMS = 20;

export function useLyricsHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load history from localStorage:', err);
    }
  }, []);

  // Save history to localStorage
  const persistHistory = useCallback((items: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to persist history to localStorage:', err);
    }
  }, []);

  const saveToHistory = useCallback(
    (original: string, cleaned: string) => {
      if (!original.trim()) return;

      const titleMatch = cleaned.trim().split('\n')[0];
      const title = titleMatch || 'Sem título';
      const stats = calculateLyricStats(cleaned);

      setHistory((prev) => {
        // Prevent duplicate of the most recent item
        if (prev[0] && prev[0].original.trim() === original.trim()) {
          return prev;
        }

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          title,
          original,
          cleaned,
          slideCount: stats.slides,
          date: new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        persistHistory(updated);
        return updated;
      });
    },
    [persistHistory]
  );

  const removeItem = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistHistory(updated);
        return updated;
      });
    },
    [persistHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }, []);

  return {
    history,
    saveToHistory,
    removeItem,
    clearHistory,
  };
}
