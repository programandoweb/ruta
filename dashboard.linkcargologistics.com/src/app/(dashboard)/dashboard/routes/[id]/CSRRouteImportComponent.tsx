"use client";

import { useState } from "react";
import Card from "@/components/card";
import RouteMap from "@/components/RouteMap/RouteMap";
import RouteListColumn from "./RouteListColumn";
import ItemsListColumn from "./ItemsListColumn";
import ExcelUploadForm from "./ExcelUploadForm";

interface RouteItem {
  order: number;
  address: string;
  lat: number;
  lng: number;
  id_direccion_item: number | null;
}

interface Props {
  routes: RouteItem[];
  formData: any; // viene del padre
  getInit?: any;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  inputs?:any;
  loading?:any
}

const CSRRouteImportComponent: React.FC<Props> = ({
  items,
  setItems,
  routes: initialRoutes,
  formData,
  inputs,
  loading
}) => {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  const toggleExpand = (idx: number) => {
    setExpandedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "Agendado":
        return "border-blue-500";
      case "En proceso":
        return "border-yellow-500";
      case "Rechazado":
      case "Cancelado":
        return "border-red-500";
      case "Borrador":
      default:
        return "border-gray-300";
    }
  };

  // 🔹 recibe rutas reordenadas desde RouteListColumn
  const handleReorder = (updatedRoutes: RouteItem[]) => {
    setRoutes(updatedRoutes);

    // 👇 Aquí haces el submit al backend
    formData
      .handleRequest(
        formData.backend + location.pathname + "/reorder", // ruta backend (ej: /dashboard/routes/{id}/reorder)
        "put",
        { routes: updatedRoutes } // enviamos la nueva lista
      )
      .then((res: any) => {
        console.log("Orden actualizado en backend:", res);
        // refrescamos la data si quieres
        //if (typeof getInit === "function") getInit();
      });
  };

  return (
    <div className="mt-5">
      <Card className="shadow-lg border border-gray-100 p-4" >
      {/* Componente separado para carga de Excel */}
      <ExcelUploadForm setItems={setItems} route_id={inputs?.id}/>
      </Card>

      <div className="mt-8 grid h-full md:grid-cols-3 gap-8">
        
        {/* Columna de Listado de Items */}
        <ItemsListColumn
          items={items}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          handleDelete={(idx) => setItems((prev) => prev.filter((_, i) => i !== idx))}
          setItems={setItems}
        />

        {/* Columna de Ruta a Seguir */}
        {
          !loading&&routes.length>0&&(
            <RouteListColumn
              id={formData.id}
              routes={routes}
              items={items}
              openGoogleMaps={openGoogleMaps}
              getBorderColor={getBorderColor}
              onReorder={handleReorder} // 👈 callback
            />
          )
        }
        
        {/* Mapa */}
        {
          !loading&&routes.length>0&&(
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mapa de la Ruta</h2>
              <RouteMap routes={routes} />
            </div>
          )
        }        
        
      </div>
    </div>
  );
};

export default CSRRouteImportComponent;
