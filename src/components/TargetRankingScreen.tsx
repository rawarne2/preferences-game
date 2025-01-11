import React, { useState } from 'react';
import { GameState, Player } from './PreferencesGame';

export const TargetRankingScreen = ({
  players,
  setGameState,
  targetPlayerIndex,
  currentCards,
  setTargetRankings,
}: {
  players: Player[];
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  targetPlayerIndex: number;
  currentCards: string[];
  setTargetRankings: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [localRankings, setLocalRankings] = useState<number[]>(
    new Array(5).fill(0)
  );

  return (
    <div className='flex flex-col items-center p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        {players[targetPlayerIndex].name}'s Turn
      </h2>

      <div className='flex space-x-4 mb-6'>
        {currentCards.map((card, index) => (
          <div key={index} className='border rounded p-4 w-32 text-center'>
            <p className='mb-2'>{card}</p>
            <select
              value={localRankings[index]}
              onChange={(e) => {
                const newRankings = [...localRankings];
                newRankings[index] = parseInt(e.target.value);
                setLocalRankings(newRankings);
              }}
              className='w-full p-1 border rounded'
            >
              <option value={0}>Select...</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? '(Love)' : num === 5 ? '(Loathe)' : ''}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (localRankings.every((r) => r > 0)) {
            setTargetRankings(localRankings);
            setGameState('groupPrediction');
          }
        }}
        disabled={!localRankings.every((r) => r > 0)}
        className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400'
      >
        Submit Rankings
      </button>
    </div>
  );
};
