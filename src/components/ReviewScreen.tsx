import { useGameContext } from '../context/GameContext';

export const ReviewScreen = () => {
  const {
    targetRankings,
    groupPredictions,
    roundScore,
    handleUpdateScore,
    isGameOver,
    players,
    targetPlayerIndex,
  } = useGameContext();

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });

  return (
    <div className='flex flex-col items-center p-4'>
      <h1 className='text-2xl font-bold mb-8'>Round Review</h1>
      <div className='grid mb-6 grid-rows-2'>
        <div>
          <h2 className='font-bold mb-2 text-xl'>{playerName}'s Ranking: </h2>
          <div className='grid grid-cols-5 gap-4 mb-6'>
            {targetRankings.map((card, index) => (
              <div
                className={`group
                flex
                relative
                border
                rounded-lg
                p-4
                mb-2
                w-36
                text-center
                cursor-pointer
                bg-blue-50
                border-blue-800
                shadow-blue-900
                shadow-lg
                transform
                transition-all
                hover:scale-105
                hover:shadow-2xl
                items-center
                justify-center
                h-full
                min-h-28
                text-xl`}
                key={index}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='font-bold mb-2 text-xl'>Predictions: </h2>{' '}
          <div className='grid grid-cols-5 gap-4 mb-6'>
            {groupPredictions.map((card, index) => (
              <div className='flex flex-col items-center' key={index}>
                <div
                  className={`group
                  flex
                  relative
                  border
                  rounded-lg
                  p-4
                  mb-2
                  w-36
                  text-center
                  cursor-pointer
                  bg-blue-50
                  border-blue-800
                  shadow-blue-900
                  shadow-lg
                  transform
                  transition-all
                  hover:scale-105
                  hover:shadow-2xl
                  items-center
                  justify-center
                  h-full
                  min-h-28
                  text-xl`}
                >
                  {card}
                </div>
                <p className='text-sm'>Diff: {diffsArray[index]}</p>
              </div>
            ))}
          </div>
        </div>
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
// TODO: button should be 'End Game', 'Next Round', or 'Next Player'
