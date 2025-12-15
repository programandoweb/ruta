'use client';

import { useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import useFormData from '@/hooks/useFormDataNew';
import { useRouter } from 'next/navigation';

export default function QRScannerComponent() {
  const [data, setData] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const formData = useFormData(false, false, false);
  const router = useRouter();

  const getInit = async () => {
    const url = `${window.location.origin}/dashboard/asistence-register/`;
    try {
      const response = await formData.handleRequest(
        `${formData.backend}/attendance/get-qr-test`,
        'get'
      );
      if (response?.qr) {
        setQrValue(url + response.qr);
      }
    } catch (error) {
      console.error('❌ Error obteniendo QR:', error);
    }
  };

  useEffect(() => {
    getInit();
    const interval = setInterval(() => getInit(), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      router.replace(data);
    }
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-xl font-bold mb-4">Escanear código QR</h2>

      {/* 🔹 Si la cámara falla */}
      {cameraError && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-center font-semibold">
          {cameraError}
        </div>
      )}

      <div className="w-full max-w-sm h-72 rounded-xl overflow-hidden border border-gray-200">
        {!cameraError && (
          <Scanner
            onScan={(result) => {
              if (result?.[0]?.rawValue) {
                setData(result[0].rawValue);
              }
            }}
            onError={(error) => {
              router.replace(`/attendancesManual`);
              console.error(error);
              setCameraError('No se pudo acceder a la cámara. Verifique permisos.');
            }}
            constraints={{ facingMode: 'environment' }}
          />
        )}
      </div>

      <div className="mt-4 text-center text-sm">
        {data ? (
          <span className="text-green-600 font-semibold">{data}</span>
        ) : (
          !cameraError && 'Esperando lectura...'
        )}
      </div>
    </div>
  );
}
