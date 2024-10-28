import { Help } from "@/app/_components/help";
import { HydraCanvas } from "@/app/_components/hydra-canvas";
import { TombolaScene } from "@/app/_modules/tombola-scene";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute right-4 top-4 z-30">
        <Help />
      </div>
      <a
        className="absolute bottom-4 right-4 z-30 p-2"
        href="https://github.com/maxquinn/hexseq"
      >
        <Image
          className="relative"
          height="24"
          width="24"
          src="https://cdn.simpleicons.org/github/52525b?viewbox=auto"
          alt="GitHub Icon"
        />
      </a>
      <HydraCanvas />
      <TombolaScene />
    </div>
  );
}
