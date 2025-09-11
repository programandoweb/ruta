"use client";
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import decodePolyline from "@/utils/polyline";

interface Props {
  data: any;
}

function PolylineOverlay({ path }: { path: { lat: number; lng: number }[] }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");

  useEffect(() => {
    if (!map || !routesLib) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor: "#2563eb",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, routesLib, path]);

  return null;
}

export default function MapView({ data }: Props) {
  const path = decodePolyline(data.routes[0].polyline.encodedPolyline);
  const waypoints = data.routes[0].legs.flatMap((leg: any) =>
    leg.steps.map((s: any) => s.startLocation)
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="h-96 w-full">
        <Map defaultCenter={{ lat: 4.834, lng: -75.680 }} defaultZoom={13}>
          <PolylineOverlay path={path} />
          {waypoints.map((wp: any, i: number) => (
            <Marker
              key={i}
              position={{
                lat: wp.latLng.latitude,
                lng: wp.latLng.longitude,
              }}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
