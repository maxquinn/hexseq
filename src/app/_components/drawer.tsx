"use client";

import { Menu, X } from "lucide-react";
import React, { useState } from "react";

function Drawer({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block">{children}</div>
      <div className="relative z-20 block md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 rounded-lg p-2 text-white focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        {isOpen && (
          <div
            className="fixed inset-0 overflow-hidden bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={`fixed left-0 top-0 h-full w-60 transform overflow-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-0 z-30 rounded-lg p-2 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

export { Drawer };
