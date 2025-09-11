'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Autocomplete from '@/components/fields/Autocomplete';


const prefixed = 'campaign';

const statusOptions = [
  { name: 'Borrador', value: 'draft' },
  { name: 'Programada', value: 'scheduled' },
  { name: 'Enviando', value: 'sending' },
  { name: 'Enviada', value: 'sent' },
  { name: 'Cancelada', value: 'cancelled' }
];

const CampaignFormComponent: React.FC = () => {
  const [staff, setStaff]     =   useState<any>([]);
  const [templates, settemplates] = useState<any>([])
  const [tags, settags]           = useState<any>([])
  const [inputs, setInputs] = useState<any>({
    user_id: '',
    name: '',
    message: '',
    media_url: '',
    type: 'text',
    status: 'draft',
    scheduled_at: '',
    segment_id: '',
    statistics: ''
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
        if(response.templates){
          settemplates(response.templates)
        }
        if(response.tags){
          settags(response.tags)
        }
        if(response.staff){
          setStaff(response.staff)
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
        router.replace('/dashboard/campaigns/history');
      });
  };

  const handleDispatch=()=>{

  }

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <InputField
                required
                prefixed={prefixed}
                name="name"
                label="Nombre de Campaña"
                placeholder="Nombre"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />

              {
                /**
                <SelectField
                id="status"
                name="status"
                placeholder="Estado"
                label="Estado"
                required
                defaultValue={inputs.status}
                setInputs={setInputs}
                options={statusOptions}
                variant="autenticación"
                extra="mb-0"
              />

              <InputField
                prefixed={prefixed}
                name="scheduled_at"
                label="Fecha Programada"
                placeholder="2025-05-20 12:00"
                id="scheduled_at"
                type="datetime-local"
                defaultValue={inputs.scheduled_at}
                setInputs={setInputs}
              />   
                 */
              }
              
              <Autocomplete
                id="template_id"
                name="template_id"
                variant="autenticación"
                extra="mb-0"
                label={"Plantilla ID"}
                placeholder={"Plantilla ID"}
                defaultValue={inputs?.template_id}
                setInputs={setInputs}
                multiSelection={true}
                options={templates}
                handleDispatch={handleDispatch}
              />

              <Autocomplete
                id="tags"
                name="tags"
                variant="autenticación"
                extra="mb-0"
                label={"Etiquetas"}
                placeholder={"Etiquetas ID"}
                defaultValue={inputs?.tags}
                setInputs={setInputs}
                multiSelection={true}
                options={tags}
                handleDispatch={handleDispatch}
              />

              {
                staff.length>0&&(
                  <SelectField
                    prefixed={prefixed}
                    name="user_id"
                    variant="autenticación"
                    extra="mb-0"
                    label="Tour"
                    placeholder="Tour"
                    id="user_id"
                    defaultValue={inputs.user_id}
                    setInputs={setInputs}
                    options={staff}
                  />
                )
              }     
              
              {
                inputs.id&&(<Link href={"/dashboard/campaigns/send/"+inputs.id} className='bgflex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center'>
                  Enviar Campaña
                </Link>)
              }
              
              
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default CampaignFormComponent;
