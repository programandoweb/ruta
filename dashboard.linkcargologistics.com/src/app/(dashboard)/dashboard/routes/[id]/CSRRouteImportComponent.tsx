"use client";

import { Fragment, useEffect, useState } from "react";
import Card from "@/components/card";
import RouteMap from "@/components/RouteMap/RouteMap";
import RouteListColumn from "./RouteListColumn";
import ItemsListColumn from "./ItemsListColumn";
import { pickup_day } from "@/utils/dataset";
import Image from "next/image";
import { FiCopy, FiSend } from "react-icons/fi";


const test={
	"data": {
		"routes": [
			{
				"order": 1,
				"address": "8278 Meadowhaven Dr, Sacramento, CA 95828",
				"lat": 38.4597488,
				"lng": -121.4002999,
				"guideNumber": "ECM40D7C253",
				"cajas": [
					"24x24x24",
					"18x18x27"
				],
				"type": "pickup",
				"phone_sender": "654645645",
				"pickup_day": 1,
				"deposit": 0,
				"cost": 0,
				"guide_items": "ECM40D7C253_24x24x241_MOV,ECM40D7C253_18x18x272_MOV"
			},
			{
				"order": 2,
				"address": "251 Bonnie Dr, San Pablo, CA 94806",
				"lat": 37.9982506,
				"lng": -122.3293203,
				"guideNumber": "ECM65G0P245",
				"cajas": [
					"16x16x16",
					"16x16x16 promo"
				],
				"type": "pickup",
				"phone_sender": "7776676",
				"pickup_day": 2,
				"deposit": 30,
				"cost": 310,
				"guide_items": "ECM65G0P245_16x16x161_MOV,ECM65G0P245_16x16x16 promo2_MOV"
			},
			{
				"order": 3,
				"address": "1510 Silverstone Pl, San Jose, CA 95122",
				"lat": 37.3438696,
				"lng": -121.8239905,
				"guideNumber": "ECM39J7C355",
				"cajas": [
					"18x18x27",
					"16x16x16",
					"14x14x14 Gratis"
				],
				"type": "pickup",
				"phone_sender": "876867867867",
				"pickup_day": 1,
				"deposit": 30,
				"cost": 310,
				"guide_items": "ECM39J7C355_18x18x271_MOV,ECM39J7C355_16x16x162_MOV,ECM39J7C355_14x14x14 Gratis3_MOV"
			}
		],
		"prompt_used": "Actúa como experto en logística. Ordena estas paradas intermedias de forma eficiente.\nINICIO: QH9R+P9, Roseville, CA 95747, Estados Unidos | DESTINO: 8861 Houghton Rd, Bakersfield, CA 93311, Estados Unidos\nREGLAS OBLIGATORIAS:\n1. Devuelve EXCLUSIVAMENTE un JSON válido (un array de objetos).\n2. No incluyas el punto de Inicio ni el de Destino dentro del JSON.\n3. No modifiques el texto de las direcciones, nombres o números telefónicos.\n4. Mantén TODOS los campos técnicos (guideNumber, cajas, phone_sender, etc.) asociados a cada dirección.\nFORMATO DE RESPUESTA REQUERIDO:\n[\n  {\n    \"order\": 1,\n    \"address\": \"...\",\n    \"lat\": 0.0,\n    \"lng\": 0.0,\n    \"guideNumber\": \"...\",\n    \"cajas\": [...],\n    \"type\": \"...\",\n    \"phone_sender\": \"...\",\n    \"pickup_day\": 0,\n    \"deposit\": 0,\n    \"cost\": 0\n  }\n]\nPARADAS:\n1) - 251 Bonnie Dr, San Pablo, CA 94806 | guideNumber: ECM65G0P245 | cajas: [\"16x16x16\",\"16x16x16 promo\"] | type: pickup | phone_sender: 7776676 | address: 251 Bonnie Dr, San Pablo, CA 94806 | pickup_day: 2 | deposit: 30 | cost: 310 | Lat: 37.9982506 | Lng: -122.3293203\n2) - 8278 Meadowhaven Dr, Sacramento, CA 95828 | guideNumber: ECM40D7C253 | cajas: [\"24x24x24\",\"18x18x27\"] | type: pickup | phone_sender: 654645645 | address: 8278 Meadowhaven Dr, Sacramento, CA 95828 | pickup_day: 1 | deposit: 0 | cost: 0 | Lat: 38.4597488 | Lng: -121.4002999\n3) - 1510 Silverstone Pl, San Jose, CA 95122 | guideNumber: ECM39J7C355 | cajas: [\"18x18x27\",\"16x16x16\",\"14x14x14 Gratis\"] | type: pickup | phone_sender: 876867867867 | address: 1510 Silverstone Pl, San Jose, CA 95122 | pickup_day: 1 | deposit: 30 | cost: 310 | Lat: 37.3438696 | Lng: -121.8239905\n"
	}
}

