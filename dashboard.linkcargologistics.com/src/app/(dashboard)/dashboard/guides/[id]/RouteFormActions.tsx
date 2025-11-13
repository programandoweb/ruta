"use client";

import Link from "next/link";
import { MdDownload } from "react-icons/md";

const RouteFormActions = () => (
  <div className="flex justify-between items-center mt-6">
    <Link
      href="/img/route_items_example.xlsx"
      download="route_items_example.xlsx"
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
    >
      <MdDownload className="text-lg" />
      Descargar Formato Modelo
    </Link>
  </div>
);

export default RouteFormActions;
