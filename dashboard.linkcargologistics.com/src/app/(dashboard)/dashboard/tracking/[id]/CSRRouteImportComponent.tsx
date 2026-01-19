"use client";

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Proyecto: Ivoolve - Sistema de Rutas
 * ---------------------------------------------------
 */

import { useMemo, useState } from "react";
import Card from "@/components/card";
import CSRRouteTable from "./CSRRouteTable";
import CSRRouteCardsMobile from "./CSRRouteCardsMobile";

const CSRRouteTableComponent = ({
  items,
  setItems,
  routes,
  formData,
  inputs: data,
  getInit,
}: any) => {
  const itemsById = useMemo(
    () => new Map(items.map((item: any) => [item.phone, item])),
    [items]
  );

  const [inputs, setInputs] = useState<any>(null);

  const openGoogleMapsAndNotify = async (route: any) => {
    if (!route?.address) return;
    const encoded = encodeURIComponent(route.address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank"
    );
  };

  const handleAccept = (address: string, itemId: number, row: any) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/${itemId}/set-status-address-by-items`,
        "post",
        { direction: address, status: "accept", route_items: itemId, row }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
        getInit?.();
      });
  };

  const handleReject = (address: string, itemId: number, row: any) => {
    formData
      .handleRequest(
        `${formData.backend}/dashboard/routes/${itemId}/set-status-address-by-items`,
        "post",
        { direction: address, status: "reject", route_items: itemId, row }
      )
      .then((res: any) => {
        if (res.items) setItems(res.items);
        getInit?.();
      });
  };

  if (!routes.length) {
    return (
      <Card className="mt-6 p-6 text-center text-gray-500">
        No hay datos de la ruta para mostrar.
      </Card>
    );
  }

  return (
    <div className="mt-6">

      {/* 📱 MOBILE */}
      <div className="block lg:hidden">
        <CSRRouteCardsMobile
          routes={routes}
          itemsById={itemsById}
          data={data}
          setInputs={setInputs}
          handleAccept={handleAccept}
          handleReject={handleReject}
          openGoogleMapsAndNotify={openGoogleMapsAndNotify}
        />
      </div>

      {/* 🖥️ DESKTOP */}
      <div className="hidden lg:block">
        <CSRRouteTable
          routes={routes}
          itemsById={itemsById}
          data={data}
          setInputs={setInputs}
          handleAccept={handleAccept}
          handleReject={handleReject}
          openGoogleMapsAndNotify={openGoogleMapsAndNotify}
        />
      </div>

    </div>
  );
};

export default CSRRouteTableComponent;
