import React from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';
import { WaitingForRankingsScreen } from './WaitingForRankingsScreen';
import { ResetGameButton } from './ResetGameButton';

const PreferencesGame: React.FC = () => {
  const { gameState } = useGameContext();


  // Render the appropriate screen based on game state
  return (
    <div className='flex flex-col w-full h-full fixed items-center justify-start'>
      {gameState === 'setup' && <SetupScreen />}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction') && (
        <CardRankingScreen />
      )}
      {gameState === 'waitingForRankings' && (
        <WaitingForRankingsScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
      <div className='absolute bottom-0 left-0 right-0'>
        <ResetGameButton />
      </div>
    </div>
  );
};

export default PreferencesGame;
