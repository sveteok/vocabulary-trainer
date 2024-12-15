"use client";
import { useEffect, useState, useRef } from "react";

import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";

export default function RunningLine({
  children,
}: {
  children: React.ReactNode;
}) {
  const [numberRepeatingBlocks, setNumberRepeatingBlocks] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const initState = () => {
    if (!innerRef?.current || !outerRef?.current) return;

    const childrenBlock = document.getElementById(`childrenBlock_0`);

    let childrenWith;

    if (!childrenBlock) {
      childrenWith = innerRef.current.getBoundingClientRect().width;
    } else {
      childrenWith = childrenBlock.getBoundingClientRect().width;
    }

    const { width: parentWidth } = outerRef.current.getBoundingClientRect();

    setNumberRepeatingBlocks(1 + Math.ceil(parentWidth / childrenWith));
  };

  useEffect(() => {
    initState();
    window.addEventListener("resize", initState);

    return () => {
      window.removeEventListener("resize", initState);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden" ref={outerRef}>
      <div className="flex justify-center w-fit" ref={innerRef}>
        {numberRepeatingBlocks < 2 && (
          <div
            id="childrenBlock_0"
            key="childrenBlock_0"
            className="flex w-max border-y-2 border-y-transparent"
          >
            <div className="opacity-0">{children}</div>
          </div>
        )}
        {numberRepeatingBlocks > 1 &&
          [...Array(numberRepeatingBlocks)].map((_, i) => (
            <div
              id={`childrenBlock_${i}`}
              key={`childrenBlock_${i}`}
              className="flex w-max animate-slide-animation border-y-0 border-y-blue-500"
            >
              {children}
            </div>
          ))}
      </div>
    </div>
  );
}

export function RunningLine1({ text }: { text: string }) {
  const [value, setValue] = useState<string>(text);

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    setValue(text);
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView, text]);

  return (
    <div className="flex bg-slate-300 text-black  ">
      <AnimatePresence>
        {value && (
          <motion.div
            ref={ref}
            animate={controls}
            variants={{
              visible: {
                opacity: 1,
                scale: 1,
                scaleX: 1,
              },
              hidden: {
                opacity: 0,
                scale: 0,
                scaleX: 0,
              },
            }}
            transition={{
              duration: 5,
              delay: 0.3,
              ease: [0.5, 0.71, 1, 1.5],
            }}
            whileHover={{ scale: 1.2 }}
            className="soverflow-hidden sabsolute border-2 border-black"
          >
            <p>{value}</p>
          </motion.div>
        )}
        {!value && (
          <motion.div ref={ref}>
            <p>{value}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
