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
import UploadBtn from '@/components/buttom/UploadBtn';
import Image from 'next/image';

const prefixed          =   'template';
const send_to_endpoint  =   {};

const TemplateFormComponent: React.FC = () => {
  const [inputs, setInputs] = useState<any>({
    name: '',
    content: '',
    type: 'text',
    is_active: true,
    id: null,
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
      .then(() => {
        router.replace('/dashboard/templates/list');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                required={true}
                prefixed={prefixed}
                name="name"
                variant="autenticación"
                extra="mb-0"
                label="Nombre"
                placeholder="Nombre del template"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />

              <InputField
                required={true}
                prefixed={prefixed}
                name="content"
                variant="autenticación"
                extra="mb-0"
                label="Contenido"
                placeholder="Contenido del mensaje"
                id="content"
                type="text"
                defaultValue={inputs.content}
                setInputs={setInputs}
              />              
              <div>
                {
                  inputs.image&&(
                    <div className='overflow-hidden mb-2'>
                      <Image
                        src={inputs.image}
                        alt=""
                        width={400}
                        height={400}
                        className="rounded-4xl object-cover w-full"
                      />
                    </div>
                  )
                }
                
                <UploadBtn
                  send_to_endpoint={send_to_endpoint} 
                  preview={false} 
                  className="mb-1 mr-1 w-full" size="large" label="Crear Imagen principal" 
                  name="image" 
                  setFormData={setInputs}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default TemplateFormComponent;