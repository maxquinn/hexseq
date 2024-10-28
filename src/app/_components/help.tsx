"use client";

import { useAtom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { HelpCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const helperAtom = atomWithStorage<boolean>("helper", true);

function HelperPopup() {
  const setIsOpen = useSetAtom(helperAtom);

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">HexSeq</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-zinc-500 hover:text-zinc-400 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-gray-500">
          HexSeq is a recreation of the Teenage Engineering OP-1 Tombola
          sequencer.
        </p>
        <p className="mt-2 text-gray-500">
          Create unique ambient musical patterns with physics-based sequencing.
        </p>
        <p className="mt-2 text-gray-500">
          Use keys A-H and Z-N to drop chords into the Hexagon. Adjust controls
          and explore!
        </p>
      </div>
    </div>
  );
}

function Help() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useAtom(helperAtom);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)}>
        <HelpCircle className="h-5 w-5 text-zinc-500 hover:text-zinc-400" />
      </button>
      {isOpen && <HelperPopup />}
    </div>
  );
}

export { Help };
