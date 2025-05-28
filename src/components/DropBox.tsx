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
        className={`relative flex items-center justify-center w-[40vw] md:w-[30vw] lg:w-[15vw] max-w-52 h-[12.5vh] md:h-[13vh] lg:h-[16vh] mb-2 lg:mb-4 bg-gray-200 border-dashed border-4 rounded-md ${isOver ? 'border-red-600' : 'border-gray-400'
          }`}
      >
        {card && (
          <div className='absolute inset-2 flex items-center justify-center'>
            <DraggableCard card={card} />
          </div>
        )}
        <p className='md:mt-1 ml-2 text-xl font-bold lg:hidden'>{number}</p>
      </div>
    </div>
  );
};
