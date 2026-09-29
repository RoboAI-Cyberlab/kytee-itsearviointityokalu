import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { useShallow } from "zustand/react/shallow";

const SIZE_STEP = 0.1; // 10% increment
const MIN_SIZE = 0.8; // 80% of normal size
const MAX_SIZE = 2.0; // 200% of normal size
const DEFAULT_SIZE = 1.0; // 100% (1rem)

/**
 * TextSizeAdjusterBlock component
 *
 * This component provides a text size adjuster that changes the root font size
 * in increments of 10%, from 80% to 200% of the default size.
 *
 * @returns A React component that displays a text size adjuster.
 */
const TextSizeAdjusterBlock = () => {
  const { textSize, setTextSize } = useAppStore(
    useShallow((state) => ({
      textSize: state.textSize,
      setTextSize: state.setTextSize,
    })),
  );

  // Apply the font size from the store to the document root
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}rem`;
  }, [textSize]);

  const resetSize = () => setTextSize(DEFAULT_SIZE);

  const increaseSize = () => {
    setTextSize(Math.min(textSize + SIZE_STEP, MAX_SIZE));
  };

  const decreaseSize = () => {
    setTextSize(Math.max(textSize - SIZE_STEP, MIN_SIZE));
  };

  return (
    <div className="flex gap-1" role="group" aria-label="Tekstin koko -asetus">
      <Button
        variant="ghost"
        size="sm"
        onClick={decreaseSize}
        className="h-8 w-fit px-2"
        title="Pienennä tekstin kokoa"
        disabled={textSize <= MIN_SIZE}
      >
        <span className="text-xs">A</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetSize}
        className="h-8 w-fit px-2"
        title="Palauta tekstin koko"
      >
        <span className="text-base">A</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={increaseSize}
        className="h-8 w-fit px-2"
        title="Suurenna tekstin kokoa"
        disabled={textSize >= MAX_SIZE}
      >
        <span className="text-xl">A</span>
      </Button>
    </div>
  );
};

export default TextSizeAdjusterBlock;
