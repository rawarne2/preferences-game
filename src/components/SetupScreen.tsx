import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const { setTotalRounds, totalRounds, players, setPlayers, handleStartGame } =
    useGameContext();
  const handleNewPlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPlayerName(e.target.value);
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, { name: newPlayerName, score: 0 }]);
      setNewPlayerName('');
    }
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalRounds(parseInt(e.target.value));
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col items-center space-y-6 p-4'>
      <h1 className='text-3xl font-bold'>Preferences</h1>

      <div className='w-full max-w-lg'>
        <div className='flex space-x-2'>
          <input
            type='text'
            value={newPlayerName}
            onChange={handleNewPlayerNameChange}
            placeholder='Enter player name'
            className='flex-1 p-2 border rounded'
            name='newPlayerName'
            id='newPlayerName'
          />
          <button
            onClick={handleAddPlayer}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Add
          </button>
        </div>

        <div className='mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Players:</h2>
          <ul className='space-y-2'>
            {players.map((player, index) => (
              <li key={index} className='flex justify-between items-center'>
                <span>{player.name}</span>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-6'>
          <label className='block text-sm font-medium mb-2'>
            Number of Rounds:
            <input
              type='number'
              value={totalRounds}
              name='rounds'
              onChange={handleRoundsChange}
              className='ml-2 p-1 border rounded w-20'
            />
          </label>
        </div>

        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className='mt-6 w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
