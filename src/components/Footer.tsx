import { useGameContext } from '../context/GameContext';

export const Footer = () => {
  const { currentRound, totalRounds, players, targetPlayerIndex } =
    useGameContext();
  if (!players.length) {
    return null;
  }
  return (
    <div className='fixed bottom-0 bg-gray-300 px-1 md:p-2 lg:p-3 leading-none font-medium lg:text-xl flex justify-between items-center w-full overflow-x-scroll no-scrollbar min-h-8 max-h-14'>
      <p className='font-bold pr-2'>
        Round: {currentRound}/{totalRounds}
      </p >
      <div className='flex space-x-4'>
        {players.map((player, index) => (
          <div
            key={index}
            className={
              index === targetPlayerIndex
                ? 'font-semibold border border-blue-700 rounded px-1'
                : ''
            }
          >
            {player.name}: {player.score || 0}
          </div>
        ))}
      </div>
    </div >
  );
};
