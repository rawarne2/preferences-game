import { useGameContext } from '../context/GameContext';

export const GameOverScreen = () => {
  const { players, handleResetGame } = useGameContext();
  const winner = [...players].sort((a, b) => b.score - a.score)[0];
  const isTie = players.filter((p) => p.score === winner.score).length > 1;

  return (
    <div className='flex flex-col items-center p-4 lg:text-xl'>
      <h2 className='lg:text-3xl text-2xl font-bold mb-6'>Game Over!</h2>

      {isTie ? (
        <p className='text-2xl lg:mb-4'>It's a tie!</p>
      ) : (
        <p className='text-2xl mb-4 text-green-600 font-semibold bg-white rounded-xl shadow-md shadow-blue-900 p-4'>
          Winner: {winner.name}!
        </p>
      )}

      <div className='w-full max-w-md'>
        <h3 className='text-xl font-semibold mb-2'>Final Scores:</h3>
        <ul className='space-y-2'>
          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <li
                key={index}
                className='flex justify-between items-center p-2 bg-gray-200 rounded'
              >
                <span>{player.name}</span>
                <span className='pl-4'>{player.score} points</span>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={handleResetGame}
        className='mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Play Again
      </button>
    </div>
  );
};
