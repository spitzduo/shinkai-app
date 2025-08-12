// File: app/page.tsx
import React from "react";
import Link from "next/link";
import ShinkaiLayout from "./components/ShinkaiLayout";

export default function HomePage() {
  return (
    <ShinkaiLayout overlayOpacity={0.58}>
      <header className="sr-only">
        <h1>Shinkai — Japan Trip Planner</h1>
      </header>

      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-4 uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
          🗾 Welcome to Shinkai
        </h2>

        <p className="mb-8 text-lg text-white/80">
          Your minimalist companion for crafting serene, seasonal trips to Japan.
        </p>

        <nav className="grid gap-4">
          <Link
            href="/itinerary"
            className="rounded-xl text-lg py-3 px-6 bg-white text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            🧭 Build My Itinerary
          </Link>

          <Link
            href="/seasons"
            className="rounded-xl text-lg py-3 px-6 bg-white text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            🛏️ Explore Luxury Ryokan Stays
          </Link>

          <Link
            href="/drives"
            className="rounded-xl text-lg py-3 px-6 bg-white text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            🚗 Scenic Drive Map
          </Link>
        </nav>

        <footer className="mt-10 text-sm text-white/70">
          ✨ Made with 💙 by Jill &amp; Kazenith ✨
        </footer>
      </div>
    </ShinkaiLayout>
  );
}
