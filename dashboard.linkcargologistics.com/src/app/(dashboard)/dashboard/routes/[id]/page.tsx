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
import BtnBack from "@/components/buttom/BtnBack";
import InputField from "@/components/fields/InputField";
import SelectField from "@/components/fields/SelectField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdPerson,
  MdPhone,
  MdHome,
  MdLocationOn,
  MdSwapHoriz,
  MdDownload,
} from "react-icons/md";
import Link from "next/link";

const prefixed = "route";

const CSRRouteFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

  const [inputs, setInputs] = useState<any>({
    name: "",
    phone: "",
    origin_address: "",
    destination_address: "",
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
        <div className="h-12 mb-4 flex justify-between items-center">
          <BtnBack back save />
        </div>

        <Card className="mt-2 shadow-lg border border-gray-100">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <MdSwapHoriz className="text-blue-600 text-2xl" />
              Formulario de Ruta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              {/* Nombre */}
              <div className="flex items-center gap-2">
                <MdPerson className="text-gray-500 text-lg" />
                <InputField
                  prefixed={prefixed}
                  name="name"
                  label="Nombre (opcional)"
                  id="name"
                  type="text"
                  defaultValue={inputs.name}
                  setInputs={setInputs}
                />
              </div>

              {/* Celular */}
              <div className="flex items-center gap-2">
                <MdPhone className="text-gray-500 text-lg" />
                <InputField
                  required
                  prefixed={prefixed}
                  name="phone"
                  label="Celular"
                  id="phone"
                  type="text"
                  defaultValue={inputs.phone}
                  setInputs={setInputs}
                />
              </div>

              {/* Dirección origen */}
              <div className="flex items-center ">
                <MdHome className="text-gray-500 text-lg" />
                <InputField
                  required
                  prefixed={prefixed}
                  name="origin_address"
                  label="Dirección recogida/entrega caja"
                  id="origin_address"
                  type="text"
                  defaultValue={inputs.origin_address}
                  setInputs={setInputs}
                />
              </div>

              {/* Dirección destino */}
              <div className="flex items-center ">
                <MdLocationOn className="text-gray-500 text-lg" />
                <InputField
                  required
                  prefixed={prefixed}
                  name="destination_address"
                  label="Dirección destino"
                  id="destination_address"
                  type="text"
                  defaultValue={inputs.destination_address}
                  setInputs={setInputs}
                />
              </div>

              {/* Tipo de movimiento */}
              <div className="flex items-center gap-2">
                <MdSwapHoriz className="text-gray-500 text-lg" />
                <SelectField
                  required
                  prefixed={prefixed}
                  name="type"
                  label="Tipo de movimiento"
                  id="type"
                  defaultValue={inputs.type}
                  setInputs={setInputs}
                  options={[
                    { value: "deliver", label: "Dejar caja" },
                    { value: "pickup", label: "Recoger caja" },
                  ]}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center mt-6">
              <Link
                href="/img/excel.xls"
                download="formato_ruta.xls"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                <MdDownload className="text-lg" />
                Descargar Formato Modelo
              </Link>              
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CSRRouteFormComponent;
