import React from 'react';
import Card from "@/components/card";
import StringAndLabel from "@/components/fields/StringAndLabel";
import { formatarFechaLaravel, formatearMonto } from "@/utils/fuctions";

interface Tour {
  title: string;
}

interface TotalUserServices {
  [key: string]: number;
}

interface DispatchesResumeProps {
  data: {
    tour: Tour;
    code: string;
    fecha: string;
    status_tour_dispatches_id?: number;
  };
  totalPaid: number;
  totalCost: number;
  totalSale: number;
  totalCost2: number;
  totalSale2: number;
  totalUserServices?: TotalUserServices;
}

const DispatchesResume: React.FC<DispatchesResumeProps> = ({
  data,
  totalPaid,
  totalCost,
  totalSale,
  totalCost2,
  totalSale2,
  totalUserServices
}) => {
  return (
    <Card className="p-4 uppercase">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h1 className="text-2xl mb-2">{data.tour.title}</h1>
        </div>
        <StringAndLabel label="Código">{data.code}</StringAndLabel>
        <StringAndLabel label="Fecha">{formatarFechaLaravel(data.fecha)}</StringAndLabel>
        {/* <StringAndLabel label="Estado del Despacho">{data.status_tour_dispatches_id?.toString()}</StringAndLabel> */}
        <StringAndLabel label="Total Pagado">Bs. {formatearMonto(totalPaid)}</StringAndLabel>
        <StringAndLabel label="Costo Servicios del Tour">Bs. {formatearMonto(totalCost)}</StringAndLabel>
        <StringAndLabel label="Venta Servicios del Tour">Bs. {formatearMonto(totalSale)}</StringAndLabel>
        <StringAndLabel label="Costo Servicios al turista">Bs. {formatearMonto(totalCost2)}</StringAndLabel>
        <StringAndLabel label="Venta Servicios al turista">Bs. {formatearMonto(totalSale2)}</StringAndLabel>
        {totalUserServices &&
          Object.entries(totalUserServices).map(([key, value], index) => (
            <StringAndLabel
              label={"Total " + key.replace("services", "servicios").replace("accesories", "accesorios").replace("hotels", "hoteles")}
              key={index}
            >
              Bs. {formatearMonto(value)}
            </StringAndLabel>
          ))}
      </div>
    </Card>
  );
};

export default DispatchesResume;
