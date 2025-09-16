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

import { Fragment, useState } from "react";
import { MdFileUpload, MdAddCircle, MdDelete } from "react-icons/md";
import Card from "@/components/card";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

interface Props {
  routes: {
    order: number;
    address: string;
    lat: number;
    lng: number;
  }[];
  formData?:any;
  getInit?:any;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const CSRRouteImportComponent: React.FC<Props> = ({ items, setItems, routes , formData, getInit}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado para agregar manualmente
  const [newItem, setNewItem] = useState<any>({
    name: "",
    phone: "",
    origin_address: "",
    destination_address: "",
    type: "deliver",
    status: "Borrador",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token || null;

      const form = new FormData();
      form.append("file", file);

      let BACKEND = "";
      if (window && window.location && window.location.hostname) {
        BACKEND = `${window.location.protocol}//${window.location.hostname}`;
        if (window.location.port) {
          BACKEND += `:${process.env.NEXT_PUBLIC_PORT}`;
        }
        BACKEND += process.env.NEXT_PUBLIC_VERSION || "/api/v1";
      }

      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        BACKEND =
          process.env.NEXT_PUBLIC_BACKEND_URL + process.env.NEXT_PUBLIC_VERSION;
      }

      const response = await fetch(BACKEND + "/routes/import-excel", {
        method: "POST",
        body: form,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const responseData = await response.json();

      if (responseData?.data?.items) {
        setItems(responseData.data.items);
      }
    } catch (err) {
      console.error("Error al subir archivo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManual = () => {
    setItems((prev) => [...prev, { ...newItem }]);
    setNewItem({
      name: "",
      phone: "",
      origin_address: "",
      destination_address: "",
      type: "deliver",
      status: "Borrador",
    });
  };

  const handleDelete = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAccept = (idx: string, id:any) => {
    console.log("Aceptar ruta:", idx);
    formData
      .handleRequest(
        formData.backend + "/dashboard/routes/2/set-status-address",
        "post",
        {
          direction:idx,
          status:"accept",
          route_items:id
        }        
      )
      .then((res: any) => {
        //getInit()
        setItems(res.items)        
      });
  };

  const handleReject = (idx: string, id:any) => {
    console.log("Rechazar ruta:", idx);
    formData
      .handleRequest(
        formData.backend + "/dashboard/routes/2/set-status-address",
        "post",
        {
          direction:idx,
          status:"reject",
          route_items:id
        }        
      )
      .then((res: any) => {
        //getInit()
        setItems(res.items)
        console.log(res)
      });
  };
  

  return (
    <div className="mt-5">
      <Card className="shadow-lg border border-gray-100">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <MdFileUpload className="text-blue-600 text-2xl" />
            Importar Items desde Excel o agregar manualmente
          </h2>

          {/* Input de archivo */}
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Subiendo..." : "Subir y Procesar"}
          </button>

          {/* Formulario de agregar manual */}
          <div className="mt-8 space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <MdAddCircle className="text-green-600 text-xl" />
              Agregar Item Manualmente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p: any) => ({ ...p, name: e.target.value }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={newItem.phone}
                onChange={(e) =>
                  setNewItem((p: any) => ({ ...p, phone: e.target.value }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Origen"
                value={newItem.origin_address}
                onChange={(e) =>
                  setNewItem((p: any) => ({
                    ...p,
                    origin_address: e.target.value,
                  }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Destino"
                value={newItem.destination_address}
                onChange={(e) =>
                  setNewItem((p: any) => ({
                    ...p,
                    destination_address: e.target.value,
                  }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
              <select
                value={newItem.type}
                onChange={(e) =>
                  setNewItem((p: any) => ({ ...p, type: e.target.value }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option value="deliver">Dejar caja</option>
                <option value="pickup">Recoger caja</option>
              </select>
              <select
                value={newItem.status}
                onChange={(e) =>
                  setNewItem((p: any) => ({ ...p, status: e.target.value }))
                }
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option>Borrador</option>
                <option>Agendado</option>
                <option>En proceso</option>
                <option>Rechazado</option>
                <option>Cancelado</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddManual}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Agregar
            </button>
          </div>
        </div>
      </Card>

       <Card className="shadow-lg border border-gray-100">
        <div className="mt-5 grid h-full md:grid-cols-2 gap-5">
          {/* Rutas */}
          <div>
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-700">Ruta a seguir</h2>
              {
              routes.length > 0 ? (
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
                        {
                          /*
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                              Latitud
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                              Longitud
                            </th>  
                          */
                        }
                        
                        <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {routes.map((route, idx) => {
                        // Buscar items relacionados con esta dirección
                        const relatedItems = items.filter(
                          (it) => it.origin_address === route.address
                        );

                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{route.order}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                              {route.address}
                              {relatedItems.length > 0 && (
                                <div className="mt-1 text-xs text-gray-500 space-y-1">
                                  {relatedItems.map((it) => (
                                    <div key={it.id} className="flex flex-col">
                                      <span>
                                        <strong>ID:</strong> {it.id}
                                      </span>
                                      <span>
                                        <strong>Guía:</strong> {it.guide}
                                      </span>
                                      <span>
                                        <strong>Status:</strong> {it.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center space-x-3">
                              {
                                relatedItems.find((search:any)=>{return search.status==='Borrador'})?<Fragment>
                                  <button
                                    type="button"
                                    onClick={() => handleAccept(route.address,relatedItems[0]?.id)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <FaThumbsUp />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReject(route.address,relatedItems[0]?.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaThumbsDown />
                                  </button>
                                </Fragment>:<span className="text-gray-500">
                                  {
                                    relatedItems.find((search:any)=>{return search.status}).status
                                  }
                                </span>
                              }
                              
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No hay datos de la ruta.</p>
              )}
            </div>
          </div>

          {/* Items */}
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
