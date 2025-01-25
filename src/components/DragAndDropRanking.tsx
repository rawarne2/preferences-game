import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGameContext } from '../context/GameContext';
import { DraggableCard } from './DraggableCard';
import { DropBox } from './DropBox';
import { TouchBackend } from 'react-dnd-touch-backend';
import { usePreview } from 'react-dnd-preview';
import { isMobile } from 'react-device-detect';
import { ResetGameButton } from './ResetGameButton';

const backend = isMobile ? TouchBackend : HTML5Backend;

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

  const PreviewPicture = () => {
    const preview = usePreview();
    if (!preview.display || !isMobile) {
      return null;
    }
    const { itemType, item, style, ref } = preview;
    const currentCard = item as { card: string };
    return (
      <div
        className='z-50'
        style={style}
        ref={(node) => (ref.current = node as HTMLDivElement | null)}
        itemRef={String(item)}
        typeof={itemType?.toString()}
      >
        <DraggableCard card={currentCard.card} />
      </div>
    );
  };

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
    <DndProvider backend={backend}>
      <div className='lg:p-4'>
        <div className='flex lg:flex-col items-center justify-center'>
          <div className='lg:grid grid-cols-5 lg:gap-4 lg:mb-6 pr-2 md:px-0'>
            {availableCards.map((card, index) => (
              <DraggableCard key={index} card={card} />
            ))}
          </div>

          <div className='lg:grid grid-cols-5 lg:gap-4 lg:mb-6 pl-2 md:px-0'>
            {[1, 2, 3, 4, 5].map((number, index) => (
              <DropBox
                key={index}
                onDrop={handleDrop}
                number={number}
                card={rankedCards[index]}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-row mt-4 justify-center'>
          <ResetGameButton />
          <button
            onClick={handleSubmit}
            className={`px-12 mr-2 ml-8 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600`}
          >
            Submit Rankings
          </button>
        </div>
      </div>
      <PreviewPicture />
    </DndProvider>
  );
};
