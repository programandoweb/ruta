'use client';

import { FC } from 'react';

interface InventoryItem {
  product: {
    name: string;
    sku: string;
  };
  total_entradas: string;
  total_salidas: string;
  ajustes: string;
  stock_actual: number;
  ultimo_costo_unitario: string;
  valor_estimado: number;
}

const InventoryStatusTable: FC<{ data: InventoryItem[] }> = ({ data }) => (
  <div className="p-4 overflow-x-auto">
    <table className="min-w-full text-sm text-left border bg-white">
      <thead>
        <tr className="bg-gray-100 text-xs uppercase text-center">
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">SKU</th>
          <th className="p-2 border">Entradas</th>
          <th className="p-2 border">Salidas</th>
          <th className="p-2 border">Ajustes</th>
          <th className="p-2 border">Stock Actual</th>
          <th className="p-2 border">Costo Unitario</th>
          <th className="p-2 border text-center">Valor Estimado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item:any, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border">{item.product?.name || '-'}</td>
            <td className="p-2 border">{item.product?.sku || '-'}</td>
            <td className="p-2 border text-center">{item.total_entradas}</td>
            <td className="p-2 border text-center">{item.total_salidas}</td>
            <td className="p-2 border text-center">{item.ajustes}</td>
            <td className="p-2 border text-center">{item.stock_actual}</td>
            <td className="p-2 border text-right">
              ${parseFloat(item.ultimo_costo_unitario).toLocaleString()}
            </td>
            <td className="p-2 border font-semibold text-green-700 text-right">
              ${parseFloat(item.valor_estimado).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InventoryStatusTable;
