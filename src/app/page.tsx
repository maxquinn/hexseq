'use client';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hydra, setHydra] = useState<any | null>(null);

  useEffect(() => {
    const loadHydra = async () => {
      // @ts-ignore
      const Hydra = (await import('hydra-synth')).default
      setHydra(new Hydra({ detectAudio: true, makeGlobal: false, canvas: ref.current }).synth);
    }
    if (ref) {
      loadHydra();
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

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial resize

    return () => {
      window.removeEventListener('resize', resizeCanvas); // cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (hydra) {
      const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render, a, time } = hydra;
      // Seb add code here:

      voronoi(10, 0.5, 10).brightness(() => a.fft[0])
        .modulatePixelate(noise(25, 0.5), 100)
        .out(o0)

      // Nothing below this line ---------
    }
  }, [hydra]);

  return (
    <main>
      <canvas ref={ref} className='min-h-screen w-full' />
    </main>
  );
}
