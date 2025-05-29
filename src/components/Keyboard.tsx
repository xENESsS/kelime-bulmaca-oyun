import React from 'react';
import { LetterState } from '@/hooks/useWordGame';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
      return 'bg-green-200 text-green-800 border-green-400 dark:bg-green-700 dark:text-green-100 dark:border-green-600';
    case 'present':
      return 'bg-yellow-200 text-yellow-800 border-yellow-400 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-600';
    case 'absent':
      return 'bg-gray-500 text-gray-100 border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-700';
    default:
      return 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:border-gray-600 dark:text-gray-200';
  }
};

const KeyboardKey: React.FC<{
  value: string;
  display?: string;
  onClick: () => void;
  state?: LetterState;
  wide?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}> = ({ value, display, onClick, state, wide = false, disabled = false, isMobile = false }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-md border-2 font-medium transition-colors",
        isMobile 
          ? "min-w-8 h-11 text-sm" // Mobile styles
          : "min-w-10 h-12 sm:h-14 md:h-14", // Desktop styles
        wide 
          ? (isMobile ? "min-w-14" : "sm:min-w-16 md:min-w-20") 
          : (isMobile ? "" : "sm:min-w-10 md:min-w-12"),
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
  const isMobile = useIsMobile();
  
  // Türkçe klavye düzeni
  const rows = [
    ['e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
    ['enter', 'z', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', 'backspace']
  ];

  return (
    <div className={`p-1 md:p-2 mb-4 max-w-lg mx-auto ${isMobile ? 'fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 pb-2 pt-1 border-t border-gray-200 dark:border-gray-700' : ''}`}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex justify-center ${isMobile ? 'gap-0.5' : 'gap-1 md:gap-2'} mb-1 md:mb-2`}>
          {row.map((key) => {
            if (key === 'enter') {
              return (
                <KeyboardKey
                  key={key}
                  value={key}
                  display={isMobile ? "✓" : "Gönder"}
                  onClick={onEnter}
                  wide={true}
                  disabled={disabled}
                  isMobile={isMobile}
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
                  isMobile={isMobile}
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
                  isMobile={isMobile}
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
