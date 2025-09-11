'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import { useRouter } from 'next/navigation';

// Define a constant for the prefix used with form data
const prefixed = 'provider'; // Cambiado de 'supplier' a 'user' para reflejar mejor los datos

// Define the customer groups options
const customerGroupsDefault = [
  { name: 'General', value: '1' },
  { name: 'Distributor', value: '2' },
  { name: 'Reseller', value: '3' },
];

// Define the React component (functional component)
const UserFormComponent: React.FC = () => {
  const [customerGroups, setCustomerGroups]       =   useState<any[]>([...customerGroupsDefault]); //
  // Use useState hook to manage form inputs state
  
  const [inputs, setInputs] = useState<any>({
    
  });
  

  const router = useRouter();

  // Initialize the useFormData hook
  const formData = useFormData(false, false, false);

  // Fetch initial data if necessary
  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((response: any) => {
        if (response && response[prefixed]) {
          // Update form inputs with fetched data if it exists under the prefix
          setInputs(response[prefixed]);         
        }
        if (response && response.roles) {
          setCustomerGroups(response.roles)         
        }        
      });
  };

  // Use useEffect hook to call getInit function on component mount
  useEffect(getInit, []);

  // Define a function to handle form submission
  const onSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Send data using the useFormData hook
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then((response: any) => {
        // Navigate to another page after successful form submission
        router.replace('/dashboard/providers');
        if (response && response[prefixed] ) {
         
        }
      });
  };

  /*
  // Function to handle input changes
  const handleInputChange = (name: string, value: any) => {
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [name]: value,
    }));
  };
  */

  // Return the JSX for the component
  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save /> {/* Button component with back and save functionality */}
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
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

              {/* Company Name */}
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

              {/* Email */}
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

              {/* Company Name */}
              <InputField
                
                prefixed={prefixed}
                name="password"
                variant="autenticación"
                extra="mb-0"
                label="Password"
                placeholder="password"
                id="password"
                type="password"
                setInputs={setInputs}
              />

              {/* Phone Number */}
              <InputField
                required={true}
                prefixed={prefixed}
                name="phone_number"
                variant="autenticación"
                extra="mb-0"
                label="Número de Teléfono"
                placeholder="Número de Teléfono"
                id="phone_number"
                type="text"
                defaultValue={inputs.phone_number}
                setInputs={setInputs}
              />

              {/* Address */}
              <InputField
                required={true}
                prefixed={prefixed}
                name="address"
                variant="autenticación"
                extra="mb-0"
                label="Dirección"
                placeholder="Dirección"
                id="address"
                type="text"
                defaultValue={inputs.address}
                setInputs={setInputs}
              />
            </div>
          </div>
          {
            /*
              Implementar tabla
            */            
          }
        </Card>
      </div>
    </form>
  );
};

export default UserFormComponent;
