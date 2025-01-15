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
    <div className='flex flex-col items-center'>
      <div
        ref={drop}
        className={`relative flex items-center justify-center h-28 w-40 bg-gray-100 border-dashed border-4 rounded-md p-4 min-h-32 ${
          isOver ? 'border-red-600' : 'border-gray-300'
        }`}
      >
        {card && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <DraggableCard card={card} />
          </div>
        )}
      </div>
      <p className='mt-1 text-sm'>{number}</p>
    </div>
  );
};
