"use client";

import { notes } from "@/app/_hooks/use-keyboard";
import { type Frequency } from "tone/build/esm/core/type/Units";

interface PianoKeyProps {
  note: Frequency[];
  onClick: (note: Frequency[]) => void;
}

interface PianoProps {
  onKeyClick: (note: Frequency[]) => void;
}

function Key({ note, onClick }: PianoKeyProps) {
  return (
    <button
      onClick={() => {
        onClick(note);
        if ("vibrate" in navigator) {
          navigator.vibrate(20);
        }
      }}
      className="h-24 w-6 touch-none select-none rounded-t-sm bg-zinc-300 opacity-50 shadow-md active:bg-[#AFDDDE]"
      aria-label={`Piano key ${note.toString()}`}
    />
  );
}

function Keys({ onKeyClick }: PianoProps) {
  return (
    <div className="inline-flex rounded-lg px-2 shadow-xl">
      <div className="flex gap-1">
        {Object.values(notes)
          .slice(0, 12)
          .map((note, i) => (
            <Key key={i} note={note} onClick={onKeyClick} />
          ))}
      </div>
    </div>
  );
}

export { Keys };
