
import React from 'react';
import GameInstructions from './GameInstructions';

interface GameHeaderProps {
  onNewGame: () => void;
  attemptsLeft: number;
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  attemptsLeft,
  gameStatus
}) => {
  return (
    <header className="p-4 flex flex-col md:flex-row justify-between items-center border-b gap-2">
      <div className="flex items-center">
        <GameInstructions />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-game-primary">
        Kelime Bulmaca
      </h1>
      
      <div className="flex items-center gap-2">
        {gameStatus === 'playing' && (
          <div className="text-sm font-medium">
            {attemptsLeft} Hak
          </div>
        )}
      </div>
    </header>
  );
};

export default GameHeader;
