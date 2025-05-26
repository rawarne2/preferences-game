import { useDrag } from 'react-dnd';

export const ITEM_TYPE = 'CARD';

export const DraggableCard = ({ card }: { card: string }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        flex relative items-center justify-center
        w-44 h-[5.5rem] md:h-[5.5rem] md:w-52 lg:min-h-28 lg:min-w-40
        p-1 md:p-2 lg:p-4
        mb-2 md:mb-3 lg:mb-4
        text-lg md:text-xl
        text-center break-words select-none
        cursor-pointer
        border rounded-lg
        bg-blue-50 border-blue-800
        shadow-lg shadow-blue-900
        transform transition-all
        hover:scale-105 hover:shadow-2xl
        ${isDragging ? 'opacity-50 border-red-600 border-4' : ''}
      `}
    >
      {card}
    </div>
  );
};
