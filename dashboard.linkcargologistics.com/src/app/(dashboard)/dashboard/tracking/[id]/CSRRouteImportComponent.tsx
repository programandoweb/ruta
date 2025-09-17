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
import { MdFileUpload } from "react-icons/md";
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

const CSRRouteImportComponent: React.FC<Props> = ({ items, setItems, routes, formData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const openGoogleMaps = async (lat: number, lng: number,address:any) => {
    //const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const baseUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    // Abrir Google Maps en nueva pestaña
    window.open(baseUrl, "_blank");

    // Enviar mensaje al endpoint
    try {
      const response = await fetch("https://ws-server.ivoolve.com/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "573217002700@c.us",
          message: "Hola, ya estamos cerca a recoger su caja en "+address+", por favor está pendiente",
        }),
      });

      const data = await response.json();
      console.log("📩 Respuesta API WhatsApp:", data);
      
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }


     try {
      const response = await fetch("https://ws-server.ivoolve.com/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "573115000926@c.us",
          message: "Hola, ya estamos cerca a recoger su caja, por favor está pendiente",
        }),
      });

      const data = await response.json();
      console.log("📩 Respuesta API WhatsApp:", data);
      
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }

    try {
      const response = await fetch("https://ws-server.ivoolve.com/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "5215526589002@c.us",
          message: "Hola, ya estamos cerca a recoger su caja, por favor está pendiente",
        }),
      });

      const data = await response.json();
      console.log("📩 Respuesta API WhatsApp:", data);
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }

    



  };

  /*
  const openGoogleMaps2 = (lat: number, lng: number) => {




    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const baseUrl = isMobile
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(baseUrl, "_blank");

  };
  */

  return (
    <div className="">
      <Card className="shadow-lg border border-gray-100 mt-6">
        <div className="">          
          {routes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                  <tr>                    
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Dirección</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {routes.map((route, idx) => {
                    //const relatedItems = items.filter((it) => it.origin_address === route.address);
                    let relatedItems = items.filter(
                      (it) => it.origin_address === route.address
                    );
                    
                    if(!relatedItems||relatedItems.length===0){
                      relatedItems = items.filter(
                        (it) => it.origin_address?.toLowerCase().includes(route.address.toLowerCase())
                      );
                    }

                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {route.address}
                          {relatedItems.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500 space-y-1">
                              {relatedItems.map((it) => (
                                <div key={it.id} className="flex flex-col">
                                  <span><strong>ID:</strong> {it.id}</span>
                                  <span><strong>Guía:</strong> {it.guide}</span>
                                  <span><strong>Status:</strong> {it.status}</span>
                                  <span><strong>Acción:</strong> {it.type==='pickup'?"Recoger Caja":"Dejar Caja"}</span>                                  
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center space-x-3">
                          <button
                            type="button"
                            onClick={() => openGoogleMaps(route.lat, route.lng,route.address)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaMapMarkedAlt />
                          </button>

                          {relatedItems.find((search: any) => search.status === "Borrador") ? (
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
                            <span className="text-gray-500">
                              {relatedItems.find((search: any) => search.status)?.status}
                            </span>
                          )}
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
      </Card>
    </div>
  );
};

export default CSRRouteImportComponent;
