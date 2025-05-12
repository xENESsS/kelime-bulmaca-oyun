
import React from 'react';
import { useWordGame } from '@/hooks/useWordGame';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import GameHeader from '@/components/GameHeader';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GameHeader 
        onNewGame={startNewGame}
        attemptsLeft={attemptsLeft}
        gameStatus={gameStatus}
      />
      
      <main className={`flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full ${isMobile ? 'pb-40' : ''}`}>
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
          
          {/* Game Status Message - Placed between board and keyboard */}
          {gameStatus !== 'playing' && (
            <div className={`mx-auto text-center my-4 font-bold ${gameStatus === 'won' ? 'text-green-600' : 'text-red-600'}`}>
              <div className="flex flex-col items-center justify-center gap-1 text-lg">
                <span>
                  {gameStatus === 'won' ? 'TEBRİKLER KAZANDIN!' : 'ÜZGÜNÜM KAYBETTİN!'}
                </span>
                {targetWord && (
                  <div className="mt-1">
                    {gameStatus === 'lost' && <span className="font-medium">DOĞRU KELİME: </span>}
                    <span className="uppercase font-bold">{targetWord}</span>
                  </div>
                )}
                {gameStatus === 'lost' && (
                  <Button 
                    onClick={startNewGame} 
                    variant="outline" 
                    className="mt-3 bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                  >
                    YENİDEN DENE
                  </Button>
                )}
              </div>
            </div>
          )}
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
      
      <footer className={`py-4 text-center text-sm text-gray-500 ${isMobile ? 'pb-16' : ''}`}>
        <p>© 2025 Kelime Bulmaca Oyunu - Türkçe Wordle Benzeri Oyun</p>
      </footer>
    </div>
  );
};

export default GamePage;
