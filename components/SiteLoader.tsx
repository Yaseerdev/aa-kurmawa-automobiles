"use client";

import { useEffect, useState } from "react";

export function SiteLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => {
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 450);
    };

    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
    }

    return () => {
      window.removeEventListener("load", reveal);

      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#090b0d] text-white"
      style={{
        animation:
          "siteLoaderOut 500ms cubic-bezier(.22,1,.36,1) 450ms forwards",
      }}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-36">
          <svg
            viewBox="0 0 180 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              d="M24 51L34 39C38 34 44 31 51 30L69 27C77 18 88 14 103 14H119C131 14 141 20 148 29L158 31C165 32 170 37 172 44L176 51"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M24 51H176"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            <path
              d="M43 51C43 58 48 63 55 63C62 63 67 58 67 51M127 51C127 58 132 63 139 63C146 63 151 58 151 51"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            <path
              d="M72 27L82 38H145"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M84 38L76 27M118 38L112 27"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <path
              d="M31 43H48M155 43H169"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-7 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.38em]">
            AA Kurmawa
          </p>

          <p className="mt-2 text-[7px] uppercase tracking-[0.28em] text-white/40">
            Automobiles
          </p>
        </div>

        <div className="mt-8 h-px w-24 overflow-hidden bg-white/10">
          <div
            className="h-full w-full origin-left bg-white/60"
            style={{
              animation:
                "siteLoaderProgress 700ms cubic-bezier(.22,1,.36,1) forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes siteLoaderProgress {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes siteLoaderOut {
          from {
            opacity: 1;
            visibility: visible;
          }

          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
}