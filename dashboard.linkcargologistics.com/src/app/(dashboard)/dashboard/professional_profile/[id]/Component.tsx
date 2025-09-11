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
        router.replace('/dashboard/professional_profile');
      });
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
      </div>
    </form>
  );
};

export default ServiceFormComponent;
