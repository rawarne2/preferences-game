import React, { useState } from 'react';
import { GameState } from './PreferencesGame';

export const GroupPredictionScreen = ({
  currentCards,
  setGroupPredictions,
  setGameState,
}: {
  currentCards: string[];
  setGroupPredictions: React.Dispatch<React.SetStateAction<number[]>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}) => {
  const [localPredictions, setLocalPredictions] = useState<number[]>(
    new Array(5).fill(0)
  );

  return (
    <div className='flex flex-col items-center p-4'>
      <h2 className='text-2xl font-bold mb-4'>Group Prediction</h2>

      <div className='flex space-x-4 mb-6'>
        {currentCards.map((card, index) => (
          <div key={index} className='border rounded p-4 w-32 text-center'>
            <p className='mb-2'>{card}</p>
            <select
              value={localPredictions[index]}
              onChange={(e) => {
                const newPredictions = [...localPredictions];
                newPredictions[index] = parseInt(e.target.value);
                setLocalPredictions(newPredictions);
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
          if (localPredictions.every((p) => p > 0)) {
            setGroupPredictions(localPredictions);
            setGameState('review');
          }
        }}
        disabled={!localPredictions.every((p) => p > 0)}
        className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400'
      >
        Submit Predictions
      </button>
    </div>
  );
};
