'use client';
import { APIProvider, Map, Marker, Polyline } from "@vis.gl/react-google-maps";
import decodePolyline from "@/utils/polyline";

interface Props {
  data: any;
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
          <Polyline path={path} strokeColor="#2563eb" strokeWeight={4} />
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
