'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import useFormData from '@/hooks/useFormDataNew';

export default function ProductionOrderScanner() {
    const [data, setData] = useState<string | null>(null); // Almacena el valor escaneado
    const [cameraError, setCameraError] = useState<string | null>(null); // Error al acceder a la cámara
    const formData  = useFormData(false, false, false);
    // Función para manejar el escaneo
    const handleScan = (result: any) => {
        if (result?.[0]?.rawValue) {
            setData(result[0].rawValue); // Guarda el valor escaneado
            //const url = `${window.location.origin}/dashboard/asistence-register/`;
        }
    };

  // Función para manejar errores de la cámara
  const handleError = (error: any) => {
    console.error(error);
    setCameraError('No se pudo acceder a la cámara. Verifique permisos.');
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-xl font-bold mb-4">Escanear Orden de Producción</h2>

      {/* Si hay un error en la cámara */}
      {cameraError && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-center font-semibold">
          {cameraError}
        </div>
      )}

      {/* Área de escaneo */}
      <div className="w-full max-w-sm h-72 rounded-xl overflow-hidden border border-gray-200">
        <Scanner
          onScan={handleScan} // Maneja el resultado del escaneo
          onError={handleError} // Maneja errores de la cámara
          constraints={{ facingMode: 'environment' }} // Usa la cámara trasera
        />
      </div>

      {/* Muestra el dato escaneado */}
      <div className="mt-4 text-center text-sm">
        {data ? (
          <span className="text-green-600 font-semibold">Código de Orden: {data}</span>
        ) : (
          !cameraError && 'Esperando lectura...'
        )}
      </div>
    </div>
  );
}
