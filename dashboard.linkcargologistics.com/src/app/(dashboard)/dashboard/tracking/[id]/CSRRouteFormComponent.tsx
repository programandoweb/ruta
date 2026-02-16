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

import useFormData from "@/hooks/useFormDataNew";
import { useEffect, useState } from "react";
import RouteFormHeader from "./RouteFormHeader";
import CSRRouteImportComponent from "./CSRRouteImportComponent";


const prefixed = "route";

const CSRRouteFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  

  const [inputs, setInputs] = useState<any>({
    date: "2025-10-18",
    name: "Carlos Ramirez",
    phone: "559-123-4567",
    origin_address: "Fresno City Hall, 2600 Fresno St, Fresno, CA 93721",
    destination_address:
      "California State Capitol, 1315 10th St, Sacramento, CA 95814",
    type: "deliver",
  });

  const [items, setItems]     = useState<any>([]);
  const [routes, setRoutes]   = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const getInit = () => {
    setLoading(true);
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        const data = response[prefixed];
        if (!data) return;

        setInputs(data);

        //console.log(data)

        // --- SANEAMIENTO CRÍTICO ---
        if (data.cache_json && data.items) {

          console.log(1)
          // 1. Decodificar si viene como string
          const rawRoutes = typeof data.cache_json === 'string' 
            ? JSON.parse(data.cache_json) 
            : data.cache_json;

          // 2. Mapear para asegurar compatibilidad con CSRRouteTableComponent
          const sanitizedRoutes = rawRoutes.map((route: any) => {
            // Buscamos el item real en la DB por dirección u orden
            const dbMatch = data.items.find((it: any) => 
               it.origin_address === (route.address || route.origin_address)
            );

            //console.log(route?.observation_sender)
            
            return {
              //samantha:dbMatch,
              statuses:dbMatch?.json_status,
              ...route,
              // Forzamos el ID real de la base de datos para que handleAccept funcione
              id: dbMatch?.id || route.id, 
              // Aseguramos que existan campos que los componentes hijos piden
              address: route.address || route.origin_address,
              phone: route.phone || route.phone_sender,
              status: dbMatch?.status || route.status || 'Agendado'
            };
          });

          setRoutes(sanitizedRoutes);
        }
        
        if (data.items) {
          setItems(data.items);
        }
      })
      .finally(() => setLoading(false));
  };


  
  /*
  const getInit = () => {
    setLoading(true);
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setInputs(response[prefixed]);
        }
        console.log(response[prefixed]?.cache_json)
        if (response && response[prefixed]?.cache_json) {
          console.log(response[prefixed]?.cache_json)
          //setRoutes(response[prefixed]?.cache_json);
        }
        if (response && response[prefixed] && response[prefixed].items) {
          setItems(response[prefixed].items);
        }
      })
      .finally(() => setLoading(false));
  };
  */

  useEffect(getInit, []);

 
  if(loading){
    return <div className="mt-5 grid h-full grid-cols-1 gap-5">Esperando por la IA...</div>
  }

  //console.log(routes)

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      
        <RouteFormHeader />
       
        <CSRRouteImportComponent getInit={getInit} formData={formData}  routes={routes}  items={items} setItems={setItems} inputs={inputs} />            
      
    </div>
  );
};

export default CSRRouteFormComponent;
