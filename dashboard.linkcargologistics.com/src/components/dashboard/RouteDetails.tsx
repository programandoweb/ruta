interface Props {
  data: any;
}

export default function RouteDetails({ data }: Props) {
  return (
    <div>
      <h2 className="font-bold mb-2">Detalles de la Ruta</h2>
      <ul className="space-y-2">
        {data.routes[0].legs.map((leg: any, i: number) => (
          <li key={i} className="border-b pb-2">
            <p><strong>Tramo {i + 1}:</strong></p>
            <p>Distancia: {leg.distanceMeters / 1000} km</p>
            <p>Duración: {leg.duration}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
