import * as React from "react";
import { useState } from "react";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import Link from "next/link";
import { MdFileUpload } from "react-icons/md";

interface UploadBtnProps {
  send_to_endpoint?: any;
  preview?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  label: string;
  name: string;
  defaultValue?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  inputs?: any;
  disabled?:boolean;
  fileName?:string;
}

const UploadWithImage: React.FC<UploadBtnProps> = ({
  className,
  label,
  name,
  defaultValue,
  setFormData,
  preview,
  inputs,
  disabled,
  fileName
}) => {
  
  const storage = useAsyncStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError(
        `El archivo es demasiado grande. Por favor, selecciona un archivo más pequeño (máximo ${maxSize / 1024} KB).`
      );
      return;
    }

    setIsLoading(true);
    setUploadError(null);

    try {
      const user = await storage.getData("user");
      const formData = new FormData();
      formData.append("doc", file);
      if(fileName){
        formData.append("fileName", fileName);
      }

      let BACKEND = "";
      if (window && window.location && window.location.hostname && window.location.port) {
        BACKEND = `${window.location.protocol}//${window.location.hostname}${window.location.port ? "/api/v1" : "/api/v1"}`;
      } else {
        BACKEND = `${window.location.protocol}//${window.location.hostname}/api/v1`;
      }

      if (window.location.hostname === "localhost") {
        BACKEND = BACKEND.replace(
          "localhost",
          `localhost:${process.env.NEXT_PUBLIC_PORT}`
        );
      }

      if(process.env.NEXT_PUBLIC_BACKEND_URL){
        BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL+process.env.NEXT_PUBLIC_VERSION;
      }

      
      const response = await fetch(
        BACKEND + (user ? "/multimedia/upload" : "/multimedia/upload-open"),
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const responseData = await response.json();
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: responseData?.data?.doc?.slug || "Error",
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Subiendo archivo...</div>;

  return (
    <div className={`relative ${className || ""}`}>
      <div className="relative h-80 max-h-80 overflow-hidden">
        {inputs && inputs.image && inputs.image !== "" && (
          <Link href={inputs.image} target="_blank">
            <img
              src={inputs.image}
              className="object-cover w-auto h-full"
              alt={label}
            />
          </Link>
        )}
        {
          defaultValue && preview && (
          <img
            src={defaultValue}
            alt={label}
            className="w-auto h-full object-cover"
          />
        )}

        {
          !disabled&&(
            <div
              className="absolute bottom-2 right-2 bg-brand-500 text-white p-2 rounded-full cursor-pointer hover:bg-brand-600 transition"
            >
              <label className="cursor-pointer">
                <MdFileUpload size={24} />
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleUpload}
                />
              </label>
            </div>
          )
        }
        
      </div>
      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}
    </div>
  );
};

export default UploadWithImage;
