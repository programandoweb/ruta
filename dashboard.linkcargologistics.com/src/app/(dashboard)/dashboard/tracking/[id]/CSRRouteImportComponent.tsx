"use client";

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/card";
import CSRRouteTable from "./CSRRouteTable";
import CSRRouteCardsMobile from "./CSRRouteCardsMobile";

const CSRRouteTableComponent = ({
  items,
  setItems,
  routes,
  formData,
  inputs: data,
  getInit,
}: any) => {
  const itemsById = useMemo(
    () => new Map(items.map((item: any) => [item.phone, item])),
    [items]
  );

  const [inputs, setInputs] = useState<any>({});

  const openGoogleMapsAndNotify = async (route: any) => {
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

      //const message = `Hola, ya estamos cerca a recoger su caja en ${route.address}, por favor esté pendiente`;
      // Enviar todos los mensajes en paralelo
      //await Promise.all(recipients.map(to => sendWhatsAppMessage(to, message)));

    }

    
  };

  const handleAccept = (address: string, itemId: number, row: any) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/${itemId}/set-status-address-by-items`,
        "post",
        { direction: address, status: "accept", route_items: itemId, row }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
        getInit?.();
      });
  };

  const handleReject = (address: string, itemId: number, row: any) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/${itemId}/set-status-address-by-items`,
        "post",
        { direction: address, status: "reject", route_items: itemId, row }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
        getInit?.();
      });
  };

  /*
  useEffect(()=>{
    if(inputs?.gallery){
      formData.handleRequest(formData.backend + location.pathname,
        "put",
        { gallery: inputs?.gallery }
      ).then((response: any) => {
        console.log(response)
      })
      console.log(inputs?.gallery)
    }
    
  },[inputs])
  */

  if (!routes.length) {
    return (
      <Card className="mt-6 p-6 text-center text-gray-500">
        No hay datos de la ruta para mostrar.
      </Card>
    );
  }

  return (
    <div className="mt-6">

      {/* 📱 MOBILE */}
      <div className="block lg:hidden">
        <CSRRouteCardsMobile
          routes={routes}
          itemsById={itemsById}
          data={data}
          setInputs={setInputs}
          handleAccept={handleAccept}
          handleReject={handleReject}
          openGoogleMapsAndNotify={openGoogleMapsAndNotify}
        />
      </div>

      {/* 🖥️ DESKTOP */}
      <div className="hidden lg:block">
        <CSRRouteTable
          routes={routes}
          itemsById={itemsById}
          data={data}
          setInputs={setInputs}
          handleAccept={handleAccept}
          handleReject={handleReject}
          openGoogleMapsAndNotify={openGoogleMapsAndNotify}
        />
      </div>

    </div>
  );
};

export default CSRRouteTableComponent;
