'use client';

import { FC } from 'react';

interface KardexItem {
  id: number;
  quantity: number;
  unit_cost: string | null;
  product: {
    id: number;
    name: string;
  };
  movement: {
    movement_date: string;
    type: 'entrada' | 'salida' | 'ajuste';
    reference: string;
    user: { name: string };
    provider: { name: string } | null;
  };
}

const KardexTableGrouped: FC<{ data: KardexItem[] }> = ({ data }) => {
  // Agrupar por producto
  const grouped = data.reduce((acc: Record<string, KardexItem[]>, item) => {
    const key = item.product?.name || 'Sin nombre';
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-8">
      {Object.entries(grouped).map(([productName, items], index) => {
        let saldo = 0;

        return (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2">{productName}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border bg-white">
                <thead>
                  <tr className="bg-gray-100 text-xs uppercase text-center">
                    <th className="p-2 border">Fecha</th>
                    <th className="p-2 border">Tipo</th>
                    <th className="p-2 border">Referencia</th>
                    <th className="p-2 border">Usuario</th>
                    <th className="p-2 border">Proveedor</th>
                    <th className="p-2 border">Entrada</th>
                    <th className="p-2 border">Salida</th>
                    <th className="p-2 border">Ajuste</th>
                    <th className="p-2 border">Costo Unitario</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const { movement, quantity, unit_cost } = item;
                    const entrada = movement.type === 'entrada' ? quantity : 0;
                    const salida = movement.type === 'salida' ? quantity : 0;
                    const ajuste = movement.type === 'ajuste' ? quantity : 0;
                    const total = quantity * (unit_cost ? parseFloat(unit_cost) : 0);
                    saldo += entrada - salida + ajuste;

                    return (
                      <tr key={i} className="hover:bg-gray-50 text-center">
                        <td className="p-2 border">{movement.movement_date}</td>
                        <td className="p-2 border capitalize">{movement.type}</td>
                        <td className="p-2 border">{movement.reference}</td>
                        <td className="p-2 border">{movement.user?.name || '-'}</td>
                        <td className="p-2 border">{movement.provider?.name || '-'}</td>
                        <td className="p-2 border">{entrada || ''}</td>
                        <td className="p-2 border">{salida || ''}</td>
                        <td className="p-2 border">{ajuste || ''}</td>
                        <td className="p-2 border text-right">
                          {unit_cost ? `$${parseFloat(unit_cost).toLocaleString()}` : '-'}
                        </td>
                        <td className="p-2 border text-right">
                          ${total.toLocaleString()}
                        </td>
                        <td className="p-2 border font-semibold">{saldo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KardexTableGrouped;
