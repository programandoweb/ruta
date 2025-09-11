'use client';
import { useState } from "react";
import api from "@/lib/axios";

interface Props {
  onRouteGenerated: (data: any) => void;
}

export default function FileUpload({ onRouteGenerated }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await api.post("/api/suggest-route", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onRouteGenerated(data);
    } catch (e) {
      alert("Error al procesar la ruta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Procesando..." : "Optimizar"}
      </button>
    </div>
  );
}
