'use client';

import { FC } from 'react';

interface MovementItem {
  id: number;
  product: {
    name: string;
  };
  quantity: number;
  unit_cost: string | null;
  location: string | null;
}

interface Movement {
  id: number;
  reference: string;
  movement_date: string;
  type: 'entrada' | 'salida' | 'ajuste';
  note: string | null;
  user: { name: string };
  provider: { name: string } | null;
  items: MovementItem[];
}

const InventoryMovementsTable: FC<{ data: Movement[] }> = ({ data }) => (
  <div className="p-4 overflow-x-auto">
    <table className="min-w-full text-sm text-left border bg-white">
      <thead>
        <tr className="bg-gray-100 text-xs uppercase text-center">
          <th className="p-2 border">#</th>
          <th className="p-2 border">Fecha</th>
          <th className="p-2 border">Referencia</th>
          <th className="p-2 border">Tipo</th>
          <th className="p-2 border">Usuario</th>
          <th className="p-2 border">Proveedor</th>
          <th className="p-2 border">Nota</th>
          <th className="p-2 border">Detalle</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mov, idx) => (
          <tr key={idx} className="hover:bg-gray-50 align-top">
            <td className="p-2 border text-center">{mov.id}</td>
            <td className="p-2 border text-center">{mov.movement_date}</td>
            <td className="p-2 border">{mov.reference}</td>
            <td className="p-2 border text-center capitalize">{mov.type}</td>
            <td className="p-2 border">{mov.user?.name || '-'}</td>
            <td className="p-2 border">{mov.provider?.name || '-'}</td>
            <td className="p-2 border">{mov.note || '-'}</td>
            <td className="p-2 border">
              <ul className="list-disc pl-4 space-y-1">
                {mov.items.map((item, i) => (
                  <li key={i}>
                    {item.product?.name || '-'}: <strong>{item.quantity}</strong> unidad(es)
                    {item.unit_cost && (
                      <> @ ${parseFloat(item.unit_cost).toLocaleString()}</>
                    )}
                    {item.location && (
                      <> ({item.location})</>
                    )}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InventoryMovementsTable;
