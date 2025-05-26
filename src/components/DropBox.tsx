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
    <div className='flex min-[420px]:flex-row lg:flex-col items-center justify-center'>
      <div
        ref={drop}
        className={`relative flex items-center justify-center w-44 h-[5.5rem] md:h-24 md:w-52 lg:min-h-40 lg:min-w-40 mb-2 lg:mb-4 bg-gray-100 border-dashed border-4 rounded-md ${isOver ? 'border-red-600' : 'border-gray-300'
          }`}
      >
        {card && (
          <div className='absolute inset-3 flex items-center justify-center'>
            <DraggableCard card={card} />
          </div>
        )}
        <p className='md:mt-1 ml-2 text-xl font-bold lg:hidden'>{number}</p>
      </div>
    </div>
  );
};
