"use client";

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import UploadWithImage from '@/components/buttom/UploadGalleries';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const prefixed = 'service';

const ServiceFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  const [inputs, setInputs] = useState<any>({
    name: '',
    description: '',
    price: '',
    location: '',
    image: '',
    gallery: [],
    category_id: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (e) { console.error('Parse user error:', e); }
    }
  }, []);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((res: any) => {
        if (res?.[prefixed]) setInputs(res[prefixed]);
        if (res?.services) setServices(res.services);
      });
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then(() => {
        router.replace('/dashboard/services');
      });
  };

  const handleGalleryUpload = (url: string) => {
    setInputs((prev: any) => {
      const arr = typeof prev.gallery === 'string'
        ? JSON.parse(prev.gallery || '[]')
        : prev.gallery || [];
      return { ...prev, gallery: JSON.stringify([...arr, url]) };
    });
  };

  const handleGalleryRemove = (i: number) => {
    setInputs((prev: any) => {
      const arr = typeof prev.gallery === 'string'
        ? JSON.parse(prev.gallery || '[]')
        : prev.gallery || [];
      return {
        ...prev,
        gallery: JSON.stringify(arr.filter((_: any, idx: number) => idx !== i)),
      };
    });
  };

  const handleSetMainImage = (url: string) => {
    setInputs((prev: any) => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <InputField
                required
                prefixed={prefixed}
                name="name"
                label="Nombre del servicio"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />
              <SelectField
                prefixed={prefixed}
                name="category_id"
                label="Categoría"
                id="category_id"
                defaultValue={inputs.category_id}
                setInputs={setInputs}
                options={services}
                variant="autenticación"
                extra="mb-0"
              />
              <InputField
                prefixed={prefixed}
                name="location"
                label="Ubicación"
                id="location"
                type="text"
                defaultValue={inputs.location}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="image"
                label="Imagen destacada (URL)"
                id="image"
                type="text"
                defaultValue={inputs.image}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="price"
                label="Precio"
                id="price"
                type="number"
                defaultValue={inputs.price}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="description"
                label="Descripción"
                id="description"
                type="text"
                defaultValue={inputs.description}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="mt-2">
            <div className="p-4">
              <h3 className="text-base font-semibold mb-4">Galería de imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                {(() => {
                  try {
                    const arr = typeof inputs.gallery === 'string'
                      ? JSON.parse(inputs.gallery || '[]')
                      : inputs.gallery || [];
                    return arr.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-square border rounded overflow-hidden group cursor-pointer"
                        onClick={() => handleSetMainImage(url)}
                        title="Establecer como imagen destacada"
                      >
                        <img
                          src={url}
                          alt={`gallery-${idx}`}
                          className={`w-full h-full object-cover ${
                            inputs.image === url ? 'ring-4 ring-blue-500' : ''
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGalleryRemove(idx);
                          }}
                          title="Eliminar imagen"
                        >
                          ✕
                        </button>
                      </div>
                    ));
                  } catch {
                    return null;
                  }
                })()}
              </div>

              <UploadWithImage
                name="temp_image"
                label="Subir imagen"
                handleGalleryUpload={handleGalleryUpload}
                preview={false}
                inputs={inputs}
              />
            </div>
          </Card>
          <Card className="mt-2">
            <div className="p-4">
              <h3 className="text-base font-semibold mb-4">Foto o Mapa del sitio</h3>
              <InputField
                prefixed={prefixed}
                name="map"
                label="Importado de Google Map"
                id="map"
                type="text"
                defaultValue={inputs.map}
                setInputs={setInputs}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ServiceFormComponent;
