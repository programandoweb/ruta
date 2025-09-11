import { MdFileUpload } from "react-icons/md";
import Card from "@/components/card";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import Image from "next/image";

// Interface for Upload component properties
interface UploadProps {
  name?: string; 
  title?: string; 
  allowedFileTypes?: string[]; 
  onUpload?: (name:any,data:any) => void; 
  defaultValue?:string|undefined;
}

let BACKEND   =   "";
const maxSize =   5 * 1024 * 1024; 

const FileButton: React.FC<UploadProps> = ({ title, allowedFileTypes, onUpload, name, defaultValue }) => {
  const storage                               =   useAsyncStorage()
  const [isLoading, setIsLoading]             =   useState(false);
  const [uploadError, setUploadError]         =   useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] =   useState<string | null>(null);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return; // Handle no file selected

    /*
    // Validate file type if allowedFileTypes are provided
    if (allowedFileTypes && !allowedFileTypes?.find(search=>search.includes(file.type.split('/')[1]))) {
      setUploadError(`Sólo se admiten tipo ${allowedFileTypes.join(', ')} .`);
      return;
    }
    */

    if (file.size > maxSize) {
        return setUploadError("El archivo es demasiado grande. Por favor, selecciona un archivo más pequeño (máximo "+maxSize/1000+" Kb).");
    }

    // Check if the file is an image and create a preview URL
    if (file.type.startsWith('image/')) {
      const reader    =   new FileReader();
      //reader.onload   =   (e) => setPreviewImageUrl(e.target?.result?.toString() || '');
      reader.readAsDataURL(file);
      
      handleSubmit(file)
    } else {
      setPreviewImageUrl(null);
    }
  };

  const handleSubmit  =   async (file:any) => {
    if (!file) return; // Handle no file selected case

    const user        =   await  storage.getData("user");

    if(!user){
      //setUploadError("No estás autoriza a subir archivos");      return;
    }

    setIsLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('doc' || name, file); // Use provided name or default to 'file'

      if(window&&window.location&&window.location.hostname&&window.location.port){
        BACKEND     =   window.location.protocol+"//"+window.location.hostname+(window.location.port?"/api/v1":"/api/v1");
      }else{
        BACKEND     =   window.location.protocol+"//"+window.location.hostname+"/api/v1";
      } 
      
      if(window.location.hostname==="localhost"){
        BACKEND=BACKEND.replace("localhost","localhost:"+process.env.NEXT_PUBLIC_PORT)    
      }

      if(process.env.NEXT_PUBLIC_BACKEND_URL){
        BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL+process.env.NEXT_PUBLIC_VERSION;
      }

      const response = await fetch(BACKEND + (user?"/multimedia/upload":"/multimedia/upload-open"), {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${user?.token}` // Include Bearer token in the Authorization header
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const responseData = await response.json(); // Convert response to JSON

      // Handle successful upload
      setIsLoading(false);
      setPreviewImageUrl(responseData?.data?.doc?.slug||"Error");
      if(onUpload){
        onUpload(name , responseData?.data?.doc?.slug);      
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-12">
      <div className="h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-12">
        <button style={{position:"relative"}} className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0">
          <h4 className="text-xl font-bold text-brand-500 dark:text-white">
            { isLoading&&!previewImageUrl?"Cargando archivo...":previewImageUrl&&previewImageUrl!=='Error'?"Archivo en la nube":(title || "Upload Files")}
          </h4>  
          {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}        
          <input
              style={{cursor:"pointer", position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:0}}
              type="file"
              onChange={handleFileUpload}
              accept={allowedFileTypes ? allowedFileTypes.join(',') : undefined}            
          />

          <p className="leading-1 mt-2 text-base font-normal text-gray-600">
            { !previewImageUrl?<div>
                Sólo es permitido archivos {allowedFileTypes ? `${allowedFileTypes.join(' image/ ').replaceAll("image/","")}` : "PNG, JPG and GIF"}
              </div>:previewImageUrl!=='Error'?"Ya su archivo se encuentra en nuestro sistema":""
            }
          </p>
        </button>                        
      </div>      
    </Card>
  );
};

export default FileButton;