interface RouteItem {
  order: number;
  address: string;
  lat: number;
  lng: number;
  id_direccion_item: number | null;
}

interface Props {
  routes: RouteItem[];
  formData: any;
  getInit?: any;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  inputs?: any;
  loading?: boolean;
  remote?: any[];
  setInputs?:any;
  cache_json?:any;
}

const CSRRouteImportComponent: React.FC<Props> = ({
  items,
  setInputs,
  routes: initialRoutes,
  formData,
  loading,
  remote = [],
  cache_json
}) => {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  //const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [reorder, setReorder] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<number[]>([]);
  const [sendRoute, setSendRoute] = useState<boolean>(false);
  

  const [prompt, setPrompt]   = useState<string|undefined>("");

  const [manualIa, setManualIa] = useState<string>("");  
  const [processingIa, setProcessingIa] = useState<boolean>(false);

  
  //console.log(formData?.dataset?.route?.assignments)
  useEffect(()=>{
    if(formData?.dataset?.route?.assignments){
      setAssignments(formData?.dataset?.route?.assignments)
    }
  },[formData?.dataset?.route?.assignments])

  const toggleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const resolvedata = (res:any)=>{
    //console.log(res)
    if(!res?.map)return;
    const sanitizedRoutes = res.map((iaItem: any) => {
      const originalData  = remote.find(r => r.guideNumber === iaItem.guideNumber) || {};
        return {
          ...iaItem,
          // MJ o cualquier propiedad minificada suele fallar aquí si iaItem es null
          name: iaItem.name || originalData.name_sender || "Sin nombre",
          phone: iaItem.phone_sender || originalData.phone_sender || "N/A",
          origin_address: iaItem.address || originalData.address || "", // address es lo que devuelve Gemini
          observation: originalData.description || "",
          day: iaItem.pickup_day || originalData.day || 1,
          status: "Agendado",
          type: iaItem.type || originalData.type || "pickup",
          lat: parseFloat(iaItem.lat || 0),
          lng: parseFloat(iaItem.lng || 0),
        };
    })
    setReorder(sanitizedRoutes)
    setRoutes(sanitizedRoutes)
    setInputs((prevFormData:any) => ({
      ...prevFormData,
      cache_json: sanitizedRoutes,
    }));    
  }

  useEffect(() => {
    if (remote?.length) {
      setSelected(remote.map((_: any, idx: number) => idx));
    }
  }, [remote]);


  useEffect(()=>{
    if(cache_json){
      setReorder(cache_json)
      setRoutes(cache_json)
      setInputs((prevFormData:any) => ({
        ...prevFormData,
        cache_json: cache_json,
      }));
    }
  },[cache_json])

  const sendSelectedToBackend = async () => {
      const payload = remote.filter((_: any, idx: number) =>
          selected.includes(idx)
      );

      if (!payload.length) return;
      //return resolvedata(test?.data?.routes)
      setSendRoute(true)

      await formData.handleRequest(
          formData.backend + window.location.pathname + "/import",
          "post",
          { packages: payload }
      ).then((res: any) => {
          setSendRoute(false)

          setPrompt(res?.prompt)
          // Verificamos que la respuesta sea exitosa y contenga las rutas optimizadas
          if (res && res.routes) {
              console.log("Ruta optimizada recibida:", res.routes);
              console.log(res.routes)


              if(res.routes){
                return resolvedata(res.routes)
              }
              // Llenamos el estado con el dataset ordenado que devolvió Gemini
              setReorder(res.routes);
              
              // Opcional: Si necesitas hacer algo más con el prompt usado
              // console.log("Prompt usado:", res.data.prompt_used);
          } else {
              console.warn("La respuesta no tiene el formato esperado:", res);
          }
          
      }).catch((err: any) => {
          console.error("Error al importar y optimizar:", err);
          setSendRoute(false)
      });
  };

  const handleReorder = (updatedRoutes: RouteItem[]) => {
    setRoutes(updatedRoutes);
    if (typeof window === "undefined") return;

    formData.handleRequest(
      formData.backend + window.location.pathname + "/reorder",
      "put",
      { routes: updatedRoutes }
    );
  };

  const submitIaManual = async () => {
    if (!manualIa.trim()) return;

    setProcessingIa(true);

    await formData.handleRequest(
      formData.backend + location.pathname + "/iaManualV2",
      "post",
      { prompt: prompt, manualIa: manualIa }
    );
    //document.location.reload()
    setProcessingIa(false);
    //getInit();
  };


  //console.log(sendRoute)

  if (sendRoute) {
    return (
      <div className="mt-5 flex items-center justify-center w-full">
        <Image
          src="/img/loading3.gif"
          alt="Loading"
          width={300}
          height={400}
          className="w-40 sm:w-56 md:w-72 h-auto"
          priority
        />
      </div>
    );
  }

  


  return (
    <div className="mt-5">

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

      <Card className="shadow-lg border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Importaciones detectadas
          </h3>

          <button
            type="button"
            disabled={!selected.length}
            onClick={sendSelectedToBackend}
            className="px-4 py-2 text-xs font-medium rounded-lg
                       bg-blue-600 text-white hover:bg-blue-700
                       disabled:opacity-40"
          >
            Enviar a ruta ({selected.length})
          </button>
        </div>

        <div className="space-y-4">
          {remote.map((row: any, idx: number) => {
            const guides      = row.guide_items?.split(",") ?? [];
            const itemsDetail = row.sender_location?.items ?? [];
            const result      =  pickup_day.find((s:any)=>{return s.value===row?.delivery_day||s.value===row?.pickup_day}) 
            const rel         =  assignments.find((s:any)=>{return s.guide===row?.guideNumber})??null
            //console.log(row?.output_address) 
            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 bg-white transition space-y-4
                  ${selected.includes(idx) ? "border-blue-500 ring-1 ring-blue-200" : ""}
                `}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(idx)||(rel?true:false)}
                      onChange={() => toggleSelect(idx)}
                      className="mt-1"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        
                        {
                          row?.company_name?<Fragment>
                            { row?.company_name } -  {row.name_sender}
                          </Fragment>:<Fragment>
                            {row.name_sender} - {row?.sender_location?.name_sender}
                          </Fragment>
                        }
                        
                      </p>
                      <p className="text-xs text-gray-500">
                        📞 {row.phone_sender}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        📍 {row.address || row?.output_address}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-700 uppercase">
                    {row?.delivery_day?"Llevar Caja":"Recoger Caja"}
                  </span>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500"> {row?.delivery_day?"Llevar el":"Recoger el"} día</p>
                    <p className="font-semibold"> { result?.label ?? "—"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Ítems</p>
                    <p className="font-semibold">{itemsDetail.length}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Costo</p>
                    <p className="font-semibold">
                      ${row.cost || row.sender_location?.cost || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Depósito</p>
                    <p className="font-semibold">
                      ${row.deposit || row.sender_location?.deposit || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Ciudad</p>
                    <p className="font-semibold">
                      {row.sender_location?.sender_city ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Contenido */}

                {
                  !row?.delivery_day&&itemsDetail?.length>0&&(
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contenido</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        {itemsDetail.map((it: any, i: number) => (
                          <div
                            key={i}
                            className="border rounded-lg p-2 bg-gray-50"
                          >
                            <p className="font-semibold">{it.size}</p>
                            <p>Costo: ${it.cost}</p>
                            <p>Precio: ${it.price}</p>
                            <p>Seguro: ${it.insurance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                

                {/* Guías */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Guías</p>
                  <div className="flex flex-wrap gap-2">
                    {guides.map((g: string, i: number) => (
                      <span
                        key={i}
                        className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-8 grid h-full md:grid-cols-2 gap-8">
        {
          /*
            <ItemsListColumn
              items={items}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              handleDelete={(idx) =>
                setItems((prev) => prev.filter((_, i) => i !== idx))
              }
              setItems={setItems}
            />  
          */
        }
        

        {!loading && reorder.length > 0 && (
          <RouteListColumn
            id={formData.id}
            routes={reorder}
            items={items}
            openGoogleMaps={() => {}}
            getBorderColor={() => ""}
            onReorder={handleReorder}
          />
        )}

        {!loading && routes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mapa de la Ruta
            </h2>
            <RouteMap routes={routes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRRouteImportComponent;
