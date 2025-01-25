import React from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';

const PreferencesGame: React.FC = () => {
  const { gameState, currentRound, totalRounds, players, targetPlayerIndex } =
    useGameContext();

  // Render the appropriate screen based on game state
  return (
    <>
      {gameState === 'setup' && <SetupScreen />}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction') && (
        <CardRankingScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}

      {/* Game progress indicator */}
      {gameState !== 'setup' && gameState !== 'gameOver' && (
        <div className='fixed bottom-0 bg-gray-300 px-1 lg:p-6 lg:text-xl flex justify-between items-center w-full overflow-scroll'>
          <p className='font-bold pr-2'>
            Round: {currentRound}/{totalRounds}
          </p>
          <div className='flex space-x-4'>
            {players.map((player, index) => (
              <p
                key={index}
                className={
                  index === targetPlayerIndex
                    ? 'font-semibold border border-blue-700 rounded px-1'
                    : ''
                }
              >
                {player.name}: {player.score}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PreferencesGame;
