"use client";

import { Provider as JotaiProvider } from "jotai";

function Providers({ children }: { children: React.ReactNode }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}

export { Providers };
