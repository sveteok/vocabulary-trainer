"use client";
import { useEffect, useState, useRef } from "react";

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
