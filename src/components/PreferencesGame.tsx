import React from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';

const PreferencesGame: React.FC = () => {
  const { gameState } = useGameContext();

  // Render the appropriate screen based on game state
  return (
    <div className='flex flex-col w-full h-full fixed items-center justify-center'>
      {gameState === 'setup' && <SetupScreen />}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction' || gameState === 'waitingForRankings') && (
        <CardRankingScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
    </div>
  );
};

export default PreferencesGame;
