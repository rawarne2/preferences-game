import { DragAndDropRanking } from './DragAndDropRanking';
import { useGameContext } from '../context/GameContext';

export const CardRankingScreen = () => {
  const { players, targetPlayerIndex, gameState } = useGameContext();
  const playerName = players[targetPlayerIndex].name;
  return (
    <div className='flex flex-col items-center lg:p-8 fixed'>
      <h1 className='text-2xl font-bold mb-2'>
        {gameState === 'targetRanking'
          ? `${playerName}'s Turn to Rank`
          : 'Group Prediction'}
      </h1>
      <DragAndDropRanking />
    </div>
  );
};
