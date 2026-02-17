import { useGameContext } from "../context/GameContext";

// Button to leave online game
export const LeaveGameButton = ({ className }: { className?: string }) => {
  const { handleLeaveGame } = useGameContext();

  const onLeave = () => {
    if (window.confirm('Are you sure you want to leave the game? You cannot rejoin this game after leaving and all your progress will be lost.')) {
      handleLeaveGame();
    }
  };

  return (
    <button
      className={`px-2 py-1 max-h-12 bg-orange-400 text-white rounded hover:bg-orange-500 hover:border-orange-800 hover:border-2 ${className}`}
      onClick={onLeave}
    >
      Leave Game
    </button>
  );
};
