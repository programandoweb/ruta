import { useState, useEffect } from 'react';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';
import Button from '../buttom/Generic';
import useFormData from '@/hooks/useFormDataNew';
import { useDispatch, useSelector } from "react-redux";
import { setTable } from '@/store/Slices/tableSlice';


let apirest: any;
let handleRequest: any;
let backend: any;

const FormPersonJuridica = (props: any) => {
  const dispatch:any  =   useDispatch();
  const { table }     =   useSelector((select:any)=>select);
  //console.log(props.table.order)

  const [formData, setFormData] = useState({
    name: '',
    identification_number: '',
    identificationType: 'nit', // Default to NIT for legal entities
    email: '',
    phoneNumber: '',
    address: '',
    waiter_id:null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(true);

  apirest = useFormData(false, false, false);
  handleRequest = apirest.handleRequest;
  backend = apirest.backend;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleRequest(backend + location.pathname + "/cash-register/updateIdentification", "put", { ...formData, order_id:props.table.order.id, user_type:"juridica"}).then((response: any) => {
      if(response){
        dispatch(setTable(response.table))                    
      }
    });
  };

  const handleSearch = async () => {
    if (formData.identification_number) {
      setIsLoading(true);
      setShowSearchButton(false);

      try {
        const response = await handleRequest(backend + location.pathname + "/cash-register/searchIdentification", "post", { ...formData, identification_type:"nit" });
        if (response && response.client) {
          setFormData(response.client);
        }
      } catch (error) {
        console.error('Error checking NIT:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
          <div>
            <InputField
              label="NIT"
              id="identification_number"
              name="identification_number"
              type="text"
              placeholder="Ingrese el NIT de la empresa"
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
                <Button label="Buscar otro documento" onClick={() => { setShowSearchButton(true) }} />
              </div>
            )}
          </div>
          {isLoading && <p>Verificando NIT...</p>}
          {exists && <p>Este NIT ya existe en el sistema.</p>}
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
                <InputField
                  label="Nombre de la empresa"
                  name="name"
                  type="text"
                  placeholder="Ingrese el nombre de la empresa"
                  setInputs={setFormData}
                  defaultValue={formData.name}
                  required
                />
                <InputField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="Ingrese el correo electrónico"
                  setInputs={setFormData}
                  defaultValue={formData.email}
                  required
                />
                <InputField
                  label="Teléfono"
                  name="phone_number"
                  type="tel"
                  placeholder="Ingrese el número de teléfono"
                  setInputs={setFormData}
                  defaultValue={formData.phoneNumber}
                />
                <InputField
                  label="Dirección de la empresa"
                  name="address"
                  placeholder="Dirección de la empresa"
                  setInputs={setFormData}
                  defaultValue={formData.address}
                />
              </>
            )
          }
        </div>
        <div className="flex justify-end mt-4">
          <Button label="Cambiar" onClick={() => (props.onClick ? props.onClick(null) : false)} />
          <Button label="Guardar" type='submit' />
        </div>
      </form>
    </div>
  );
};

export default FormPersonJuridica;
