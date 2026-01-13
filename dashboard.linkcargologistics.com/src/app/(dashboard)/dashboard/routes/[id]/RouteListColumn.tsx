"use client";

import useFormData from "@/hooks/useFormDataNew";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaMapMarkedAlt, FaSave } from "react-icons/fa";

interface RouteItem {
  order: number;
  address: string;
  lat: number;
  lng: number;
  id_direccion_item: number | null;
}

interface GuideItem {
  value: string;
  lat: number;
  lng: number;
}

interface Props {
  id: string;
  routes: RouteItem[];
  items: any[];
  openGoogleMaps: (lat: number, lng: number) => void;
  getBorderColor: (status: string) => string;
  onReorder: (updatedRoutes: RouteItem[]) => void;
}

const RouteListColumn: React.FC<Props> = ({
  id,
  routes,
  items,
  openGoogleMaps,
  getBorderColor,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localRoutes, setLocalRoutes] = useState<RouteItem[]>(routes);
  const [guides, setGuides] = useState<Record<number, GuideItem>>({});

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const formData = useFormData(false, false, false, true);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...localRoutes];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedIndex(index);
    setLocalRoutes(updated);
  };

  const handleDrop = () => {
    setDraggedIndex(null);
    onReorder(localRoutes);
  };

  // 🔹 Guarda en state por índice
  const handleSendGuideRemote = (
    value: string,
    lat: number,
    lng: number,
    index: number
  ) => {
    setGuides((prev) => ({
      ...prev,
      [index]: { value, lat, lng },
    }));
  };

  // 🔹 Enviar al backend (ejemplo)
  const handleSendGuide = () => {
    console.log("Guides a enviar:", guides);
    formData
      .handleRequest(
        formData.backend + location.pathname + "/setGuideRemote", // ruta backend (ej: /dashboard/routes/{id}/reorder)
        "put",
        guides
      )
      .then((res: any) => {
        console.log("Orden actualizado en backend:", res);        
      });    
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Ruta a seguir</h2>
        <button
          type="button"
          onClick={handleSendGuide}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaSave /> Guardar guías
        </button>
      </div>

      {localRoutes.length > 0 ? (
        <div className="space-y-4">
          {localRoutes.map((route, idx) => {
            const relatedItem = items.find(
              (item) => item.id === route.id_direccion_item
            );
            const status      =   relatedItem?.status || "Borrador";
            const remoteGuide =   items.find((s:any)=>{return s.lat===route.lat&&s.lng===route.lng})
            //console.log(remoteGuide?.guide_remote)
            return (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                className={`rounded-xl border-l-4 ${getBorderColor(
                  status
                )} bg-white p-4 shadow-md cursor-move`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    #{route.order}
                  </span>
                  <span className="rounded-full bg-gray-500 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    {status}
                  </span>
                </div>

                <p className="font-medium text-gray-800">{route.address}</p>

                <div className="mt-1 text-xs text-gray-500">
                  Lat: {route.lat} · Lng: {route.lng}
                </div>

                <input
                  type="text"
                  placeholder="Guía remota (ej: Casa azul, portón negro)"
                  value={guides[idx]?.value   || remoteGuide?.guide_remote || ""}
                  className="
                    mt-3 w-full rounded-lg border border-gray-300
                    px-3 py-2 text-sm
                    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  onChange={(e) =>
                    handleSendGuideRemote(
                      e.target.value,
                      route.lat,
                      route.lng,
                      idx
                    )
                  }
                />

                <div className="mt-4 flex justify-end items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openGoogleMaps(route.lat, route.lng)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaMapMarkedAlt size={20} />
                  </button>

                  {relatedItem && relatedItem.status === "Borrador" && (
                    <>
                      <button className="text-green-500 hover:text-green-700">
                        <FaThumbsUp size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaThumbsDown size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="italic text-gray-500">
          No hay una ruta generada para mostrar.
        </p>
      )}
    </div>
  );
};

export default RouteListColumn;
