"use client";

import { useState } from "react";
import Card from "@/components/card";
import RouteMap from "@/components/RouteMap/RouteMap";
import RouteListColumn from "./RouteListColumn";
import ItemsListColumn from "./ItemsListColumn";

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
}

const CSRRouteImportComponent: React.FC<Props> = ({
  items,
  setItems,
  routes: initialRoutes,
  formData,
  loading,
  remote = [],
}) => {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleExpand = (idx: number) => {
    setExpandedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const sendSelectedToBackend = async () => {
    const payload = remote.filter((_: any, idx: number) =>
      selected.includes(idx)
    );

    if (!payload.length) return;

    await formData.handleRequest(
      formData.backend + window.location.pathname + "/import",
      "post",
      { packages: payload }
    );
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

  return (
    <div className="mt-5">
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
            const guides = row.guide_items?.split(",") ?? [];
            const itemsDetail = row.sender_location?.items ?? [];

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
                      checked={selected.includes(idx)}
                      onChange={() => toggleSelect(idx)}
                      className="mt-1"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {row.name_sender}
                      </p>
                      <p className="text-xs text-gray-500">
                        📞 {row.phone_sender}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        📍 {row.address}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-700 uppercase">
                    {row.type}
                  </span>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-500">Pickup día</p>
                    <p className="font-semibold">{row.day ?? "—"}</p>
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

      <div className="mt-8 grid h-full md:grid-cols-3 gap-8">
        <ItemsListColumn
          items={items}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          handleDelete={(idx) =>
            setItems((prev) => prev.filter((_, i) => i !== idx))
          }
          setItems={setItems}
        />

        {!loading && routes.length > 0 && (
          <RouteListColumn
            id={formData.id}
            routes={routes}
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
