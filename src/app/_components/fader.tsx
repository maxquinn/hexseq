import { useState, useEffect, useRef } from "react";

interface AudioFaderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  height?: number;
}

function Fader({
  min = 0,
  max = 100,
  value,
  onChange,
  disabled = false,
  label,
  height = 200,
}: AudioFaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const faderRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number>(0);
  const startValue = useRef<number>(0);

  // Convert value to position
  const valueToPosition = (val: number): number => {
    const percentage = (val - min) / (max - min);
    return (1 - percentage) * (height - 40); // 40px for handle height
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (disabled) return;
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    e.preventDefault();
  };

  useEffect(() => {
    const positionToValue = (positionY: number): number => {
      const percentage = 1 - positionY / (height - 40);
      return min + (max - min) * percentage;
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging || !faderRef.current) return;

      const rect = faderRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const clampedY = Math.max(0, Math.min(relativeY, height - 40));
      const newValue = positionToValue(clampedY);

      onChange(newValue);
    };

    const handleMouseUp = (): void => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [height, isDragging, max, min, onChange]);

  return (
    <div className="flex items-center gap-2">
      {/* Fader Container */}
      <div className="flex flex-col items-center">
        {label && <label className="mb-2 text-sm text-zinc-400">{label}</label>}

        {/* Track */}
        <div
          ref={faderRef}
          className={`relative w-[30px] rounded-lg bg-zinc-800 ${disabled ? "opacity-50" : ""}`}
          style={{ height: `${height}px` }}
        >
          {/* Handle */}
          <div
            className={`absolute left-1/2 h-10 w-[44px] -translate-x-1/2 cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
            style={{ top: `${valueToPosition(value)}px` }}
            onMouseDown={handleMouseDown}
          >
            <div className="mx-1 h-full rounded-md border border-zinc-500 bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-lg">
              {/* Handle ridges */}
              <div className="flex h-full flex-col justify-center gap-1 px-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="h-px bg-zinc-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Value display */}
        <div className="mt-2 font-mono text-sm text-zinc-300">
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
}

export { Fader };
