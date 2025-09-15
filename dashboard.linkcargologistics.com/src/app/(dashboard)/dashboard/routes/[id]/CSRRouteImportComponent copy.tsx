"use client";

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

import { MdDelete } from "react-icons/md";
import Card from "@/components/card";

interface Props {
  routes: {
    order: number;
    address: string;
    lat: number;
    lng: number;
  }[];
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const CSRRouteImportComponent: React.FC<Props> = ({ items, setItems, routes }) => {
  const handleDelete = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };
  console.log(routes.length)
  return (
    <div className="mt-5 space-y-10">
      {/* Tabla de Items */}
      <Card className="shadow-lg border border-gray-100">
        <div className="mt-5 grid h-full md:grid-cols-2 gap-5">
          <div>
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-700">Ruta a seguir</h2>
              {routes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Dirección
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Latitud
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Longitud
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {routes.map((route, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {route.order}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {route.address}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {route.lat}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {route.lng}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No hay datos de la ruta.</p>
              )}
            </div>
          </div>
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Listado de Items</h2>
            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Guía
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Teléfono
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Origen
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Destino
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Tipo
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.guide}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.phone}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.origin_address}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.destination_address}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 capitalize">
                          {item.type}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.status}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No hay items en la ruta.</p>
            )}
          </div>
        </div>
      </Card>
      
    </div>
  );
};

export default CSRRouteImportComponent;
