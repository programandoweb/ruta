'use client';

import { useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import useFormData from '@/hooks/useFormDataNew';
import { useRouter } from 'next/navigation';


export default function QrScannerComponentBackup() {
  const [data, setData] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<any>(null);  
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
        setQrValue(url+response.qr);
        //router.replace(`/dashboard/asistence-register/`+response.qr);
      }

    } catch (error) {
      console.error('❌ Error obteniendo QR:', error);
    }
  };

  // 🔹 Llamado inicial + intervalos
  useEffect(() => {
    getInit();

    const interval = setInterval(() => {
      getInit();
    }, 30000); // cada 15 segundos

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if(data){
      console.log(data)
      router.replace(data);
    }
  }, [data]);

  //console.log(qrValue)

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-xl font-bold mb-4">Escanear código QR</h2>

      <div className="w-full max-w-sm h-72 rounded-xl overflow-hidden">
        <Scanner
          onScan={(result) => {
            if (result?.[0]?.rawValue) {
              setData(result[0].rawValue);
            }
          }}
          onError={(error) => console.error(error)}
          constraints={{ facingMode: 'environment' }}
        />
      </div>


      <div className="mt-4 text-center text-sm">
        {data ? (
          <span className="text-green-600 font-semibold">{data}</span>
        ) : (
          'Esperando lectura...'
        )}
      </div>      
      {
        /*
        qrValue&&(
          <div>
            <Link target='_blank' 
                  className="bg-brand-500 text-white w-full p-3 rounded-xl font-semibold hover:bg-brand-600 transition flex items-center justify-center gap-2 mt-10" 
                  href={qrValue}
                  onClick={getInit}
            >
              Registrar Asistencia
            </Link>
          </div>
        )
        */
      }      

    </div>
  );
}
