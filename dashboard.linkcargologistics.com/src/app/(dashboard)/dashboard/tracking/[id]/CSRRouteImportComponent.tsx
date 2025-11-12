"use client";

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * website: Programandoweb.net
 * Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

import { Fragment, useMemo, useState } from "react";
import Card from "@/components/card";
import { FaThumbsUp, FaThumbsDown, FaMapMarkedAlt } from "react-icons/fa";

// 1. Interfaz actualizada para la prop 'routes'
interface RouteItem {
  order: number;
  address: string;
  lat: number;
  lng: number;
  id_direccion_item: number | null; // El ID que viene del backend
  origen_real:string;
}

interface Item {
  id: number;
  guide: string;
  status: string;
  type: 'pickup' | 'deliver';
  origin_address: string;
  origen_real:string;
  phone?:any;
  // ...otras propiedades del item
}

interface Props {
  routes: RouteItem[];
  formData?: any;
  getInit?: any;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const CSRRouteTableComponent: React.FC<Props> = ({ items, setItems, routes, formData }) => {
  // 2. Optimización: Se crea un mapa para buscar items por ID de forma instantánea.
  //    useMemo evita que este mapa se recalcule en cada render, solo si 'items' cambia.
  const itemsById = useMemo(() => 
    new Map(items.map(item => [item.phone, item])),
    [items]
  );

  // Función auxiliar para enviar mensajes de WhatsApp y evitar código repetido
  const sendWhatsAppMessage = async (recipient: string, message: string) => {
    try {
      const response = await fetch("https://ws-server.ivoolve.com/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient, message }),
      });
      const data = await response.json();
      console.log(`📩 Mensaje enviado a ${recipient}:`, data);
    } catch (error) {
      console.error(`❌ Error enviando a ${recipient}:`, error);
    }
  };

  const openGoogleMapsAndNotify = async (route: RouteItem) => {
    // 1. Validar que el objeto route y la dirección existan.
    if (!route || !route.address) {
      console.error("El objeto 'route' o la 'address' no son válidos.");
      return;
    }

    const encodedAddress = encodeURIComponent(route.address);
    // 3. Crear una URL de búsqueda estándar y robusta para Google Maps.
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      const whatsappPhone:any = items.find((search:any)=>{return search.id===route?.id_direccion_item})
      //console.log(whatsappPhone)
      //return;
      // Abrir Google Maps
      //const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${route.lat},${route.lng}&travelmode=driving`;
      window.open(mapUrl, "_blank");

      // Números a notificar
      /*
      const recipients = [
        "573217002700@c.us",
        "573115000926@c.us",
        "5215526589002@c.us",
      ];
      */

      if(whatsappPhone?.phone){
        const recipients = [        
        whatsappPhone?.phone+"@c.us",
        /*"573217002700@c.us",*/
        "573115000926@c.us",
        "5215526589002@c.us",
      ];

      const message = `Hola, ya estamos cerca a recoger su caja en ${route.address}, por favor esté pendiente`;

      // Enviar todos los mensajes en paralelo
      await Promise.all(recipients.map(to => sendWhatsAppMessage(to, message)));

    }

    
  };
  
  const handleAccept = (address: string, itemId: number) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/2/set-status-address`,
        "post",
        { direction: address, status: "accept", route_items: itemId }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
      });
  };

  const handleReject = (address: string, itemId: number) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/2/set-status-address`,
        "post",
        { direction: address, status: "reject", route_items: itemId }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
      });
  };


  


  return (
    <div className="">
      <Card className="shadow-lg border border-gray-100 mt-6">
        <div>
          {routes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Dirección y Detalles</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {routes.map((route:any,key:number) => {

                    // 3. Lógica principal refactorizada: Búsqueda por ID en el mapa O(1).
                    const relatedItem:any = itemsById.get(route.phone!);
                    //console.log(route)
                    return (
                      <tr key={route.order} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 align-top">
                          <p className="text-sm font-medium text-gray-900"><span>{key+1}{")"}</span> Dirección Real: {route.origen_real} </p>
                          {relatedItem && (
                            <div className="mt-2 text-xs text-gray-600 border-l-2 border-blue-200 pl-2 space-y-1">
                              <p><strong>Dirección IA:</strong> {route.address}</p>
                              <p><strong>Guía:</strong> {relatedItem.guide}</p>
                              <p><strong>Nombre:</strong> {relatedItem.name||"No Disponible"}</p>
                              <p><strong>Teléfono:</strong> {relatedItem.phone}</p>
                              <p><strong>Status:</strong> <span className="font-semibold">{relatedItem.status}</span></p>
                              <p><strong>Acción:</strong> {relatedItem.type === 'pickup' ? "Recoger Caja" : "Dejar Caja"}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <div className="flex justify-center items-center space-x-4">
                            <button
                              type="button"
                              title="Abrir Mapa y Notificar"
                              onClick={() => openGoogleMapsAndNotify(route)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FaMapMarkedAlt size={20} />
                            </button>

                            {/* 4. Lógica de botones simplificada */}
                            {relatedItem && relatedItem.status === "Borrador" ? (
                              <Fragment>
                                <button
                                  type="button"
                                  title="Aceptar"
                                  onClick={() => handleAccept(route.address, relatedItem.id)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                  <FaThumbsUp size={20} />
                                </button>
                                <button
                                  type="button"
                                  title="Rechazar"
                                  onClick={() => handleReject(route.address, relatedItem.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <FaThumbsDown size={20} />
                                </button>
                              </Fragment>
                            ) : (
                               <span className="text-xs text-gray-500 font-semibold uppercase">
                                {relatedItem?.status}
                               </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No hay datos de la ruta para mostrar.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CSRRouteTableComponent;