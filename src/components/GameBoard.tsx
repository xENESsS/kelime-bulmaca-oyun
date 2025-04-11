
import React from 'react';
import { LetterState } from '@/hooks/useWordGame';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  attempts: string[];
  currentAttempt: string;
  maxAttempts: number;
  evaluations: LetterState[][];
}

const getStateColor = (state: LetterState) => {
  switch (state) {
    case 'correct':
      return 'bg-game-correct border-green-300';
    case 'present':
      return 'bg-game-present border-yellow-300';
    case 'absent':
      return 'bg-game-absent border-gray-300';
    default:
      return 'bg-white border-gray-300';
  }
};

const LetterTile: React.FC<{
  letter: string;
  state?: LetterState;
  isRevealed: boolean;
  index: number;
}> = ({ letter, state = 'empty', isRevealed, index }) => {
  return (
    <div
      className={cn(
        "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-md font-bold text-2xl uppercase transition-all",
        isRevealed ? getStateColor(state) : "bg-white border-gray-300",
        isRevealed && "animate-flip",
        !isRevealed && letter && "animate-pop"
      )}
      style={{ animationDelay: isRevealed ? `${index * 150}ms` : "0ms" }}
    >
      {letter}
    </div>
  );
};

const EmptyRow: React.FC = () => {
  return (
    <div className="flex gap-2 mb-2">
      {Array(5).fill(null).map((_, i) => (
        <LetterTile key={i} letter="" isRevealed={false} index={i} />
      ))}
    </div>
  );
};

const CurrentRow: React.FC<{ attempt: string }> = ({ attempt }) => {
  const letters = attempt.padEnd(5, ' ').split('');
  
  return (
    <div className="flex gap-2 mb-2">
      {letters.map((letter, i) => (
        <LetterTile 
          key={i} 
          letter={letter === ' ' ? '' : letter} 
          isRevealed={false}
          index={i}
        />
      ))}
    </div>
  );
};

const CompletedRow: React.FC<{ 
  attempt: string; 
  evaluation: LetterState[];
}> = ({ attempt, evaluation }) => {
  return (
    <div className="flex gap-2 mb-2">
      {attempt.split('').map((letter, i) => (
        <LetterTile 
          key={i} 
          letter={letter} 
          state={evaluation[i]} 
          isRevealed={true}
          index={i}
        />
      ))}
    </div>
  );
};

const GameBoard: React.FC<GameBoardProps> = ({
  attempts,
  currentAttempt,
  maxAttempts,
  evaluations,
}) => {
  const remainingRows = maxAttempts - attempts.length - 1;
  
  return (
    <div className="p-4">
      {/* Completed Rows */}
      {attempts.map((attempt, i) => (
        <CompletedRow key={i} attempt={attempt} evaluation={evaluations[i]} />
      ))}
      
      {/* Current Row */}
      {attempts.length < maxAttempts && (
        <CurrentRow attempt={currentAttempt} />
      )}
      
      {/* Empty Rows */}
      {remainingRows > 0 && Array(remainingRows).fill(null).map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

export default GameBoard;
