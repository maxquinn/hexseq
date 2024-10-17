"use client";

import type Hydra from "hydra-synth";
import { useEffect, useRef, useState } from "react";

let H: typeof Hydra;

interface HydraRendererProps {
  sketch?: (h: Hydra["synth"]) => void;
  onHydraReady: (canvas: HTMLCanvasElement) => void;
}

function HydraRenderer({ sketch, onHydraReady }: HydraRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hydra, setHydra] = useState<Hydra["synth"] | null>(null);
  const initRef = useRef<boolean>(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initHydra = async () => {
      if (!canvasRef.current) return;

      try {
        const hydraModule = await import("hydra-synth");
        H = hydraModule.default;

        if (!canvasRef.current) return;

        const hydraInstance = new H({
          canvas: canvasRef.current,
          detectAudio: false,
          makeGlobal: false,
        }).synth;

        setHydra(hydraInstance);
        onHydraReady(canvasRef.current);
      } catch (error) {
        console.error("Error initializing Hydra:", error);
      }
    };

    initHydra().catch((error) => {
      console.error("Error initializing Hydra:", error);
    });
  }, [onHydraReady]);

  useEffect(() => {
    if (hydra && sketch) {
      sketch(hydra);
    }
  }, [sketch, hydra]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * 2;
        canvasRef.current.height = window.innerHeight * 2;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // initial resize

    return () => {
      window.removeEventListener("resize", resizeCanvas); // cleanup on unmount
    };
  }, []);

  return <canvas ref={canvasRef} className="hidden" />;
}

export { HydraRenderer };
