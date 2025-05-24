import { useState, useEffect, useCallback } from 'react'; 
import { getRandomWord, isValidWord } from '../data/words';
import { toast } from '@/components/ui/use-toast';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GameState {
  targetWord: string;
  currentAttempt: string;
  attempts: string[];
  letterStates: Record<string, LetterState>;
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
  error: string | null;
  evaluations: LetterState[][];
}

export const useWordGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    currentAttempt: '',
    attempts: [],
    letterStates: {},
    gameStatus: 'playing',
    maxAttempts: 6,
    error: null,
    evaluations: [],
  });

  // Yeni oyun başlat
  const startNewGame = useCallback(() => {
    const newTargetWord = getRandomWord();
    setGameState({
      targetWord: newTargetWord,
      currentAttempt: '',
      attempts: [],
      letterStates: {},
      gameStatus: 'playing',
      maxAttempts: 6,
      error: null,
      evaluations: [],
    });
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Harf ekle
  const addCharacter = useCallback((char: string) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || prev.currentAttempt.length >= 5) return prev;
      return {
        ...prev,
        currentAttempt: prev.currentAttempt + char.toLowerCase(),
        error: null,
      };
    });
  }, []);

  // Harf sil
  const removeCharacter = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || prev.currentAttempt.length === 0) return prev;
      return {
        ...prev,
        currentAttempt: prev.currentAttempt.slice(0, -1),
        error: null,
      };
    });
  }, []);

  // Denemeyi değerlendir
  const evaluateAttempt = useCallback((attempt: string, targetWord: string): LetterState[] => {
    const result: LetterState[] = Array(5).fill('absent');
    const targetLetters = targetWord.split('');
    const attemptLetters = attempt.split('');

    for (let i = 0; i < 5; i++) {
      if (attemptLetters[i] === targetLetters[i]) {
        result[i] = 'correct';
        targetLetters[i] = '#';
      }
    }
    for (let i = 0; i < 5; i++) {
      if (result[i] === 'absent') {
        const index = targetLetters.indexOf(attemptLetters[i]);
        if (index !== -1) {
          result[i] = 'present';
          targetLetters[index] = '#';
        }
      }
    }
    return result;
  }, []);

  // Harf durumlarını güncelle
  const updateLetterStates = useCallback((attempt: string, evaluation: LetterState[]) => {
    setGameState(prev => {
      const newStates = { ...prev.letterStates };
      attempt.split('').forEach((letter, i) => {
        const currentState = newStates[letter];
        const newState = evaluation[i];
        if (!currentState || 
            (currentState === 'absent' && (newState === 'present' || newState === 'correct')) || 
            (currentState === 'present' && newState === 'correct')) {
          newStates[letter] = newState;
        }
      });
      return { ...prev, letterStates: newStates };
    });
  }, []);

  // Tahmini gönder
  const submitAttempt = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const attempt = prev.currentAttempt.toLowerCase();

      if (attempt.length !== 5) {
        return { ...prev, error: "Kelime 5 harfli olmalıdır!" };
      }
      if (!isValidWord(attempt)) {
        return { ...prev, error: "Geçerli bir kelime değil!" };
      }
      if (prev.attempts.includes(attempt)) {
        return { ...prev, error: "Bu kelimeyi zaten denediniz!" };
      }

      const evaluation = evaluateAttempt(attempt, prev.targetWord);
      updateLetterStates(attempt, evaluation);

      const newAttempts = [...prev.attempts, attempt];
      const newEvaluations = [...prev.evaluations, evaluation];

      const hasWon = attempt === prev.targetWord;
      const hasLost = !hasWon && newAttempts.length >= prev.maxAttempts;

      if (hasWon) {
        toast({
          title: "TEBRİKLER KAZANDIN! 🎉",
          description: `Doğru kelimeyi buldunuz: ${prev.targetWord.toUpperCase()}`,
        });
      } else if (hasLost) {
        toast({
          title: "ÜZGÜNÜM KAYBETTİN! 😞",
          description: `Doğru kelime: ${prev.targetWord.toUpperCase()} idi.`,
          variant: "destructive",
        });
      }

      return {
        ...prev,
        attempts: newAttempts,
        evaluations: newEvaluations,
        currentAttempt: '',
        gameStatus: hasWon ? 'won' : hasLost ? 'lost' : 'playing',
        error: null,
      };
    });
  }, [evaluateAttempt, updateLetterStates]);

  // Klavye dinleyicisi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      const key = e.key.toLowerCase();

      if (key === 'enter') {
        submitAttempt();
      } else if (key === 'backspace') {
        removeCharacter();
      } else if (/^[a-zçğıöşü]$/.test(key)) {
        addCharacter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, addCharacter, removeCharacter, submitAttempt]);

  return {
    gameState,
    addCharacter,
    removeCharacter,
    submitAttempt,
    startNewGame,
  };
};
