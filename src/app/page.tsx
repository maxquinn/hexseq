import { HydraCanvas } from "@/app/_components/hydra-canvas";
import { TombolaScene } from "@/app/_modules/tombola-scene";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <a
        className="absolute right-4 top-4 p-2"
        href="https://github.com/maxquinn/hexseq"
      >
        <Image
          className="relative z-30"
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
