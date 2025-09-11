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

const prefixed = 'category';

const CSRProductCategories: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

  const [inputs, setInputs] = useState<any>({
    name: '',
  });

  useEffect(() => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((res: any) => {
        if (res?.[prefixed]) setInputs(res[prefixed]);
      });
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then(() => {
        router.replace('/dashboard/categories');
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
            <div className="grid grid-cols-1 gap-4">
              <InputField
                required
                prefixed={prefixed}
                name="name"
                label="Nombre de la categoría de producto"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default CSRProductCategories;
