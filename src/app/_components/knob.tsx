import { mapFrom01Linear, mapTo01Linear } from "@dsp-ts/math";
import { useId } from "react";
import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
  useKnobKeyboardControls,
} from "react-knob-headless";

type KnobBaseThumbProps = {
  readonly value01: number;
};

type KnobHeadlessProps = React.ComponentProps<typeof KnobHeadless>;

type KnobBaseProps = Pick<KnobHeadlessProps, "valueMin" | "valueMax"> & {
  readonly label: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
};

function KnobBaseThumb({ value01 }: KnobBaseThumbProps) {
  const angleMin = -145;
  const angleMax = 145;
  const angle = mapFrom01Linear(value01, angleMin, angleMax);
  return (
    <div className="absolute h-full w-full rounded-full bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-lg">
      <div className="absolute h-full w-full" style={{ rotate: `${angle}deg` }}>
        <div className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 rounded-sm bg-stone-950" />
      </div>
    </div>
  );
}

function Knob({ label, value, onChange, valueMin, valueMax }: KnobBaseProps) {
  const knobId = useId();
  const labelId = useId();
  const value01 = mapTo01Linear(value, valueMin, valueMax);
  const valueRawRoundFn = Math.round;
  const valueRawDisplayFn = (valueRaw: number) =>
    `${valueRawRoundFn(valueRaw)}%`;
  const stepFn = (_valueRaw: number): number => 1;
  const stepLargerFn = (_valueRaw: number): number => 10;
  const step = stepFn(value);
  const stepLarger = stepLargerFn(value);
  const dragSensitivity = 0.006;

  const keyboardControlHandlers = useKnobKeyboardControls({
    valueRaw: value,
    valueMin,
    valueMax,
    step,
    stepLarger,
    onValueRawChange: onChange,
  });

  return (
    <div className="flex w-16 select-none flex-col items-center justify-center gap-0.5 text-xs outline-none focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-stone-300">
      <KnobHeadlessLabel id={labelId} className="text-center text-zinc-400">
        {label}
      </KnobHeadlessLabel>
      <KnobHeadless
        id={knobId}
        aria-labelledby={labelId}
        className="relative h-16 w-16 outline-none"
        valueMin={valueMin}
        valueMax={valueMax}
        valueRaw={value}
        valueRawRoundFn={valueRawRoundFn}
        valueRawDisplayFn={valueRawDisplayFn}
        dragSensitivity={dragSensitivity}
        orientation="vertical"
        onValueRawChange={onChange}
        {...keyboardControlHandlers}
      >
        <KnobBaseThumb value01={value01} />
      </KnobHeadless>
      <KnobHeadlessOutput
        htmlFor={knobId}
        className="text-center text-zinc-300"
      >
        {valueRawDisplayFn(value)}
      </KnobHeadlessOutput>
    </div>
  );
}

export { Knob };
