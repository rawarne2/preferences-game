import { DragAndDropRanking } from './DragAndDropRanking';
import { useGameContext } from '../context/GameContext';

export const CardRankingScreen = () => {
  const { players, targetPlayerIndex, gameState } = useGameContext();
  const playerName = players[targetPlayerIndex].name;
  return (
    <div className='flex flex-col items-center lg:text-xl lg:w-4/5 md:w-5/6 w-full pt-4'>
      <h1 className='lg:text-3xl text-2xl font-bold md:my-6 my-4'>
        {gameState === 'targetRanking'
          ? `${playerName}'s Turn to Rank`
          : 'Group Prediction'}
      </h1>
      <DragAndDropRanking />
    </div>
  );
};
