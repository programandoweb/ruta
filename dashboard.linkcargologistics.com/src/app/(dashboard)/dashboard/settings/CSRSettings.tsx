'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import UploadWithImage from '@/components/buttom/UploadWithImage';
import useFormData from '@/hooks/useFormDataNew';
import useSessionReady from '@/hooks/useSessionReady';

const prefixed = 'account';

const ComponentAccount: React.FC = () => {
  const [inputs, setInputs] = useState<any>({
    name: '',
    location: '',
    contact_phone: '',
    category_id: null,
    description: '',
    image: '',
    id: null,
  });

  const [services, setServices] = useState<any[]>([]);
  const [qrUrl, setQrUrl] = useState<string>('');

  // Hook personalizado para estado de la sesión
  const sessionReady = useSessionReady(inputs.id);

  const router = useRouter();
  const formData = useFormData(false, false, false);

  // Inicializar datos del formulario
  useEffect(() => {
    const getInit = async () => {
      const res = await formData.handleRequest(
        `${formData.backend}/dashboard/account/basic`
      );
      if (res?.[prefixed]) {
        setInputs(res[prefixed]);
      }
      if (res?.services) {
        setServices(res.services);
        return;
      }
      const stored = localStorage.getItem('services');
      if (stored) {
        const list = JSON.parse(stored);
        setServices(
          list.sort((a: any, b: any) =>
            a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
          )
        );
      }
    };

    getInit();
  }, []);

  // Refrescar QR cada 3 segundos usando Bearer Token
  useEffect(() => {
    if (!inputs.id) return;
    const token = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;
    const base = (process.env.NEXT_PUBLIC_WHATSAPP_URL || '').replace(/\/+$/, '');

    const fetchQr = async () => {
      try {
        const response = await fetch(
          `${base}/api/${inputs.id}/qr?ts=${Date.now()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const blob = await response.blob();
          setQrUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Error fetching QR:', error);
      }
    };

    fetchQr();
    const interval = setInterval(fetchQr, 3000);
    return () => clearInterval(interval);
  }, [inputs.id]);

  // Enviar datos del formulario
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...inputs };
    delete (payload as any).gallery;
    formData
      .handleRequest(
        `${formData.backend}/dashboard/account/basic`,
        inputs.id ? 'put' : 'post',
        payload
      )
      .then((res: any) => {
        if (res?.[prefixed]?.id) {
          router.replace('/dashboard');
        }
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4 gap-4">
              <InputField
                required
                prefixed={prefixed}
                name="name"
                variant="autenticación"
                extra="mb-0"
                label="Nombre"
                placeholder="Nombre"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />

              <InputField
                required
                prefixed={prefixed}
                name="description"
                variant="autenticación"
                extra="mb-0"
                label="Descripción"
                placeholder="Descripción"
                id="description"
                type="text"
                defaultValue={inputs.description}
                setInputs={setInputs}
              />

              <SelectField
                required
                prefixed={prefixed}
                name="category_id"
                variant="autenticación"
                extra="mb-0"
                label="Categoría"
                defaultValue={inputs.category_id}
                options={services}
                setInputs={setInputs}
              />

              <InputField
                required
                prefixed={prefixed}
                name="contact_phone"
                variant="autenticación"
                extra="mb-0"
                label="Contacto"
                placeholder="Teléfono de contacto"
                id="contact_phone"
                type="text"
                defaultValue={inputs.contact_phone}
                setInputs={setInputs}
              />

              <InputField
                required
                prefixed={prefixed}
                name="location"
                variant="autenticación"
                extra="mb-0"
                label="Ubicación"
                placeholder="Ubicación"
                id="location"
                type="text"
                defaultValue={inputs.location}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-5">
          <Card className="mt-2">
            <div className="p-4">
              <h3 className="text-base font-semibold mb-4">Foto de perfil</h3>
              <UploadWithImage
                name="image"
                label="Subir imagen de perfil"
                setFormData={setInputs}
                preview
                inputs={inputs}
              />
            </div>
          </Card>

          <Card className="mt-2">
            <div className="p-4 text-center">
              {inputs.id && sessionReady && (
                <div className="text-green-700 mb-2">Sesión activa</div>
              )}
              {inputs.id && !sessionReady && (
                qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="WhatsApp QR"
                    className="mx-auto h-64 w-64"
                  />
                ) : (
                  <p className="text-gray-500">QR no disponible</p>
                )
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ComponentAccount;
