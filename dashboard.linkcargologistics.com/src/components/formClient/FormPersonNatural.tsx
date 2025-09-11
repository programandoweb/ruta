import { useState, useEffect } from 'react';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';
import Button from '../buttom/Generic';
import useFormData from '@/hooks/useFormDataNew';
import { useDispatch, useSelector } from "react-redux";
import { setTable } from '@/store/Slices/tableSlice';

let apirest:any;
let handleRequest:any;
let backend:any;

const FormPersonNatural = (props:any) => {
  const dispatch:any  =   useDispatch();
  const { table }     =   useSelector((select:any)=>select);
  const [formData, setFormData] = useState({
    name: '',
    identification_type: '',
    identification_number: '',
    email: '',
    phone_number: '',
    waiter_id:null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(true);

  apirest       =   useFormData(false, false, false);
  handleRequest =   apirest.handleRequest;
  backend       =   apirest.backend;
 
  const handleSubmit = (e:any) => {
    e.preventDefault();
    handleRequest(backend + location.pathname+"/cash-register/updateIdentification", "put", { ...formData, order_id:props.table.order.id }).then((response:any)=>{
      if(response){
        dispatch(setTable(response.table))                    
      }
    });
  };

  const identification_types = [
    { value: 'cedula_ciudadania', label: 'Cédula de ciudadanía' },
    { value: 'cedula_extrajeria', label: 'Cédula de extranjería' },
    { value: 'nit', label: 'NIT' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'otro', label: 'Otro' },
  ];

  const handleSearch = async () => {
    if (formData.identification_number) {
      setIsLoading(true);
      setShowSearchButton(false);

      try {
        const response = await handleRequest(backend + location.pathname+"/cash-register/searchIdentification", "post", { ...formData });
        if (response&&response.client) {
          setFormData(response.client);
        }
      } catch (error) {
        console.error('Error checking identification:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
            <div>
              <InputField
                  id="identification_number"
                  name="identification_number"
                  label="Número de identificación"                
                  type="text"
                  placeholder="Ingrese su número de identificación"
                  setInputs={setFormData}
                  defaultValue={formData.identification_number}
                  required
              />
              {showSearchButton && (
                <div className='mt-2'>
                  <Button label="Buscar" onClick={handleSearch} />
                </div>
              )}
              {!showSearchButton && (
                <div className='mt-2'>
                  <Button label="Buscar otro documento" onClick={()=>{setShowSearchButton(true)}} />
                </div>
              )}
            </div>
            {isLoading && <p>Verificando identificación...</p>}
            {exists && <p>Esta identificación ya existe en el sistema.</p>}
            {
               formData.identification_number && !isLoading && !exists && !showSearchButton && (
                <>
                    <SelectField
                        id="waiter_id"
                        name="waiter_id"
                        placeholder="Mesero Asignado"
                        label="Mesero Asignado"
                        defaultValue={formData.waiter_id||table?.order?.waiter_id}
                        setInputs={setFormData}
                        options={props.waiter}                
                        variant="autenticación"
                        extra="mb-0"                
                    />
                    <SelectField
                        id="identification_type"
                        name="identification_type"
                        placeholder="Tipo de documento"
                        label="Tipo de documento"
                        defaultValue={formData.identification_type}
                        setInputs={setFormData}
                        options={identification_types}                
                        variant="autenticación"
                        extra="mb-0"                
                    />
                    <InputField
                        label="Nombre completo"
                        name="name"
                        type="text"
                        placeholder="Ingrese su nombre completo"
                        setInputs={setFormData}
                        defaultValue={formData.name}
                        required
                    />
                    <InputField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        setInputs={setFormData}
                        defaultValue={formData.email}
                        required
                    />
                    <InputField
                        label="Teléfono"
                        name="phone_number"
                        type="tel"
                        placeholder="Ingrese su número de teléfono"
                        setInputs={setFormData}
                        defaultValue={formData.phone_number}
                    />
                </>
               )
            }            
        </div>
        <div className="flex justify-end mt-4">            
          <Button label="Cambiar" onClick={()=>(props.onClick?props.onClick(null):false)}/>
          <Button label="Guardar" type='submit' />
        </div>
      </form>
    </div>
  );
};

export default FormPersonNatural;