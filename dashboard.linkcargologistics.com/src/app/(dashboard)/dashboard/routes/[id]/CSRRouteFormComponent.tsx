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
import { useState } from "react";
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
    name: "Carlos Ramírez",
    phone: "3115000926",
    origin_address: "Cra 15 #23-45, Bogotá",
    destination_address: "Calle 50 #10-20, Medellín",
    type: "deliver", // deliver = dejar caja, pickup = recoger caja
    });


  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? "put" : "post",
        { ...inputs }
      )
      .then((res: any) => {
        if (!inputs.id && res[prefixed]?.id) {
          router.replace("/dashboard/routes/" + res[prefixed]?.id);
        } else {
          router.replace("/dashboard/routes");
        }
      });
  };

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

            <RouteFormFields inputs={inputs} setInputs={setInputs} />
            <CSRRouteImportComponent/>
            <RouteFormActions />
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CSRRouteFormComponent;
