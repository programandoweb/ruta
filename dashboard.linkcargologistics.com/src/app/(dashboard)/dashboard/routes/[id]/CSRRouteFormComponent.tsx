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
import { FiCopy, FiSend } from "react-icons/fi";



const prefixed = "route";

const CSRRouteFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];

  const [inputs, setInputs] = useState<any>({
    //date: "2025-10-18",
    date: today,
    name: "Carlos Ramirez",
    phone: "559-123-4567",
    destination_address: "7745 Laurie Way, Sacramento, CA 95832",
    origin_address:"Fresno City Hall, 2600 Fresno St, Fresno, CA 93721",
    type: "deliver",
  });

  const [items, setItems]     = useState<any>([]);
  const [routes, setRoutes]   = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<any>([]);
  const [prompt, setPrompt]   = useState<string|undefined>("");

  const [manualIa, setManualIa] = useState<string>("");
  const [processingIa, setProcessingIa] = useState<boolean>(false);

  

  const getInit = () => {
    if (location.pathname.endsWith("/new")) return;
    setLoading(true);
    
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setInputs(response[prefixed]);
        }
        if (response && response?.prompt) {
          setPrompt(response?.prompt);
        }else{
          setPrompt(response?.[prefixed]?.prompt);
        }


        if (response && response.dataset) {
          setRoutes(response.dataset);
        }else{
          /*
          if (count < 5) {
            setCount(prev => prev + 1);
            return getInit();
          } else {
            setLoading(false);
          }   
          */  
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

  const requestIa = () => {

    //return console.log(formData.backend+ location.pathname+"/status");
    setLoading(true);
    formData
      .handleRequest(formData.backend+ location.pathname+"/status")
      .then((response: any) => {
        if(response&&response.route&&response.route.cache_json){
          getInit()
        }else{
          requestIa()
        }        
      })
      //.finally(() => setLoading(false));
  };

  useEffect(()=>{
    if(items.length>0 && routes.length===0){
      requestIa()
      return;
    }
  },[items])

  if(loading){
    //return <div className="mt-5 grid h-full grid-cols-1 gap-5">Esperando por la IA...</div>
  }


  const submitIaManual = async () => {
    if (!manualIa.trim()) return;

    setProcessingIa(true);

    await formData.handleRequest(
      formData.backend + location.pathname + "/iaManual",
      "post",
      { prompt: manualIa }
    );
    document.location.reload()
    //setProcessingIa(false);
    //getInit();
  };


  //console.log(prompt)

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
            {
              prompt && (
                <div className="relative text-xs bg-gray-50 border rounded-xl p-4 space-y-4 shadow-inner">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Prompt generado por IA</h3>

                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(prompt)}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
                      title="Copiar prompt"
                    >
                      <FiCopy size={14} />
                      <span className="text-[10px]">Copiar</span>
                    </button>
                  </div>

                  {/* Prompt */}
                  <pre className="bg-white border rounded-lg p-3 text-[11px] leading-relaxed max-h-60 overflow-auto">
                    {prompt}
                  </pre>

                  {/* Entrada manual */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-gray-600">
                      Pegar resultado IA manual
                    </label>

                    <textarea
                      value={manualIa}
                      onChange={(e) => setManualIa(e.target.value)}
                      rows={4}
                      placeholder="Pega aquí el resultado generado por otra IA…"
                      className="w-full text-xs border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={submitIaManual}
                        disabled={processingIa}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium
                                  bg-blue-600 text-white rounded-lg
                                  hover:bg-blue-700 disabled:opacity-50"
                      >
                        <FiSend size={14} />
                        {processingIa ? "Procesando…" : "Procesar manualmente"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            }


            

            {inputs?.id && (
              <Fragment>
                {loading ? (
                  <div className="text-center py-6 text-gray-500 font-medium">
                    Cargando rutas...
                  </div>
                ) : (
                  <CSRRouteImportComponent loading={loading} getInit={getInit} formData={formData}  routes={routes} inputs={inputs}  items={items} setItems={setItems} />
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
