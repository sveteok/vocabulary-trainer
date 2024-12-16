import { motion, AnimatePresence, cubicBezier } from "framer-motion";

const CardSlideShowAnimate = ({
  children,
  paginate,
  page,
  direction,
  isNextButtonDragDisabled,
  isPrevButtonDragDisabled,
}: {
  children: React.ReactNode;
  paginate: (newDirection: number) => void;
  page: number;
  direction: number;
  isNextButtonDragDisabled: boolean;
  isPrevButtonDragDisabled: boolean;
}) => {
  return (
    <div className="flex size-full px-8 place-items-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={{
            enter: (direction: number) => {
              return {
                x: direction < 0 ? 1000 : -1000,
                opacity: [0.5, 1],
              };
            },
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
            },
            exit: (direction: number) => {
              return {
                zIndex: 0,
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
              };
            },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            left: {
              type: "spring",
              stiffness: 210,
              damping: 10,
              mass: 2,
              duration: cubicBezier(0.29, 1.01, 1, -0.68),
            },
            opacity: { duration: 0.9 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            if (isNextButtonDragDisabled && isPrevButtonDragDisabled)
              return false;

            const swipeConfidenceThreshold = 10000;
            const swipePower = Math.abs(offset.x) * velocity.x;

            if (
              swipePower < -swipeConfidenceThreshold &&
              !isNextButtonDragDisabled
            ) {
              paginate(1);
            } else if (
              swipePower > swipeConfidenceThreshold &&
              !isPrevButtonDragDisabled
            ) {
              paginate(-1);
            }
          }}
          className="flex flex-1 size-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CardSlideShowAnimate;
