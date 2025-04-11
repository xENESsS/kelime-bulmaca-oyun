
import React from 'react';
import { LetterState } from '@/hooks/useWordGame';
import { cn } from '@/lib/utils';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
}

const getStateClass = (state?: LetterState) => {
  switch (state) {
    case 'correct':
      return 'bg-game-correct text-green-700 border-green-300';
    case 'present':
      return 'bg-game-present text-yellow-700 border-yellow-300';
    case 'absent':
      return 'bg-game-absent text-gray-500 border-gray-300';
    default:
      return 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-gray-300';
  }
};

const KeyboardKey: React.FC<{
  value: string;
  display?: string;
  onClick: () => void;
  state?: LetterState;
  wide?: boolean;
  disabled?: boolean;
}> = ({ value, display, onClick, state, wide = false, disabled = false }) => {
  return (
    <button
      type="button"
      className={cn(
        "min-w-10 h-12 sm:h-14 md:h-14 flex items-center justify-center rounded-md border-2 font-medium transition-colors",
        wide ? "sm:min-w-16 md:min-w-20" : "sm:min-w-10 md:min-w-12",
        getStateClass(state),
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {display || value}
    </button>
  );
};

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onEnter,
  onBackspace,
  letterStates,
  disabled = false
}) => {
  const rows = [
    ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
    ['enter', 'z', 'c', 'ç', 'v', 'b', 'n', 'm', 'ö', 'backspace']
  ];

  return (
    <div className="p-1 md:p-2 mb-4 max-w-lg mx-auto">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 md:gap-2 mb-1 md:mb-2">
          {row.map((key) => {
            if (key === 'enter') {
              return (
                <KeyboardKey
                  key={key}
                  value={key}
                  display="Gönder"
                  onClick={onEnter}
                  wide={true}
                  disabled={disabled}
                />
              );
            } else if (key === 'backspace') {
              return (
                <KeyboardKey
                  key={key}
                  value={key}
                  display="⌫"
                  onClick={onBackspace}
                  wide={true}
                  disabled={disabled}
                />
              );
            } else {
              return (
                <KeyboardKey
                  key={key}
                  value={key}
                  state={letterStates[key]}
                  onClick={() => onKeyPress(key)}
                  disabled={disabled}
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
