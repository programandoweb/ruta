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

import Card from "@/components/card";
import useFormData from "@/hooks/useFormDataNew";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdSwapHoriz } from "react-icons/md";

import RouteFormHeader from "./RouteFormHeader";
import RouteFormFields from "./RouteFormFields";
import RouteFormActions from "./RouteFormActions";
import CSRRouteImportComponent from "./CSRRouteImportComponent";


const prefixed = "route";

const CSRRouteFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

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
        if (response && response[prefixed]) {
          setInputs(response[prefixed]);
        }
        if (response && response.ia && response.ia.dataset) {
          console.log(response.ia.dataset)
          setRoutes(response.ia.dataset);
        }
        if (response && response[prefixed] && response[prefixed].items) {
          setItems(response[prefixed].items);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(getInit, []);

 
  if(loading){
    return <div className="mt-5 grid h-full grid-cols-1 gap-5">Esperando por la IA...</div>
  }

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      
        <RouteFormHeader />
       
        <CSRRouteImportComponent getInit={getInit} formData={formData}  routes={routes}  items={items} setItems={setItems} />            
      
    </div>
  );
};

export default CSRRouteFormComponent;
