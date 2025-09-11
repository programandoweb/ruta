/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Usuarios
 * ---------------------------------------------------
 */

'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { Fragment, useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import { useRouter } from 'next/navigation';
import SelectField from '@/components/fields/SelectField';
import { UserInputs } from '@/data/interface';
import AddProperty from '@/components/PropertyOverview/AddProperty';
import AddParking from '@/components/PropertyOverview/AddParking';
import AddVehicle from '@/components/PropertyOverview/AddVehicle';

const prefixed = 'user';

// Opciones por defecto de grupos de cliente
const customerGroupsDefault:any = [];

const UserFormComponent: React.FC = () => {
  const [customerGroups, setCustomerGroups] = useState<any[]>(customerGroupsDefault);
  
  const [inputs, setInputs] = useState<UserInputs>({
    customer_group_id: '',
    name: '',
    company_name: '',
    email: '',
    phone_number: '',
    identification_number: '',
    identification_type: '',
    password: 'password',
    id: null,
    role: '',
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
        if (response && response.roles) {
          setCustomerGroups(response.roles);
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
        router.back();
      });
  };

  return (
    <Fragment>
      <Fragment>
        <form onSubmit={onSubmit} className='block'>
          <div className="h-12 mb-4">
            <BtnBack back save />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
            <Card className="mt-2">              
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SelectField
                      id="role"
                      name="role"
                      placeholder="Rol"
                      label="Rol"
                      required={true}
                      defaultValue={inputs.role}
                      setInputs={setInputs}
                      options={customerGroups}
                      variant="autenticación"
                      extra="mb-0"
                    />
                    <InputField
                      required={true}
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
                      required={true}
                      prefixed={prefixed}
                      name="company_name"
                      variant="autenticación"
                      extra="mb-0"
                      label="Apellidos"
                      placeholder="Apellidos"
                      id="company_name"
                      type="text"
                      defaultValue={inputs.company_name}
                      setInputs={setInputs}
                    />

                    <InputField
                      required={true}
                      prefixed={prefixed}
                      name="email"
                      variant="autenticación"
                      extra="mb-0"
                      label="Email"
                      placeholder="Email"
                      id="email"
                      type="email"
                      defaultValue={inputs.email}
                      setInputs={setInputs}
                    />

                    <InputField
                      prefixed={prefixed}
                      name="password"
                      variant="autenticación"
                      extra="mb-0"
                      label="Password"
                      placeholder="Password"
                      id="password"
                      type="password"
                      setInputs={setInputs}
                    />

                    <InputField
                      prefixed={prefixed}
                      name="phone_number"
                      variant="autenticación"
                      extra="mb-0"
                      label="Teléfono"
                      placeholder="Número de Teléfono"
                      id="phone_number"
                      type="text"
                      defaultValue={inputs.phone_number}
                      setInputs={setInputs}
                    />

                    <InputField
                      prefixed={prefixed}
                      name="identification_number"
                      variant="autenticación"
                      extra="mb-0"
                      label="Número de Identificación"
                      placeholder="Número de Identificación"
                      id="identification_number"
                      type="text"
                      defaultValue={inputs.identification_number}
                      setInputs={setInputs}
                    />
                  </div>
                </div>            
            </Card>
          </div>
        </form>
      </Fragment>
      {
        inputs.id&&(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <AddProperty user_id={inputs.id||0}/>          
            <AddParking user_id={inputs.id||0}/>          
            <AddVehicle user_id={inputs.id||0}/>          
          </div>
        )
      }
      
      
    </Fragment>    
  );
};

export default UserFormComponent;
