import React, { useEffect, useState } from 'react';
import { MdFileUpload, MdDelete } from 'react-icons/md';
import useAsyncStorage from "@/hooks/useAsyncStorage";
import Image from "next/image";

interface UploadImageProps {
    label: string;
    id?: number;
    repository?: string;
    getInit?:any
}

const maxSize = 5 * 1024 * 1024; // Máximo tamaño del archivo en bytes

const UploadImage: React.FC<UploadImageProps> = ({ label, id, repository ,getInit }) => {
    const storage = useAsyncStorage();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewImageUrl(null);
        setUploadError(null); // Clear any previous upload errors
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return; // Handle no file selected

        if (file.size > maxSize) {
            return setUploadError("El archivo es demasiado grande. Por favor, selecciona un archivo más pequeño (máximo " + maxSize / 1000 + " Kb).");
        }

        const [expectedWidth, expectedHeight] = label.split('x').map(Number);

        const image = new window.Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const { width, height } = image;
            console.log(`Image dimensions: ${width}x${height}`);

            if (width !== expectedWidth || height !== expectedHeight) {
                setUploadError(`Las dimensiones de la imagen deben ser exactamente ${expectedWidth}x${expectedHeight} píxeles.`);
                return;
            }

            setSelectedFile(file);
            setPreviewImageUrl(image.src);            

        };
    };

    useEffect(() => {
        if (selectedFile) {
            handleSubmit();
        }
    }, [selectedFile]);

    const handleSubmit = async () => {
        if (!selectedFile) return; // Handle no file selected case
    
        const user = await storage.getData("user");
    
        if (!user) {
            setUploadError("No estás autorizado a subir archivos");
            return;
        }
    
        setIsLoading(true);
        setUploadError(null);
    
        try {
            const formData = new FormData();
            formData.append('doc', selectedFile); // Append the selected file to the form data
    
            // Enviar solo los props que no son undefined
            const dataToSend:any = { label, id, repository }; // Agregar los props que quieras enviar
    
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] !== undefined) {
                    formData.append(key, dataToSend[key]);
                }
            });
    
            let BACKEND = window.location.protocol + "//" + window.location.hostname + (window.location.port ? "/api/v1" : "/api/v1");
            if (window.location.hostname === "localhost") {
                BACKEND = BACKEND.replace("localhost", "localhost:" + process.env.NEXT_PUBLIC_PORT);
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
            console.log("Upload successful:", responseData);
            if(getInit){
                getInit()
            }            
    
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Upload failed. Please try again.');
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            {
                !previewImageUrl && (
                    <div className='flex items-center justify-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 relative'>
                        <label>{label}</label>
                        <input type="file" accept="image/*" className='absolute w-full opacity-0' onChange={handleFileUpload} />
                    </div>
                )
            }
            {
                previewImageUrl && (
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", right: 5, cursor: "pointer" }} onClick={handleReset}>
                            <MdDelete />
                        </div>
                        <Image src={previewImageUrl} alt="Selected File Preview" className="mt-4 w-full object-cover rounded-lg" width={200} height={200} layout="responsive" />
                    </div>
                )
            }
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}            
        </div>
    );
};

export default UploadImage;
