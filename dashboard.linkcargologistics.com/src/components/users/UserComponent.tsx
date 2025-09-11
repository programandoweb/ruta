'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice';
import useFormData from '@/hooks/useFormDataNew';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';

const prefixed = 'user';

interface UserComponentProps {
  roles: { label: string; value: string }[];
  business_id: number;
  company_name: string;
  setUsers?: any;
}

const UserComponent: React.FC<UserComponentProps> = ({
  roles,
  business_id,
  company_name,
  setUsers: setUsersMain
}) => {
  const dispatch = useDispatch();
  const formData = useFormData(false, false, false);
  const [users, setUsers] = useState<any>([]);
  const [inputs, setInputs] = useState<any>({
    customer_group_id: '',
    name: 'Usuario de Prueba',
    company_name: company_name,
    image: '',
    cover: '',
    email: 'usuario.prueba@example.com',
    password: 'password123',
    role: roles[0]?.value ?? '',
    identification_number: '123456789',
    identification_type: 'cedula_ciudadania',
    phone_number: '3001234567',
    tax_no: 'N/A',
    address: 'Calle Falsa 123',
    city: 'Bogotá',
    state: 'Cundinamarca',
    postal_code: '110111',
    country: 'CO',
    business_id: business_id,
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(formData.backend + '/dashboard/users', 'post', { ...inputs })
      .then((response: any) => {
        if (response?.users) {
          setUsersMain(response.users);

          // Cierra el drawer al finalizar
          dispatch(
            setOpenDrawer({
              direction: 'right',
              open: false,
            })
          );
        }
      });
  };

  useEffect(() => {
    setInputs({
      customer_group_id: '',
      name: 'Usuario de Prueba',
      company_name: company_name,
      image: '',
      cover: '',
      email: 'usuario.prueba@example.com',
      password: 'password123',
      role: roles[0]?.value ?? '',
      identification_number: '123456789',
      identification_type: 'cedula_ciudadania',
      phone_number: '3001234567',
      tax_no: 'N/A',
      address: 'Calle Falsa 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postal_code: '110111',
      country: 'CO',
      business_id: business_id,
    });
  }, [company_name]);

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4 pr-16 md:pr-8">
        <BtnBack save />
      </div>
      <Card className="mt-2">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-1">
          <div className="md:col-span-2">
            <InputField required prefixed={prefixed} name="name" label="Nombre" id="name" type="text" defaultValue={inputs.name} setInputs={setInputs} />
          </div>
          <div className="md:col-span-2">
            <InputField required prefixed={prefixed} name="email" label="Email" id="email" type="email" defaultValue={inputs.email} setInputs={setInputs} />
          </div>
          <div className="md:col-span-2">
            <InputField required prefixed={prefixed} name="password" label="Contraseña" id="password" type="password" setInputs={setInputs} />
          </div>
          <SelectField
            id="role"
            name="role"
            label="Rol"
            defaultValue={inputs.role}
            setInputs={setInputs}
            options={roles}
          />
          <InputField prefixed={prefixed} name="phone_number" label="Teléfono" id="phone_number" type="text" defaultValue={inputs.phone_number} setInputs={setInputs} />
        </div>
      </Card>      
    </form>
  );
};

export default UserComponent;
