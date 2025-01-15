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
      className={`group
                  flex
                  relative
                  border
                  rounded-lg
                  p-4
                  mb-2
                  w-36
                  text-center
                  cursor-pointer
                  bg-blue-50
                  border-blue-800
                  shadow-blue-900
                  shadow-lg
                  transform
                  transition-all
                  hover:scale-105
                  hover:shadow-2xl
                  items-center
                  justify-center
                  h-full
                  min-h-28
                  text-xl
                  select-none ${
                    isDragging ? 'opacity-50 border-red-600 border-4' : ''
                  }`}
    >
      {card}
    </div>
  );
};
