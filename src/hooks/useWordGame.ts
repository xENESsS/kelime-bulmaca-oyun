import React from 'react';
import { useWordGame } from '@/hooks/useWordGame';

const GameBoard = () => {
  const {
    gameState,
    addCharacter,
    removeCharacter,
    submitAttempt,
    startNewGame,
  } = useWordGame();

  // Her bir denemeyi kutucuk olarak gösteren fonksiyon
  const renderAttempts = () => {
    const rows = [];

    for (let i = 0; i < gameState.maxAttempts; i++) {
      const word = gameState.attempts[i] || '';
      const evaluation = gameState.evaluations[i] || [];

      const boxes = [];

      for (let j = 0; j < 5; j++) {
        const letter = word[j] || '';
        const state = evaluation[j] || 'empty';

        let bgColor = 'bg-gray-200';
        if (state === 'correct') bgColor = 'bg-green-500 text-white';
        else if (state === 'present') bgColor = 'bg-yellow-400 text-white';
        else if (state === 'absent') bgColor = 'bg-gray-400 text-white';

        boxes.push(
          <div
            key={j}
            className={`w-12 h-12 border rounded flex items-center justify-center text-xl font-bold ${bgColor}`}
          >
            {letter.toUpperCase()}
          </div>
        );
      }

      rows.push(
        <div key={i} className="flex gap-2">
          {boxes}
        </div>
      );
    }

    return rows;
  };

  // Klavyeyi manuel çiz (isteğe bağlı - gerçek Keyboard.tsx varsa orayı da kullanabilirsin)
  const handleKeyPress = (char: string) => {
    if (char === 'ENTER') submitAttempt();
    else if (char === 'BACK') removeCharacter();
    else addCharacter(char);
  };

  const keyboardRows = [
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK', 'ENTER'],
  ];

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Kelime Bulmaca Oyunu</h1>

      {/* Oyun Kutuları */}
      <div className="flex flex-col gap-2">{renderAttempts()}</div>

      {/* Hata mesajı */}
      {gameState.error && (
        <p className="text-red-500 font-medium">{gameState.error}</p>
      )}

      {/* Kazanma & Kaybetme mesajı */}
      {gameState.gameStatus === 'won' && (
        <p className="text-green-500 font-semibold mt-2">
          🎉 Tebrikler! Doğru kelimeyi buldunuz!
        </p>
      )}
      {gameState.gameStatus === 'lost' && (
        <p className="text-red-500 font-semibold mt-2">
          😞 Üzgünüz, doğru kelime <strong>{gameState.targetWord.toUpperCase()}</strong> idi.
        </p>
      )}

      {/* Yeniden Oyna Butonu */}
      {gameState.gameStatus !== 'playing' && (
        <button
          onClick={startNewGame}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🔁 Yeniden Oyna
        </button>
      )}

      {/* Klavye */}
      <div className="flex flex-col gap-2 mt-4">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key === 'BACK' ? 'BACK' : key === 'ENTER' ? 'ENTER' : key.toLowerCase())}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm font-semibold"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

