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
const prefixed = 'employee';

// Opciones por defecto de grupos de cliente
const customerGroupsDefault:any = [];

const UserFormComponent: React.FC = () => {
  const [customerGroups, setCustomerGroups] = useState<any[]>(customerGroupsDefault);
  const [user, setUser] = useState<any>({});
  const [inputs, setInputs] = useState<any>({
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error leyendo el usuario desde localStorage:", error);
      }
    };

    fetchUser();
  }, []);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          const employeeData = response[prefixed];

          // Extraer rol actual del empleado
          const currentRole = employeeData.roles && employeeData.roles.length > 0
            ? employeeData.roles[0].name
            : '';

          // Construir objeto inputs con solo las claves definidas en UserInputs
          setInputs({
            customer_group_id: employeeData.customer_group_id || '',
            name: employeeData.name || '',
            company_name: employeeData.company_name || '',
            email: employeeData.email || '',
            phone_number: employeeData.phone_number || '',
            identification_number: employeeData.identification_number || '',
            identification_type: employeeData.identification_type || '',
            password: '', // por seguridad, nunca se debe precargar el password
            id: employeeData.id || null,
            role: currentRole,
          });
        }

        if (response && response.roles) {
          setCustomerGroups(response.roles.map((r: any) => ({
            label: r.name,
            value: r.name,
          })));
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


  //console.log(user.role)

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
                    {
                      ( user.role==='admin'||
                        user.role==='super-admin'||
                        user.role==='providers')&&(
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
                      )
                    }
                    
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
    </Fragment>    
  );
};

export default UserFormComponent;
