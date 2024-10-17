import { useEffect, useRef, useState } from "react";

interface KnobProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

function Knob({
  min = 0,
  max = 100,
  value,
  onChange,
  disabled = false,
  label,
}: KnobProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const knobRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number>(0);
  const startValue = useRef<number>(0);

  // Convert value to rotation degrees (270 degree rotation range)
  const valueToRotation = (val: number): number => {
    const percentage = (val - min) / (max - min);
    return -135 + percentage * 270; // -135 to +135 degrees
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (disabled) return;
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    e.preventDefault();
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging) return;

      const deltaY = startY.current - e.clientY;
      const sensitivity = 0.5; // Adjust this value to change rotation sensitivity
      const newValue = Math.min(
        max,
        Math.max(min, startValue.current + deltaY * sensitivity),
      );

      onChange(newValue);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, max, min, onChange]);

  return (
    <div className="flex select-none flex-col items-center">
      {label && <label className="mb-2 text-sm text-zinc-400">{label}</label>}
      <div
        ref={knobRef}
        className={`relative h-20 w-20 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-700 shadow-lg ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotate(${valueToRotation(value)}deg)`,
        }}
      >
        {/* Knob ridge */}
        <div className="absolute left-1/2 top-2 h-3 w-1 -translate-x-1/2 transform rounded-full bg-zinc-300" />

        {/* Outer ring */}
        <div className="absolute inset-1 rounded-full border-4 border-zinc-600" />

        {/* Inner shadow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-800" />
      </div>

      {/* Value indicator */}
      <div className="mt-2 font-mono text-sm text-zinc-300">
        {Math.round(value)}
      </div>
    </div>
  );
}

export { Knob };
