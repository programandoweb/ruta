'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import { useRouter } from 'next/navigation';
import DrawerComponent from '@/components/drawer/index'; // ✅ Importa tu Drawer
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice';
import UserComponent from '@/components/users/UserComponent';

const prefixed = 'business';

const CompanyFormComponent: React.FC = (props: any) => {
  const [user, setUser]   = useState<any>({});
  const [users, setUsers] = useState<any>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [inputs, setInputs] = useState<any>({
    name: '',
    description: '',
    whatsapp_link: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    role: '',
  });

  const router    = useRouter();
  const dispatch  = useDispatch();
  const formData  = useFormData(false, false, false);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          const data = response[prefixed];
          const currentRole = data.roles?.[0]?.name ?? '';
          setInputs({
            ...inputs,
            ...data,
            role: currentRole,
          });
        }

        if (response?.roles) {
          setRoles(response.roles.map((r: any) => ({
            label: r.name,
            value: r.name,
          })));
        }

        if (response?.users	) {
          setUsers(response.users	);
        }
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    getInit();
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then((response: any) => {
        if (props?.params?.id === 'new') {
          router.replace('/dashboard/companies/' + response[prefixed]?.id);
        } else {
          router.replace('/dashboard/companies');
        }
      });
  };

  const openDrawer = () => {
    dispatch(setOpenDrawer({ direction: 'right', open: true }));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="h-12 mb-4 flex justify-between items-center">
          <BtnBack back save />          
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5">
          <Card className="mt-2">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <InputField required prefixed={prefixed} name="name" label="Nombre de la empresa" placeholder="Nombre de la empresa" id="name" type="text" defaultValue={inputs.name} setInputs={setInputs} />
                <div className='md:col-span-2'>
                  <InputField prefixed={prefixed} name="description" label="Descripción" placeholder="Descripción breve" id="description" type="text" defaultValue={inputs.description} setInputs={setInputs} />
                </div>
                <InputField prefixed={prefixed} name="contact_phone" label="Teléfono de contacto" placeholder="Ej: 3200000000" id="contact_phone" type="text" defaultValue={inputs.contact_phone} setInputs={setInputs} />
                <InputField prefixed={prefixed} name="contact_email" label="Correo de contacto" placeholder="correo@ejemplo.com" id="contact_email" type="email" defaultValue={inputs.contact_email} setInputs={setInputs} />
                <InputField prefixed={prefixed} name="whatsapp_link" label="Enlace de WhatsApp" placeholder="https://wa.me/57300..." id="whatsapp_link" type="text" defaultValue={inputs.whatsapp_link} setInputs={setInputs} />
                <InputField prefixed={prefixed} name="location" label="Ubicación" placeholder="Ciudad, País" id="location" type="text" defaultValue={inputs.location} setInputs={setInputs} />
                {
                  inputs.id&&(
                    <div>
                      <button type="button" onClick={openDrawer} className="flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                        Agregar equipo
                      </button>
                    </div>
                  )
                }                 
              </div>
            </div>
          </Card>
        </div>
      </form>
      <div>
        {users.length > 0 && (
        <Card className="mt-2">
          <div className="p-4">    
            <h3 className="text-lg font-semibold mb-4">Usuarios de la empresa</h3>
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Teléfono</th>                  
                </tr>
              </thead>
              <tbody>
                {users.map((u: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{u.name}</td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4">{u.phone_number || '-'}</td>                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>            
        </Card>
      )}
      </div>

      {/* Drawer visible siempre en el DOM, activado por Redux */}
      <DrawerComponent>
        <UserComponent roles={roles} business_id={inputs.id} company_name={inputs.name} setUsers={setUsers}/>
      </DrawerComponent>
    </>
  );
};

export default CompanyFormComponent;
