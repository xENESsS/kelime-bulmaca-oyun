
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameInstructions from './GameInstructions';
import SettingsModal from './SettingsModal';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="p-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2">
        <div className="flex items-center">
          <GameInstructions />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-game-primary dark:text-game-light">
          Kelime Bulmaca
        </h1>
        
        <div className="flex items-center gap-2">
          {gameStatus === 'playing' && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {attemptsLeft} Hak
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="ml-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default GameHeader;
