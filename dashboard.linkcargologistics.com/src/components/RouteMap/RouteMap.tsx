"use client";

import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

interface MapProps {
  routes: { lat: number; lng: number; order: number }[];
}

const RouteMap: React.FC<MapProps> = ({ routes }) => {
  if (!routes || routes.length === 0) return null;

  const center = { lat: routes[0].lat, lng: routes[0].lng };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={center}
        zoom={7}
      >
        {/* Línea que conecta los puntos */}
        <Polyline
          path={routes.map((r) => ({ lat: r.lat, lng: r.lng }))}
          options={{
            strokeColor: "#2563eb",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />

        {/* Marcadores */}
        {routes.map((r, idx) => (
          <Marker key={idx} position={{ lat: r.lat, lng: r.lng }} label={`${r.order}`} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
