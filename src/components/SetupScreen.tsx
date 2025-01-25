import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Category } from '../context/GameProvider';

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const {
    setTotalRounds,
    totalRounds,
    players,
    setPlayers,
    handleStartGame,
    setCategory,
    category,
  } = useGameContext();
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

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col items-center fixed h-full justify-center lg:text-xl'>
      <h1 className='text-3xl font-bold lg:mb-16 mb-8'>Preferences</h1>

      <div className='flex space-x-2'>
        <input
          type='text'
          value={newPlayerName}
          onChange={handleNewPlayerNameChange}
          placeholder='Enter player name'
          className='p-2 border rounded w-full'
          name='newPlayerName'
          id='newPlayerName'
          autoFocus
        />
        <button
          onClick={handleAddPlayer}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Add
        </button>
      </div>

      {players.length > 0 && (
        <div className='lg:my-6 my-4'>
          <h2 className='text-xl font-semibold pb-4'>Players:</h2>
          <ul className='space-y-2'>
            {players.map((player, index) => (
              <li key={index} className='flex justify-around'>
                <div className='bg-white px-4 flex-1 py-2 mx-4 rounded'>
                  {player.name}
                </div>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className='bg-red-500 hover:bg-red-700 rounded px-4 py-2 text-white'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h1 className='lg:mt-6 mt-4 pb-2 text-2xl'>Select Category:</h1>
      <select
        value={category ?? ''}
        onChange={(e) => handleCategoryChange(e.target.value as Category)}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >
        <option value='' disabled>
          Select a category
        </option>
        <option value='general'>General</option>
        <option value='adult'>Adult</option>
        <option value='pop-culture'>Pop Culture</option>
        <option value='dating'>Dating</option>
      </select>

      <div className='mt-6'>
        <label className='block font-medium mb-2'>
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
        className='mt-6 w-40 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
      >
        Start Game
      </button>
    </div>
  );
};
