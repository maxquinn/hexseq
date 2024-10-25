"use client";

import { type HydraSynth } from "hydra-synth";
import { useEffect, useRef, useState } from "react";

function HydraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hydra, setHydra] = useState<HydraSynth | null>(null);

  useEffect(() => {
    const loadHydra = async () => {
      const Hydra = (await import("hydra-synth")).default;

      if (ref.current) {
        setHydra(
          new Hydra({
            canvas: ref.current,
            detectAudio: false,
            makeGlobal: false,
          }).synth,
        );
      }
    };
    if (ref.current) {
      loadHydra().catch(() => {
        console.error("Failed to load Hydra instance");
      });
    }

    return () => {
      // clean up hydra
    };
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (ref.current) {
        ref.current.width = window.innerWidth;
        ref.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // initial resize

    return () => {
      window.removeEventListener("resize", resizeCanvas); // cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (hydra) {
      const mobile: boolean = window.innerWidth < 768;
      hydra
        .voronoi(10, 0.3, 10)
        .modulatePixelate(hydra.noise(25, 0.3), 100)
        .scale(1.5, 1.5, 1)
        .out(hydra.o0);

      if (mobile) {
        hydra.render(hydra.o1);
      } else {
        hydra.render(hydra.o0);
      }
    }
  }, [hydra]);

  return (
    <canvas
      ref={ref}
      className="absolute left-0 top-0 min-h-screen w-full bg-black"
    />
  );
}

export { HydraCanvas };
