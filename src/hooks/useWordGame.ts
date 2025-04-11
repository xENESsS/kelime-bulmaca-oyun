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
    maxAttempts: 5,
    error: null,
    evaluations: [],
  });

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = useCallback(() => {
    const newTargetWord = getRandomWord();
    console.log('Target word:', newTargetWord);

    setGameState({
      targetWord: newTargetWord,
      currentAttempt: '',
      attempts: [],
      letterStates: {},
      gameStatus: 'playing',
      maxAttempts: 5,
      error: null,
      evaluations: [],
    });
  }, []);

  const addCharacter = useCallback((char: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentAttempt.length >= 5) return;

    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt + char.toLowerCase(),
      error: null,
    }));
  }, [gameState.gameStatus, gameState.currentAttempt]);

  const removeCharacter = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentAttempt.length === 0) return;

    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt.slice(0, -1),
      error: null,
    }));
  }, [gameState.gameStatus, gameState.currentAttempt]);

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
        const targetIndex = targetLetters.indexOf(attemptLetters[i]);
        if (targetIndex !== -1) {
          result[i] = 'present';
          targetLetters[targetIndex] = '#';
        }
      }
    }
    
    return result;
  }, []);

  const updateLetterStates = useCallback((attempt: string, evaluation: LetterState[]) => {
    setGameState((prev) => {
      const newLetterStates = { ...prev.letterStates };
      
      attempt.split('').forEach((letter, index) => {
        const currentState = newLetterStates[letter];
        const newState = evaluation[index];
        
        if (!currentState) {
          newLetterStates[letter] = newState;
        } else if (currentState === 'absent' && (newState === 'present' || newState === 'correct')) {
          newLetterStates[letter] = newState;
        } else if (currentState === 'present' && newState === 'correct') {
          newLetterStates[letter] = newState;
        }
      });
      
      return {
        ...prev,
        letterStates: newLetterStates,
      };
    });
  }, []);

  const submitAttempt = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    
    const attempt = gameState.currentAttempt.toLowerCase();
    
    if (attempt.length !== 5) {
      setGameState(prev => ({
        ...prev,
        error: "Kelime 5 harfli olmalıdır!"
      }));
      return;
    }
    
    if (!isValidWord(attempt)) {
      setGameState(prev => ({
        ...prev,
        error: "Geçerli bir kelime değil!"
      }));
      return;
    }
    
    if (gameState.attempts.includes(attempt)) {
      setGameState(prev => ({
        ...prev,
        error: "Bu kelimeyi zaten denediniz!"
      }));
      return;
    }
    
    const evaluation = evaluateAttempt(attempt, gameState.targetWord);
    updateLetterStates(attempt, evaluation);
    
    setGameState(prev => {
      const newAttempts = [...prev.attempts, attempt];
      const newEvaluations = [...prev.evaluations, evaluation];
      
      const hasWon = attempt === prev.targetWord;
      const hasLost = !hasWon && newAttempts.length >= prev.maxAttempts;
      
      let newGameStatus = prev.gameStatus;
      
      if (hasWon) {
        newGameStatus = 'won';
        toast({
          title: "TEBRİKLER KAZANDIN! 🎉",
          description: `Doğru kelimeyi buldunuz: ${prev.targetWord.toUpperCase()}`,
        });
      } else if (hasLost) {
        newGameStatus = 'lost';
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
        gameStatus: newGameStatus,
        error: null,
      };
    });
  }, [gameState, evaluateAttempt, updateLetterStates]);

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.gameStatus, addCharacter, removeCharacter, submitAttempt]);

  return {
    gameState,
    addCharacter,
    removeCharacter,
    submitAttempt,
    startNewGame,
  };
};
