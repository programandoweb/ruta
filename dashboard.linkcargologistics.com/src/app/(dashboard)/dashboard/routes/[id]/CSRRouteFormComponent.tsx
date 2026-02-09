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
import CSRRouteImportComponent from "./CSRRouteImportComponent";
import { FiCopy, FiSend } from "react-icons/fi";



const prefixed  =   "route";
const endpoints =   process.env.NEXT_PUBLIC_REMOTE_SYSTEMS

const CSRRouteFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];

  const [inputs, setInputs] = useState<any>({
    //date: "2025-10-18",
    date: today,
    name: "Carlos Ramirez",
    phone: "559-123-4567",
    destination_address: "8861 Houghton Rd, Bakersfield, CA 93311, Estados Unidos",
    origin_address:"QH9R+P9, Roseville, CA 95747, Estados Unidos",
    type: "deliver",
  });

  const [items, setItems]     = useState<any>([]);
  const [routes, setRoutes]   = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<any>([]);
  const [prompt, setPrompt]   = useState<string|undefined>("");
  const [remote, setRemote]   = useState<any>([]);

  const [manualIa, setManualIa] = useState<string>("");
  const [processingIa, setProcessingIa] = useState<boolean>(false);
  const [cache_json, set_cache_json]   = useState<any>(null);
  

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

        if(response?.route){
          set_cache_json(response?.route?.cache_json)          
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
      //requestIa()
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
    //document.location.reload()
    //setProcessingIa(false);
    //getInit();
  };

  useEffect(() => {
      if (!endpoints || !inputs?.id) return;

      const fetchDeliveryBox = async () => {
          try {
              const res = await fetch(
                  `${endpoints}/delivery_box/${inputs.id}`,
                  {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',                          
                      },
                  }
              );

              const json = await res.json();

              if (!res.ok) {
                  console.error(json);
                  return;
              }
              
              if (json?.data) {
                const rows: any[] = [];

                json.data.forEach((pkg: any) => {

                  const name_sender   = pkg?.name_sender??""
                  const company_name  = (pkg?.name_sender)?pkg?.company?.name:"";

                  //console.log(pkg?.name_sender)

                  // Solo guías que terminen en MOV
                  //if (!pkg?.guideNumber?.toLowerCase().includes("m")) return;

                  const baseGuide = pkg.guideNumber; // ej: ECM91R1J393
                  const prefix = baseGuide.substring(0, 2); // EC
                  const rest = baseGuide.substring(2);      // M91R1J393

                  const itemsConcat: string[] = [];

                  pkg.items?.forEach((it: any, index: number) => {
                    const key = index + 1; // para diferenciar guías
                    const size = it.size;  // 18x18x18
                    const company = "MOV";
                    const guide =
                      `${prefix}${rest.substring(0, 1)}${rest.substring(1)}_${size}${key}_${company}`;

                    itemsConcat.push(guide);
                  });

                  //console.log(pkg?.pickup_day,pkg?.delivery_day)
                  /*
                  if(!pkg?.sender_location?.company_id){
                    //console.log(pkg?.company?.name)
                  }
                  */
                 
                  rows.push({
                    ...pkg,
                    company_name:company_name,
                    guide_items: itemsConcat.join(","),                 // Col 1
                    name_sender: name_sender,               // Col 2
                    phone_sender: pkg.company?.celular ?? "",            // Col 3
                    address:
                      pkg.sender_location?.sender_formatted_address ??
                      "",                                                // Col 4
                    type: pkg?.delivery_day?"delivery":"pickup",        // Col 5
                    status: "",                                         // Col 6
                    payment: "",                                        // Col 7
                    cost: pkg.cost ?? "",                               // Col 8
                    deposit: pkg.deposit ?? "",                         // Col 9
                    comment: pkg.description ?? "",                     // Col 10
                    day: pkg.sender_location?.pickup_day ?? "",         // Col 11
                    pickup_day: pkg.pickup_day ?? "",                         // Col 9
                    delivery_day: pkg.delivery_day ?? "",                         // Col 9
                  });

                });

                //console.log(rows)

                setRemote(rows);
              }

              
              
          } catch (error) {
              console.error(error);
          }
      };

      fetchDeliveryBox();

  }, [inputs?.id]);

  //console.log(remote)

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
                  <CSRRouteImportComponent cache_json={cache_json} remote={remote} loading={loading} getInit={getInit} formData={formData}  routes={routes} inputs={inputs} setInputs={setInputs}  items={items} setItems={setItems} />
                )}
                
              </Fragment>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CSRRouteFormComponent;
