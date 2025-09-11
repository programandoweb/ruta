'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import { useRouter } from 'next/navigation';

const prefixed = 'notification';

const NotificationAgendaForm: React.FC = () => {
  const [inputs, setInputs] = useState<any>({});
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
        { scheduled_at: inputs.scheduled_at, schedule:inputs?.id }
      )
      .then((response: any) => {
        router.replace('/dashboard/notifications');
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
              <div>
                <label className="text-xs font-medium">Remitente</label>
                <div className="text-sm">
                  {inputs.from_user?.name || '-'} <br />
                  <span className="text-xs text-gray-500">{inputs.from_user?.email}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Destinatario</label>
                <div className="text-sm">
                  {inputs.to_user?.name || '-'} <br />
                  <span className="text-xs text-gray-500">{inputs.to_user?.email}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Estado</label>
                <div
                  className={`text-sm font-semibold ${
                    inputs.status === 'no leido' ? 'text-yellow-500' : 'text-green-600'
                  }`}
                >
                  {inputs.status}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Concepto</label>
                <div className="text-sm">{inputs.concepto}</div>
              </div>
              <div>
                <label className="text-xs font-medium">Tipo</label>
                <div className="text-sm">{inputs.tipo}</div>
              </div>
              <div className="">
                <label className="text-xs font-medium">Descripción</label>
                <div className="text-sm">{inputs.descripcion}</div>
              </div>

              {/* Campo editable */}
              <InputField
                disabled={ inputs.status === 'leido'}
                required
                name="scheduled_at"
                id="scheduled_at"
                label="Fecha de la Agenda"
                placeholder="YYYY-MM-DD HH:mm"
                type="datetime-local"
                variant="autenticación"
                extra="mb-0"
                defaultValue={inputs.scheduled_at}
                setInputs={setInputs}
                prefixed={prefixed}
              />
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default NotificationAgendaForm;
