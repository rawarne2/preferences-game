import { useDrop } from 'react-dnd';
import { DraggableCard, ITEM_TYPE } from './DraggableCard';

export type BoxProps = {
  onDrop: (item: string, index: number) => void;
  number: number;
  card: string | null;
};

export const DropBox = ({ onDrop, number, card }: BoxProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { card: string }) => onDrop(item.card, number - 1),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className='flex md:flex-col items-center'>
      <div
        ref={drop}
        className={`relative flex items-center justify-center min-h-24 lg:h-36 min-w-32 lg:w-48 w-40 bg-gray-100 border-dashed border-4 rounded-md ${
          isOver ? 'border-red-600' : 'border-gray-300'
        }`}
      >
        {card && (
          <div className='absolute inset-3 flex items-center justify-center'>
            <DraggableCard card={card} />
          </div>
        )}
      </div>
      <p className='md:mt-1 ml-2 text-xl font-bold '>{number}</p>
    </div>
  );
};
