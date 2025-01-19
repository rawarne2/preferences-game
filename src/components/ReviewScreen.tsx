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
    <div className='flex flex-col items-center mt-2 lg:mt-8 w-full'>
      <h1 className='text-2xl font-bold lg:mb-8'>Round Review</h1>
      <div className='grid lg:mb-6 grid-rows-2'>
        <div>
          <h2 className='font-bold mb-2 text-xl'>{playerName}'s Ranking: </h2>
          <div className='grid grid-cols-5 lg:gap-4 gap-2 lg:mb-6 lg:min-h-36'>
            {targetRankings.map((card, index) => (
              <div
                className={`group
                  flex
                  relative
                  border
                  rounded-lg
                  mb-2
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
                  w-full
                  p-2
                  lg:p-4
                  min-h-28 md:min-h-24 sm:min-h-20
                  text-xl md:text-lg sm:text-base`}
                key={index}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='font-bold my-2 text-xl'>Group Predictions: </h2>
          <div className='grid grid-cols-5 lg:gap-4 gap-2 lg:mb-6 lg:min-h-36'>
            {/* TODO: make cards component since it is being used here, target ranking, and group ranking */}
            {groupPredictions.map((card, index) => (
              <div className='flex flex-col items-center' key={index}>
                <div
                  className={`group
                  flex
                  relative
                  border
                  rounded-lg
                  mb-2
                  text-center
                  cursor-pointer
                  bg-blue-50
                  border-blue-800
                  shadow-blue-900
                  ${
                    diffsArray[index] === 0
                      ? 'shadow-green-900'
                      : 'shadow-red-900'
                  }
                  ${
                    diffsArray[index] === 0
                      ? 'border-green-900'
                      : 'border-red-900'
                  }
                  shadow-lg
                  transform
                  transition-all
                  hover:scale-105
                  hover:shadow-2xl
                  items-center
                  justify-center
                  h-full
                  w-full
                  p-2
                  lg:p-4
                  min-h-28 md:min-h-24 sm:min-h-20
                  text-xl md:text-lg sm:text-base`}
                >
                  {card}
                </div>
                <p className='text-lg'>Diff: {diffsArray[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className='text-xl mb-4'>Round Score: {roundScore}</p>

      <button
        onClick={handleUpdateScore}
        className='px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-12'
      >
        {isGameOver ? 'End Game' : 'Next Round'}
      </button>
    </div>
  );
};
// TODO: button should be 'End Game', 'Next Round', or 'Next Player'
