'use client';

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
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import useFormData from '@/hooks/useFormDataNew';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const InventoryCategoryFormComponent: React.FC<any> = (props) => {
  const formData = useFormData(false, false, false);
  const router = useRouter();

  const [inputs, setInputs] = useState<any>({
    name: '',
  });

  const getInit = () => {
    formData.handleRequest(formData.backend + location.pathname).then((response: any) => {
      if (response?.category) {
        setInputs(response.category);
      }
    });
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(formData.backend + location.pathname, inputs.id ? 'put' : 'post', inputs)
      .then((response: any) => {
        if (props?.params?.id === 'new') {
          router.replace('/dashboard/inventory/categories/' + response?.category?.id);
        } else {
          router.replace('/dashboard/inventory/categories');
        }
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <InputField
                required
                prefixed="inventory_category"
                name="name"
                label="Nombre de la categoría"
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

export default InventoryCategoryFormComponent;
