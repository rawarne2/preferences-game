// import { useGameContext } from "../context/GameContext";


export const ResetGameButton = () => {
  // const { setGameState, setCurrentRound, setTargetPlayerIndex, setCurrentCards, setTargetRankings, setGroupPredictions } = useGameContext();
  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
      // Preserve players data
      const players = localStorage.getItem('players');

      // Clear all localStorage
      localStorage.clear();

      // Restore players data
      if (players) {
        localStorage.setItem('players', players);
      }

      window.location.reload();
      // setGameState('setup');
      // setCurrentRound(0);
      // setTargetPlayerIndex(0);
      // setCurrentCards([]);
      // setTargetRankings([]);
      // setGroupPredictions([]);
    }
  };
  return (
    <button
      className='px-2 py-1 max-h-12 bg-red-500 text-white rounded hover:bg-red-600'
      onClick={clearLocalStorage}
    >
      Reset Game
    </button>
  );
};
