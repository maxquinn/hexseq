import { useEffect } from "react";
import { type Frequency } from "tone/build/esm/core/type/Units";

const notes: Record<string, Frequency[]> = {
  // upper freq
  q: ["C5", "E5", "G5", "B5"], // Cmaj7
  w: ["A4", "C5", "E5", "G5"], // Am7
  e: ["E4", "G5", "B5", "D5"], // Em7
  // r: ["F4", "A5", "C5", "E5"], // Fmaj7
  t: ["D4", "F5", "A5", "C5"], // Dm7
  y: ["G4", "B5", "D5", "F5"], // G7

  // med freq
  a: ["C4", "E4", "G4", "B4"], // Cmaj7
  s: ["A3", "C4", "E4", "G4"], // Am7
  d: ["E3", "G4", "B4", "D4"], // Em7
  f: ["F3", "A4", "C4", "E4"], // Fmaj7
  g: ["D3", "F4", "A4", "C4"], // Dm7
  h: ["G3", "B4", "D4", "F4"], // G7

  // lower freq
  z: ["C3", "E3", "G3", "B3"], // Cmaj7
  x: ["A2", "C3", "E3", "G3"], // Am7
  c: ["E2", "G3", "B3", "D3"], // Em7
  v: ["F2", "A3", "C3", "E3"], // Fmaj7
  b: ["D2", "F3", "A3", "C3"], // Dm7
  n: ["G2", "B3", "D3", "F3"], // G7
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
