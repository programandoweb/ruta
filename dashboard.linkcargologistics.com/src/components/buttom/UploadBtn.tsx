import * as React from 'react';
import { useState } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';


interface UploadBtnProps {
  send_to_endpoint?:any;
  preview?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  name: string;
  defaultValue?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  format?: string; // Formato opcional
}

export enum BannerFormatEnum {
  SQUARE = '1:1',
  WIDESCREEN = '16:9',
}

export const getBannerFormats = (): string[] => {
  return Object.values(BannerFormatEnum);
};


const validateImageFormat = (file: File, format?: any): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!format) {
      resolve(true); // Si no hay formato, permitir subir la imagen
      return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);
    
    image.onload = () => {
      const { width, height } = image;
      const isValid =
        (format === BannerFormatEnum.SQUARE && width === height) ||
        (format === BannerFormatEnum.WIDESCREEN && width / height === 16 / 9);

      if (!isValid) {
        alert(`La imagen no cumple con el formato ${format}.`);
        resolve(false);
      } else {
        resolve(true);
      }
    };

    image.onerror = () => resolve(false); // En caso de error al cargar la imagen
  });
};

const UploadBtn: React.FC<UploadBtnProps> = ({
  className,
  label,
  name,
  defaultValue,
  setFormData,
  preview,
  send_to_endpoint,
  format
}) => {
  const storage = useAsyncStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError(`El archivo es demasiado grande. Por favor, selecciona un archivo más pequeño (máximo ${maxSize / 1024} KB).`);
      return;
    }

    setIsLoading(true);
    setUploadError(null);

    try {

      if (format) {      
        const isValid = await validateImageFormat(file, format);
        if (!isValid) return; // Si no cumple el formato, detener la ejecución
      }

      const user      =   await storage.getData("user");
      const formData  = new FormData();
      formData.append("doc", file);
      formData.append("skipWatermark", "1");

      if(send_to_endpoint){

      }

      let BACKEND = "";
      if (window && window.location && window.location.hostname && window.location.port) {
        BACKEND = `${window.location.protocol}//${window.location.hostname}${window.location.port ? "/api/v1" : "/api/v1"}`;
      } else {
        BACKEND = `${window.location.protocol}//${window.location.hostname}/api/v1`;
      }

      if (window.location.hostname === "localhost") {
        BACKEND = BACKEND.replace("localhost", `localhost:${process.env.NEXT_PUBLIC_PORT}`);
      }

      if(process.env.NEXT_PUBLIC_BACKEND_URL){
        BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL+process.env.NEXT_PUBLIC_VERSION;
      }

      
      const response  =   await fetch(BACKEND + (user ? "/multimedia/upload" : "/multimedia/upload-open"), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const responseData = await response.json();
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: responseData?.data?.doc?.slug || "Error",
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading)return <div>Cargando imagen</div>

  return (
    <div className={`flex-col items-center ${className || ''}`}>
      <div className='text-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 relative'>
        <input
          style={{ cursor: "pointer", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0 }}
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          onChange={handleUpload}
        />
        {label}
      </div>
      {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
      {defaultValue && preview && (
        <img src={defaultValue} alt={label} className="mt-2 w-full h-auto" />
      )}
    </div>
  );
};

export default UploadBtn;
