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

import { useState } from "react";

interface Props {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  route_id:any;
}

const ExcelUploadForm: React.FC<Props> = ({ setItems, route_id }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token || null;

      const form = new FormData();
      form.append("file", file);
      form.append("route_id", route_id);
      
      //console.log(route_id)

      let BACKEND = "";
      if (window && window.location && window.location.hostname) {
        BACKEND = `${window.location.protocol}//${window.location.hostname}`;
        if (window.location.port) {
          BACKEND += `:${process.env.NEXT_PUBLIC_PORT}`;
        }
        BACKEND += process.env.NEXT_PUBLIC_VERSION || "/api/v1";
      }

      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        BACKEND =
          process.env.NEXT_PUBLIC_BACKEND_URL + process.env.NEXT_PUBLIC_VERSION;
      }

      const response = await fetch(BACKEND + "/routes/import-excel", {
        method: "POST",
        body: form,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      const responseData = await response.json();

      if (responseData?.data?.items_imported) {
        //document.location.reload();
        //setItems(responseData.data.items);
      }
    } catch (err) {
      console.error("Error al subir archivo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Subiendo..." : "Subir y Procesar 2"}
      </button>
    </div>
  );
};

export default ExcelUploadForm;
