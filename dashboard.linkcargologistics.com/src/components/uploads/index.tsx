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

const Upload: React.FC<UploadProps> = ({ title, allowedFileTypes, onUpload, name, defaultValue }) => {
  const storage                               =   useAsyncStorage()
  const [selectedFile, setSelectedFile]       =   useState<File | null>(null);
  const [isLoading, setIsLoading]             =   useState(false);
  const [uploadError, setUploadError]         =   useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] =   useState<string | null>(null);


  const handleReset = () => {
    setSelectedFile(null);
    setPreviewImageUrl(null);
    setUploadError(null); // Clear any previous upload errors
  };
  

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

    setSelectedFile(file);

    // Check if the file is an image and create a preview URL
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImageUrl(e.target?.result?.toString() || '');
      reader.readAsDataURL(file);
    } else {
      setPreviewImageUrl(null);
    }
  };

  const handleSubmit  =   async () => {
    if (!selectedFile) return; // Handle no file selected case

    const user        =   await  storage.getData("user");

    if(!user){
      setUploadError("No estás autoriza a subir archivos");
      return;
    }

    setIsLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('doc' || name, selectedFile); // Use provided name or default to 'file'

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

      const response = await fetch(BACKEND + "/multimedia/upload", {
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
      setSelectedFile(null);
      setIsLoading(false);
      setPreviewImageUrl(null);
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
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
      <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
        <button style={{position:"relative"}} className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0">
          <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
          <h4 className="text-xl font-bold text-brand-500 dark:text-white">
            {title || "Upload Files"}
          </h4>  
          {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}        
          <input
              style={{cursor:"pointer", position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:0}}
              type="file"
              onChange={handleFileUpload}
              accept={allowedFileTypes ? allowedFileTypes.join(',') : undefined}            
          />

        </button>                
        
      </div>

      <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pl-3 pb-4 dark:!bg-navy-800">
        {
          defaultValue&&(
            <Image src={defaultValue} alt="Selected File Preview" className="mt-4 w-full object-cover rounded-lg" width={200} height={200} />            
          )
        }
        {previewImageUrl && (
          <div style={{position:"relative"}}>
            <div style={{position:"absolute", right:5, cursor:"pointer"}} onClick={handleReset}>
              <MdDelete />
            </div>
            <Image src={previewImageUrl} alt="Selected File Preview" className="mt-4 w-full object-cover rounded-lg" width={200} height={200} />            
          </div>
        )}
        <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
          Importante
        </h5>
        <p className="leading-1 mt-2 text-base font-normal text-gray-600">
          Sólo es permitido archivos {allowedFileTypes ? `${allowedFileTypes.join(' image/ ').replaceAll("image/","")}` : "PNG, JPG and GIF files are allowed"}
        </p>
        <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={`linear mt-4 flex items-center justify-center rounded-xl px-2 py-2 text-base font-medium text-white transition duration-200 ${
                selectedFile ? 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700' : 'bg-gray-400 cursor-not-allowed'
            } dark:bg-brand-400 dark:text-white ${
                selectedFile ? 'dark:hover:bg-brand-300 dark:active:bg-brand-200' : ''
            }`}
        >
            {!selectedFile?"Selecciona un archivo":"Subir el archivo"}
        </button>

      </div>
    </Card>
  );
};

export default Upload;
