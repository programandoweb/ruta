/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';

interface UploadedImage {
  id: number;
  name: string;
  description: string;
  tags: string;
  slug: string;
  fecha: string;
  group: string;
}

interface GalleryContentProps {
  prefixed: string;
  dataset?: any;
  id: number | null | undefined;
  setInputs?: (value: any) => void;
  limit?: number;
  dimensionLimit?: string;
  disabled?: boolean;
  fileName?:string;
}

const GalleryContent: React.FC<GalleryContentProps> = ({
  prefixed,
  dataset = [],
  id,
  setInputs,
  limit,
  dimensionLimit,
  disabled,
  fileName
}) => {
  const storage = useAsyncStorage();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([...dataset]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseDimensions = (dimensionStr: string) => {
    const [width, height] = dimensionStr.split('x').map(Number);
    return { width, height };
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };

      img.onload = () => {
        if (dimensionLimit) {
          const { width, height } = parseDimensions(dimensionLimit);
          if (img.width !== width || img.height !== height) {
            reject(`Image dimensions must be exactly ${width}x${height}`);
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      };

      img.onerror = () => reject('Error reading image file');
      reader.onerror = () => reject('Error reading file');

      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (limit && uploadedImages.length + files.length > limit) {
      setError(`You can only upload up to ${limit} files.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploaded: UploadedImage[] = [];
      const user = await storage.getData('user');

      for (let file of Array.from(files)) {
        try {
          await validateImageDimensions(file);
        } catch (dimensionError) {
          setError(dimensionError as string);
          continue;
        }

        const formData = new FormData();
        formData.append('doc', file);
        formData.append('id', id ? String(id) : '');
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
          BACKEND = BACKEND.replace("localhost", `localhost:${process.env.NEXT_PUBLIC_PORT}`);
        }

        if(process.env.NEXT_PUBLIC_BACKEND_URL){
          BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL+process.env.NEXT_PUBLIC_VERSION;
        }
  
        
        const response = await fetch(
          `${BACKEND}${user ? '/multimedia/upload' : '/multimedia/upload-open'}`,
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed for file: ' + file.name);
        }

        const responseData = await response.json();
        const doc = responseData.data.doc;

        uploaded.push({
          id: doc.id,
          name: doc.name,
          description: doc.description,
          tags: doc.tags,
          slug: doc.slug,
          fecha: doc.fecha,
          group: doc.group,
        });
      }

      setUploadedImages((prevImages) => [...prevImages, ...uploaded]);
    } catch (err) {
      console.error(err);
      setError('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (imageId: number) => {
    setUploadedImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
  };

  const handleSyncWithParent = () => {
    if (setInputs) {
      setInputs((prevFormData: any) => ({
        ...prevFormData,
        [prefixed]: uploadedImages,
      }));
    }
  };

  useEffect(() => {
    handleSyncWithParent();
  }, [uploadedImages]);

  const isLimitReached = limit && uploadedImages.length >= limit;

  return (
    <div className="gallery-content">
      {!disabled && (
        <div className="upload-section">
          <label
            className={`cursor-pointer px-5 py-2 rounded-md ${
              isLimitReached
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLimitReached ? 'Limit Reached' : 'Select Images'}
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={isLimitReached || false}
            />
          </label>
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}

      <div className="gallery mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {uploadedImages.map((image) => (
          <div key={image.id} className="image-item relative">
            <img
              src={image.slug}
              alt={image.name}
              className="w-full h-auto rounded-md shadow-md"
            />
            <p className="text-sm text-gray-500 mt-2">{image.description}</p>
            {!disabled && (
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleRemove(image.id)}
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryContent;
