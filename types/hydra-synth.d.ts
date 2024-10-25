declare module "hydra-synth" {
  interface HydraOptions {
    canvas?: HTMLCanvasElement;
    enableStreamCapture?: boolean;
    width?: number;
    height?: number;
    autoLoop?: boolean;
    makeGlobal?: boolean;
    detectAudio?: boolean;
    numSources?: number;
    numOutputs?: number;
    precision?: "highp" | "mediump" | "lowp";
  }

  export default class Hydra {
    constructor(options?: HydraOptions);

    synth: HydraSynth;
  }

  interface HydraSynth {
    init({ src: HTMLCanvasElement }): void;
    osc(freq?: number, sync?: number, offset?: number): HydraFunction;
    gradient(speed?: number): HydraFunction;
    shape(sides?: number, radius?: number, smoothing?: number): HydraFunction;
    solid(r?: number, g?: number, b?: number, a?: number): HydraFunction;
    render(output?: HydraFunction): void;
    voronoi(
      scale?: HydraInput<number>,
      speed?: HydraInput<number>,
      blending?: HydraInput<number>,
    ): HydraFunction;
    noise(
      scale?: HydraInput<number>,
      speed?: HydraInput<number>,
    ): HydraFunction;
    mouse: {
      x: number;
      y: number;
    };
    tick(ms: number): void;
    time: number;
    a: {
      fft: Float32Array;
      setCutoff(frequency: number): void;
      setScale(scale: number): void;
      setSmooth(smooth: number): void;
      setBins(bins: number): void;
    };
    o0: HydraFunction;
    o1: HydraFunction;
    o2: HydraFunction;
    o3: HydraFunction;
    s0: HydraSynth;
    s1: HydraSynth;
    s2: HydraSynth;
    s3: HydraSynth;
    src: (src: HydraSynth) => HydraFunction;
  }

  type HydraInput<T> = T | (() => T);

  interface HydraFunction {
    out(output?: Output): HydraFunction;
    blend(src: HydraFunction, amount?: number): HydraFunction;
    luma(threshold?: number, tolerance?: number): HydraFunction;
    mask(src: HydraFunction): HydraFunction;
    rotate(angle?: HydraInput<number>, speed?: number): HydraFunction;
    brightness(amount?: HydraInput<number>): HydraFunction;
    contrast(amount?: HydraInput<number>): HydraFunction;
    modulatePixelate(src: HydraFunction, amount?: number): HydraFunction;
    saturate(amount?: HydraInput<number>): HydraFunction;
    color(
      r?: HydraInput<number>,
      g?: HydraInput<number>,
      b?: HydraInput<number>,
      a?: HydraInput<number>,
    ): HydraFunction;
    scale(size?: number, xMult?: number, yMult?: number): HydraFunction;
    pixelate(amount?: number, speed?: number): HydraFunction;
    modulate(src: HydraFunction, amount?: HydraInput<number>): HydraFunction;
    kaleid(
      sides?: HydraInput<number>,
      radius?: number,
      smoothing?: number,
    ): HydraFunction;
    mult(src: HydraFunction): HydraFunction;
    modulateScale(src: HydraFunction, amount?: number): HydraFunction;
    diff(src: HydraFunction): HydraFunction;
  }
}
