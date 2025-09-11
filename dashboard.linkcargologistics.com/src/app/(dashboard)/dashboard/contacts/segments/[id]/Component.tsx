'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - WhatsApp Campaigns
 * ---------------------------------------------------
 */

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import { useRouter } from 'next/navigation';

const prefixed = 'segment';

interface SegmentInputs {
  id?: number | null;
  name: string;
  description?: string;
}

const SegmentFormComponent: React.FC = () => {
  const [inputs, setInputs] = useState<SegmentInputs>({
    name: '',
    description: '',
    id: null
  });

  const router = useRouter();
  const formData = useFormData(false, false, false);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          setInputs(response[prefixed]);
        }
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
      .then((response: any) => {
        router.replace('/dashboard/contacts/segments');
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                required={true}
                prefixed={prefixed}
                name="name"
                variant="autenticación"
                extra="mb-0"
                label="Nombre del segmento"
                placeholder="Nombre del segmento"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />

              <InputField
                prefixed={prefixed}
                name="description"
                variant="autenticación"
                extra="mb-0"
                label="Descripción"
                placeholder="Descripción del segmento"
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

export default SegmentFormComponent;