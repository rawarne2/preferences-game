import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGameContext } from '../context/GameContext';
import { DraggableCard } from './DraggableCard';
import { DropBox } from './DropBox';

// TODO: use https://react-dnd.github.io/react-dnd/docs/backends/touch for mobile

// Handles both the target's ranking and group's prediction
export const DragAndDropRanking = () => {
  const {
    setTargetRankings,
    setGameState,
    setGroupPredictions,
    gameState,
    currentCards,
  } = useGameContext();

  const [availableCards, setAvailableCards] = useState<string[]>(currentCards);
  const [rankedCards, setRankedCards] = useState<(string | null)[]>(
    new Array(5).fill(null)
  );

  const handleDrop = (item: string, index: number) => {
    const newRankings = [...rankedCards];
    const updatedAvailableCards = [...availableCards];

    // Find where the card is coming from
    const previousIndex = rankedCards.indexOf(item);

    if (previousIndex !== -1) {
      // Card is being moved from another drop box
      newRankings[previousIndex] = null;
    } else {
      // Card is being moved from the available cards
      const availableIndex = availableCards.indexOf(item);
      updatedAvailableCards.splice(availableIndex, 1);
    }

    // If there is an existing card in the drop box, move it to the previous location
    const displacedCard = newRankings[index];
    if (displacedCard) {
      if (previousIndex !== -1) {
        // Move displaced card to the previous drop box
        newRankings[previousIndex] = displacedCard;
      } else {
        // Move displaced card back to available cards
        updatedAvailableCards.push(displacedCard);
      }
    }

    // Place the new card in the drop box
    newRankings[index] = item;

    setRankedCards(newRankings);
    setAvailableCards(updatedAvailableCards);
  };

  const canSubmit = rankedCards.every((card) => card !== null);

  const handleSubmit = () => {
    // handle group prediction submit
    if (canSubmit) {
      console.log('Final Rankings:', rankedCards);
      if (gameState === 'targetRanking') {
        setTargetRankings(rankedCards);
        setGameState('groupPrediction');
        setAvailableCards(currentCards);
        setRankedCards(new Array(5).fill(null));
      } else if (gameState === 'groupPrediction') {
        setGroupPredictions(rankedCards);
        setGameState('review');
      }
    } else {
      alert('Please rank all the cards.');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex flex-col items-center lg:p-4 h-full'>
        <div className='grid grid-cols-5 lg:gap-4 lg:mb-2 lg:space-x-8 lg:mb-6 mb-2'>
          {availableCards.map((card, index) => (
            <DraggableCard key={index} card={card} />
          ))}
        </div>

        <div className='grid grid-cols-5 lg:gap-4 lg:mb-2 p-2'>
          {[1, 2, 3, 4, 5].map((number, index) => (
            <DropBox
              key={index}
              onDrop={handleDrop}
              number={number}
              card={rankedCards[index]}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 lg:visible ${
            canSubmit ? 'visible' : 'invisible'
          }`}
        >
          Submit Rankings
        </button>
      </div>
    </DndProvider>
  );
};
