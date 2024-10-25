import { useEffect } from "react";
import { type Frequency } from "tone/build/esm/core/type/Units";

export const notes: Record<string, Frequency[]> = {
  // upper octive
  a: ["C5", "E5", "G5", "B5"],
  s: ["A4", "C5", "E5", "G5"],
  d: ["E4", "G5", "B5", "D5"],
  f: ["F4", "A5", "C5", "E5"],
  g: ["D4", "F5", "A5", "C5"],
  h: ["G4", "B5", "D5", "F5"],

  // med octive
  z: ["C4", "E4", "G4", "B4"],
  x: ["A3", "C4", "E4", "G4"],
  c: ["E3", "G4", "B4", "D4"],
  v: ["F3", "A4", "C4", "E4"],
  b: ["D3", "F4", "A4", "C4"],
  n: ["G3", "B4", "D4", "F4"],
};

function useKeyboard(onKeyDown: (note: Frequency[]) => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const rootNote = notes[e.key.toLowerCase()];
      if (rootNote) {
        e.preventDefault();
        onKeyDown(rootNote);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onKeyDown]);
}

export { useKeyboard };
