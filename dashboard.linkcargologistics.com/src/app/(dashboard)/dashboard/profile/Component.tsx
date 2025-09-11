'use client'
// Import necessary components and hooks
import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import { useRouter } from 'next/navigation';


// Define a constant for the prefix used with form data
const prefixed = 'user';

// Declare variables outside the component function (not recommended for modern React)
let getInit: () => void;
let formData: any;
let router: any;
const categories: { name: string; value: string }[] = [
  { name: "Bebidas", value: "Bebidas" },
  { name: "Carnes", value: "Carnes" },
  { name: "Verduras", value: "Verduras" },
  { name: "Pescados", value: "Pescados" },
  { name: "Lácteos", value: "Lácteos" },
  { name: "Panadería", value: "Panadería" },
  { name: "Frutas", value: "Frutas" },
  { name: "Especias", value: "Especias" },
  { name: "Licores", value: "Licores" },
  { name: "Embutidos", value: "Embutidos" },
];

// Define the React component (functional component)
const ComponentSupplier: React.FC = (props: any) => {
  // Use useState hook to manage form inputs state
  const [rawMaterialsData, setRawMaterialsData] = useState<any>();
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    id: null,    
  });

  router = useRouter();

  // Initialize the useFormData hook (likely used for fetching and handling form data)
  formData = useFormData(false, false, false);

  // Define a function to fetch initial data (assuming getInit is called on component mount)
  getInit = () => {
    formData.handleRequest(formData.backend + location.pathname).then((response: any) => {
      if (response && response[prefixed]) {
        // Update form inputs with fetched data if it exists under the 'supplier' prefix
        setInputs(response[prefixed]);
      }
      if (response && response.raw_materials) {
        setRawMaterialsData(response.raw_materials)
      }
    });
  };

  // Use useEffect hook to call getInit function on component mount (empty dependency array [])
  useEffect(getInit, []);

  // Define a function to handle form submission
  const onSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Likely sends data using the useFormData hook and performs actions based on the response
    formData.handleRequest(formData.backend + location.pathname, (inputs.id) ? "put" : "post", { ...inputs }).then((response: any) => {
      if (response && response[prefixed] && response[prefixed].id) {
        // Navigate to another page after successful form submission
        router.replace("/dashboard/store/suppliers"); 
      }      
    });
  };

  const handleDispatch=(name:any,value:any)=>{
    setInputs((prevFormData:any) => ({
      ...prevFormData,
      [name]: value,
    })); 
  }  

  // Return the JSX for the component
  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save /> {/* Button component with back and save functionality */}
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4 gap-4">
              <InputField
                required={true}
                prefixed={prefixed}
                name="name"
                variant="autenticación"
                extra="mb-0"
                label={'Nombre'}
                placeholder={'Nombre'}
                id="name"
                type="text"
                defaultValue={inputs?.name}
                setInputs={setInputs}
              />
              <InputField
                id="email"
                name="email"
                required={true}
                prefixed={prefixed}
                variant="autenticación"
                extra="mb-0"
                label={'Email'}
                placeholder={'Email'}                
                type="text"
                defaultValue={inputs?.email}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default ComponentSupplier;
