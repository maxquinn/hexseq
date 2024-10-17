import Hydra, { HydraFunction } from "hydra-synth";

export const blackNoise = (hydra: Hydra['synth'], output: HydraFunction) => {
  const { voronoi, noise } = hydra;
  return voronoi(10, 0.5, 10)
    // .brightness(() => a.fft[0])
    .modulatePixelate(noise(25, 0.5), 100)
    // .saturate(() => a.fft[1])
    .out(output)
};

export const colorBlobs = (hydra: Hydra['synth'], output: HydraFunction) => {
  const { osc, noise, time } = hydra;
  return osc(4, 0.1, 0.8)
    .color(1.04, 0, -1.1)
    .rotate(0.30, 0.1)
    .pixelate(2, 20)
    .modulate(noise(2.5), () => 2.5 * Math.sin(80 * time))
    .out(output)
};
