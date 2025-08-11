"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

// Minimal Spot type used by Summary page
export type MapSpot = {
  name: string;
  lat?: number;
  lng?: number;
  city?: string;
};

interface DayMapProps {
  spots: (MapSpot & { duration?: string })[];
  height?: number; // px
  rounded?: string; // tailwind radius class (e.g., "rounded-xl")
}

const containerStyleBase: React.CSSProperties = {
  width: "100%",
};

export default function DayMap({ spots, height = 300, rounded = "rounded-xl" }: DayMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });

  const spotsWithCoords = useMemo(
    () => spots.filter((s) => typeof s.lat === "number" && typeof s.lng === "number") as Required<MapSpot>[],
    [spots]
  );

  const fallbackCenter = useMemo(() => ({ lat: 34.6937, lng: 135.5023 }), []);
  const mapRef = useRef<google.maps.Map | null>(null);
  const initializedRef = useRef(false); // ✅ prevent multiple onLoad runs

  const onLoad = useCallback((map: google.maps.Map) => {
    if (initializedRef.current) return;        // guard against multiple fires
    initializedRef.current = true;
    mapRef.current = map;

    // No coords → fallback wide
    if (spotsWithCoords.length === 0) {
      map.setCenter(fallbackCenter);
      map.setZoom(8);
      return;
    }

    // One coord → ultra close
    if (spotsWithCoords.length === 1) {
      const only = spotsWithCoords[0];
      map.setCenter({ lat: only.lat, lng: only.lng });
      map.setZoom(18); // building-level
      return;
    }

    // Multiple coords → fit all, then force very close zoom
    const bounds = new google.maps.LatLngBounds();
    spotsWithCoords.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds);

    google.maps.event.addListenerOnce(map, "idle", () => {
      const z = map.getZoom() ?? 10;
      if (z > 17) map.setZoom(17); // tighter cap
    });
  }, [spotsWithCoords, fallbackCenter]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    initializedRef.current = false;
  }, []);

  if (!isLoaded) {
    return (
      <div className={`${rounded} w-full`} style={{ height }}>
        <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-300">
          Loading map…
        </div>
      </div>
    );
  }

  return (
    <div className={`${rounded} overflow-hidden`} style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyleBase, height }}
        center={fallbackCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: true,
          gestureHandling: "greedy",
        }}
      >
        {spotsWithCoords.map((s) => (
          <MarkerF key={`${s.name}-${s.lat}-${s.lng}`} position={{ lat: s.lat, lng: s.lng }} title={s.name} />
        ))}
      </GoogleMap>
    </div>
  );
}