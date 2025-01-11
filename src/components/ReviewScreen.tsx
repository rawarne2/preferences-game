import React from 'react';

export const ReviewScreen = ({
  targetRankings,
  currentCards,
  groupPredictions,
  roundScore,
  handleUpdateScore,
  isGameOver,
}: {
  targetRankings: number[];
  currentCards: string[];
  groupPredictions: number[];
  roundScore: number;
  handleUpdateScore: () => void;
  isGameOver: boolean;
}) => {
  return (
    <div className='flex flex-col items-center p-4'>
      <h2 className='text-2xl font-bold mb-4'>Round Review</h2>

      <div className='grid grid-cols-5 gap-4 mb-6'>
        {currentCards.map((card, index) => (
          <div key={index} className='border rounded p-4 text-center'>
            <p className='font-bold mb-2'>{card}</p>
            <p className='text-blue-600'>Target: {targetRankings[index]}</p>
            <p className='text-green-600'>Group: {groupPredictions[index]}</p>
            <p className='text-red-600'>
              Diff: {Math.abs(targetRankings[index] - groupPredictions[index])}
            </p>
          </div>
        ))}
      </div>

      <p className='text-xl mb-4'>Round Score: {roundScore}</p>

      <button
        onClick={handleUpdateScore}
        className='px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        {isGameOver ? 'End Game' : 'Next Round'}
      </button>
    </div>
  );
};
