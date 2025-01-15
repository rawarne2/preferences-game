import { DragAndDropRanking } from './DragAndDropRanking';
import { useGameContext } from '../context/GameContext';

export const CardRankingScreen = () => {
  const { players, targetPlayerIndex, gameState } = useGameContext();
  const playerName = players[targetPlayerIndex].name;
  return (
    <div className='flex flex-col items-center p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        {gameState === 'targetRanking'
          ? `${playerName}'s Turn to Rank`
          : 'Group Prediction'}
      </h2>
      <DragAndDropRanking />
    </div>
  );
};
