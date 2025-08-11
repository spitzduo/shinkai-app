// app/components/ShinkaiLayout.tsx
"use client";

import Image from "next/image";
import type { PropsWithChildren } from "react";

type Props = {
  imgSrc?: string;
  alt?: string;
  overlayOpacity?: number; // 0..1
};

export default function ShinkaiLayout({
  children,
  imgSrc = "/images/bg/sketch-japan.jpg",
  alt = "B/W sketch of Japan landmarks",
  overlayOpacity = 0.55,
}: PropsWithChildren<Props>) {
  return (
    <div className="relative min-h-screen w-full overflow-clip bg-black">
      {/* Background layer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none [filter:grayscale(1)_contrast(1.05)_brightness(0.9)]"
        />
        {/* Vignette + dark overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% 0%, rgba(0,0,0,0.25), transparent 60%), rgba(0,0,0, ${overlayOpacity})`,
          }}
        />
        {/* Subtle grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.18\"/></svg>')",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      {/* Content shell */}
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <section className="mb-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
