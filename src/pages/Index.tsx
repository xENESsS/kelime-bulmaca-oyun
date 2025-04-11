
import React from 'react';
import { useWordGame } from '@/hooks/useWordGame';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import GameHeader from '@/components/GameHeader';
import { Alert, AlertDescription } from "@/components/ui/alert";

const GamePage = () => {
  const { 
    gameState, 
    addCharacter, 
    removeCharacter, 
    submitAttempt, 
    startNewGame 
  } = useWordGame();

  const { 
    attempts, 
    currentAttempt, 
    maxAttempts, 
    letterStates, 
    gameStatus, 
    error, 
    evaluations,
    targetWord
  } = gameState;

  const attemptsLeft = maxAttempts - attempts.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameHeader 
        onNewGame={startNewGame}
        attemptsLeft={attemptsLeft}
        gameStatus={gameStatus}
        targetWord={targetWord}
      />
      
      <main className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full">
        <div className="w-full">
          {error && (
            <Alert variant="destructive" className="mt-4 mx-4 animate-shake">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <GameBoard
            attempts={attempts}
            currentAttempt={currentAttempt}
            maxAttempts={maxAttempts}
            evaluations={evaluations}
          />
          
          {/* Removing this alert since we're now showing the target word in the header */}
        </div>
        
        <div className="w-full mt-auto">
          <Keyboard
            onKeyPress={addCharacter}
            onEnter={submitAttempt}
            onBackspace={removeCharacter}
            letterStates={letterStates}
            disabled={gameStatus !== 'playing'}
          />
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2025 Kelime Bulmaca Oyunu - Türkçe Wordle Benzeri Oyun</p>
      </footer>
    </div>
  );
};

export default GamePage;
