"use client";

import { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaMapMarkedAlt } from "react-icons/fa";

interface RouteItem {
  order: number;
  address: string;
  lat: number;
  lng: number;
  id_direccion_item: number | null;
}

interface Props {
  routes: RouteItem[];
  items: any[];
  openGoogleMaps: (lat: number, lng: number) => void;
  getBorderColor: (status: string) => string;
  onReorder: (updatedRoutes: RouteItem[]) => void;
}

const RouteListColumn: React.FC<Props> = ({
  routes,
  items,
  openGoogleMaps,
  getBorderColor,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localRoutes, setLocalRoutes] = useState<RouteItem[]>(routes);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
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
    onReorder(localRoutes); // 👈 avisamos al padre
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Ruta a seguir</h2>
      {localRoutes.length > 0 ? (
        <div className="space-y-4">
          {localRoutes.map((route, idx) => {
            const relatedItem = items.find((item) => item.id === route.id_direccion_item);
            const status = relatedItem?.status || "Borrador";

            return (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                className={`p-4 rounded-lg shadow-md border-l-4 ${getBorderColor(
                  status
                )} bg-white cursor-move`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-600">
                    #{route.order}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white bg-gray-500 px-2 py-1 rounded-full">
                    {status}
                  </span>
                </div>
                <p className="text-base text-gray-800 font-medium">{route.address}</p>
                <div className="text-xs">Lat:{route.lat} Lng {route.lng}</div>

                <div className="mt-4 flex justify-end items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openGoogleMaps(route.lat, route.lng)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FaMapMarkedAlt size={20} />
                  </button>

                  {relatedItem && relatedItem.status === "Borrador" ? (
                    <>
                      <button className="text-green-500 hover:text-green-700 transition-colors">
                        <FaThumbsUp size={20} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaThumbsDown size={20} />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay una ruta generada para mostrar.</p>
      )}
    </div>
  );
};

export default RouteListColumn;
