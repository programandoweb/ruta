'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { FC } from 'react';

interface InventoryItem {
  inventory_item: {
    name: string;
    avg_cost: string;
  };
  qty: string;
  unit: {
    code: string;
  };
}

interface Product {
  id: number;
  name: string;
  price: string | number;
  total_cost: number;
  ganancia_neta: number;
  porcentaje_ganancia: number;
  items: InventoryItem[];
}

const ProductProfitTable: FC<{ data: Product[] }> = ({ data }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full text-sm text-left border bg-white">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase text-center">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Precio Venta</th>
            <th className="p-2 border">Costo Total</th>
            <th className="p-2 border">Ganancia Neta</th>
            <th className="p-2 border">% Ganancia</th>
            <th className="p-2 border">Materia Prima</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, idx) => (
            <tr key={product.id} className="hover:bg-gray-50 text-center align-top">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border text-green-700 font-semibold">
                ${parseFloat(product.price.toString()).toLocaleString('es-CO')}
              </td>
              <td className="p-2 border">
                ${product.total_cost.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </td>
              <td className="p-2 border text-blue-700 font-semibold">
                ${product.ganancia_neta.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </td>
              <td className="p-2 border text-purple-700">
                {product.porcentaje_ganancia.toFixed(2)}%
              </td>
              <td className="p-2 border text-left">
                {product.items.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {product.items.map((item, index) => (
                      <li key={index}>
                        {item.inventory_item.name} — {parseFloat(item.qty).toFixed(2)}{' '}
                        {item.unit?.code} × $
                        {parseFloat(item.inventory_item.avg_cost).toLocaleString('es-CO', {
                          minimumFractionDigits: 2,
                        })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 italic">Sin insumos</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductProfitTable;
