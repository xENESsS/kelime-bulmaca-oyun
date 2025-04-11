
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

  // Initialize the game with a random word
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a new game with a fresh state
  const startNewGame = useCallback(() => {
    const newTargetWord = getRandomWord();
    console.log('Target word:', newTargetWord); // For debugging

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

  // Add a character to the current attempt
  const addCharacter = useCallback((char: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentAttempt.length >= 5) return;

    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt + char.toLowerCase(),
      error: null,
    }));
  }, [gameState.gameStatus, gameState.currentAttempt]);

  // Remove the last character from the current attempt
  const removeCharacter = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentAttempt.length === 0) return;

    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt.slice(0, -1),
      error: null,
    }));
  }, [gameState.gameStatus, gameState.currentAttempt]);

  // Evaluate the current attempt
  const evaluateAttempt = useCallback((attempt: string, targetWord: string): LetterState[] => {
    const result: LetterState[] = Array(5).fill('absent');
    const targetLetters = targetWord.split('');
    const attemptLetters = attempt.split('');
    
    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
      if (attemptLetters[i] === targetLetters[i]) {
        result[i] = 'correct';
        targetLetters[i] = '#'; // Mark as used
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (result[i] === 'absent') {
        const targetIndex = targetLetters.indexOf(attemptLetters[i]);
        if (targetIndex !== -1) {
          result[i] = 'present';
          targetLetters[targetIndex] = '#'; // Mark as used
        }
      }
    }
    
    return result;
  }, []);

  // Update keyboard letter states
  const updateLetterStates = useCallback((attempt: string, evaluation: LetterState[]) => {
    setGameState((prev) => {
      const newLetterStates = { ...prev.letterStates };
      
      attempt.split('').forEach((letter, index) => {
        const currentState = newLetterStates[letter];
        const newState = evaluation[index];
        
        // Only upgrade the state (absent < present < correct)
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

  // Submit the current attempt
  const submitAttempt = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    
    const attempt = gameState.currentAttempt.toLowerCase();
    
    // Check if the attempt is 5 characters
    if (attempt.length !== 5) {
      setGameState(prev => ({
        ...prev,
        error: "Kelime 5 harfli olmalıdır!"
      }));
      return;
    }
    
    // Check if the attempt is a valid word
    if (!isValidWord(attempt)) {
      setGameState(prev => ({
        ...prev,
        error: "Geçerli bir kelime değil!"
      }));
      return;
    }
    
    // Check if the word has already been used
    if (gameState.attempts.includes(attempt)) {
      setGameState(prev => ({
        ...prev,
        error: "Bu kelimeyi zaten denediniz!"
      }));
      return;
    }
    
    // Evaluate the attempt
    const evaluation = evaluateAttempt(attempt, gameState.targetWord);
    updateLetterStates(attempt, evaluation);
    
    // Update game state
    setGameState(prev => {
      const newAttempts = [...prev.attempts, attempt];
      const newEvaluations = [...prev.evaluations, evaluation];
      
      // Check if the player won
      const hasWon = attempt === prev.targetWord;
      // Check if the player lost
      const hasLost = !hasWon && newAttempts.length >= prev.maxAttempts;
      
      let newGameStatus = prev.gameStatus;
      
      if (hasWon) {
        newGameStatus = 'won';
        toast({
          title: "Tebrikler! 🎉",
          description: `Doğru kelimeyi buldunuz: ${prev.targetWord.toUpperCase()}`,
        });
      } else if (hasLost) {
        newGameStatus = 'lost';
        toast({
          title: "Üzgünüz! 😞",
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

  // Handle keyboard input
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
