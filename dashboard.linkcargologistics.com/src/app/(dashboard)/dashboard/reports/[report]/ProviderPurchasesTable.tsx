'use client';

import { FC } from 'react';

interface Purchase {
  provider_id: number;
  provider_name: string;
  total_quantity: number;
  total_value: number;
}

const ProviderPurchasesTable: FC<{ data: Purchase[] }> = ({ data }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full text-sm text-left border bg-white">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase text-center">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Proveedor</th>
            <th className="p-2 border">Total Unidades</th>
            <th className="p-2 border">Total Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50 text-center">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{item.provider_name || '-'}</td>
              <td className="p-2 border">{item.total_quantity}</td>
              <td className="p-2 border font-semibold text-green-700">
                ${parseFloat(item.total_value.toString()).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderPurchasesTable;
