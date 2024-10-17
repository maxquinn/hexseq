import { useEffect } from "react";
import { type Frequency } from "tone/build/esm/core/type/Units";

const frequencies: Record<string, Frequency> = {
  a: "A4",
  s: "C4",
  d: "D4",
  f: "E4",
  g: "F4",
  h: "G4",
  j: "A4",
  k: "B4",
  l: "C5",
};

function useKeyboard(onKeyDown: (note: Frequency) => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const note = frequencies[e.key.toLowerCase()];
      if (note) {
        e.preventDefault();
        onKeyDown(note);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onKeyDown]);
}

export { useKeyboard };
