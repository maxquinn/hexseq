import { HydraCanvas } from "@/app/_components/hydra-canvas";
import { TombolaScene } from "@/app/_components/tombola-scene";

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <HydraCanvas />
      <TombolaScene />
    </div>
  );
}
