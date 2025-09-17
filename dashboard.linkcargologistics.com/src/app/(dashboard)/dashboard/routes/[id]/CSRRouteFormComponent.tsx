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
  const [drivers, setDrivers] = useState<any>([]);

  const getInit = () => {
    setLoading(true);
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setInputs(response[prefixed]);
        }
        if (response && response.ia && response.ia.dataset) {
          setRoutes(response.ia.dataset);
        }
        if (response && response[prefixed] && response[prefixed].items) {
          setItems(response[prefixed].items);
        }
        if (response && response.drivers) {
          setDrivers(response.drivers);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? "put" : "post",
        { ...inputs, items }
      )
      .then((res: any) => {
        setInputs(res[prefixed]);
        if (!inputs.id && res[prefixed]?.id) {
          router.replace("/dashboard/routes/" + res[prefixed]?.id);
        } else {
          router.replace("/dashboard/routes");
        }
      });
  };

  if(loading){
    return <div className="mt-5 grid h-full grid-cols-1 gap-5">Esperando por la IA...</div>
  }

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      <form onSubmit={onSubmit}>
        <RouteFormHeader />

        <Card className="mt-2 shadow-lg border border-gray-100">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <MdSwapHoriz className="text-blue-600 text-2xl" />
              Formulario de Ruta
            </h2>

            <RouteFormFields drivers={drivers} inputs={inputs} setInputs={setInputs} />

            {inputs?.id && (
              <Fragment>
                {loading ? (
                  <div className="text-center py-6 text-gray-500 font-medium">
                    Cargando rutas...
                  </div>
                ) : (
                  <CSRRouteImportComponent getInit={getInit} formData={formData}  routes={routes}  items={items} setItems={setItems} />
                )}
                <RouteFormActions />
              </Fragment>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CSRRouteFormComponent;
