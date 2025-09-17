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
import { FaThumbsUp, FaThumbsDown, FaMapMarkedAlt } from "react-icons/fa";


interface Props {
  routes: {
    order: number;
    address: string;
    lat: number;
    lng: number;
  }[];
  formData?: any;
  getInit?: any;
  items: any[];
  
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const CSRRouteImportComponent: React.FC<Props> = ({
  items,
  setItems,
  routes,
  formData,
  getInit,  
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState<any>({
    name: "",
    phone: "",
    origin_address: "",
    destination_address: "",
    type: "deliver",
    status: "Borrador",
  });

  const openGoogleMaps = (lat: number, lng: number) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const baseUrl = isMobile
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(baseUrl, "_blank");
  };

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

  const handleAccept = (idx: string, id: any) => {
    formData
      .handleRequest(
        formData.backend + "/dashboard/routes/2/set-status-address",
        "post",
        { direction: idx, status: "accept", route_items: id }
      )
      .then((res: any) => {
        setItems(res.items);
      });
  };

  const handleReject = (idx: string, id: any) => {
    formData
      .handleRequest(
        formData.backend + "/dashboard/routes/2/set-status-address",
        "post",
        { direction: idx, status: "reject", route_items: id }
      )
      .then((res: any) => {
        setItems(res.items);
      });
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "Borrador":
        return "border-gray-400";
      case "Agendado":
        return "border-blue-500";
      case "En proceso":
        return "border-yellow-500";
      case "Rechazado":
        return "border-red-500";
      case "Cancelado":
        return "border-purple-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="mt-5">
      <Card className="shadow-lg border border-gray-100">
        <div className="p-6 space-y-6">
          {/* Input y carga de archivo */}
          {routes.length === 0 && (
            <Fragment>
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <MdFileUpload className="text-blue-600 text-2xl" />
                Importar Items desde Excel o agregar manualmente
              </h2>
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
            </Fragment>
          )}

          {/* Agregar manual */}
          <div
            className={
              routes.length === 0
                ? "mt-8 space-y-4 border-t pt-6"
                : "mt-0 space-y-4 pt-6"
            }
          >
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

      <Card>
        <div className="mt-5 grid h-full md:grid-cols-2 gap-5">
          {/* Rutas */}
          <div>
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700">Ruta a seguir</h2>
              {routes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routes.map((route, idx) => {
                    
                    let relatedItems = items.filter(
                      (it) => it.origin_address === route.address
                    );
                    
                    if(!relatedItems||relatedItems.length===0){
                      relatedItems = items.filter(
                        (it) => it.origin_address?.toLowerCase().includes(route.address.toLowerCase())
                      );
                    }
                    
                    const status = relatedItems[0]?.status || "Borrador";
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg shadow-sm border-2 ${getBorderColor(
                          status
                        )} bg-white`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            #{route.order}
                          </span>
                          <span className="text-xs text-gray-500">{status}</span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">
                          {route.address}
                        </p>

                        <div className="mt-3 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openGoogleMaps(route.lat, route.lng)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaMapMarkedAlt />
                          </button>

                          

                          {relatedItems.find(
                            (s: any) => s.status === "Borrador"
                          ) ? (
                            <Fragment>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAccept(route.address, relatedItems[0]?.id)
                                }
                                className="text-green-600 hover:text-green-800"
                              >
                                <FaThumbsUp />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleReject(route.address, relatedItems[0]?.id)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaThumbsDown />
                              </button>
                            </Fragment>
                          ) : (
                            <span className="text-gray-500 text-sm">{status}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No hay datos de la ruta.</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Listado de Items</h2>
            {items.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg shadow-sm border border-gray-200 bg-white"
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      Guía: {item.guide}
                    </p>
                    <p className="text-sm text-gray-700">Nombre: {item.name}</p>
                    <p className="text-sm text-gray-700">Teléfono: {item.phone}</p>
                    <p className="text-sm text-gray-700">
                      Origen: {item.origin_address}
                    </p>
                    <p className="text-sm text-gray-700">
                      Destino: {item.destination_address}
                    </p>
                    <p className="text-sm text-gray-700 capitalize">
                      Tipo: {item.type}
                    </p>
                    <p className="text-sm text-gray-700">Estado: {item.status}</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
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
