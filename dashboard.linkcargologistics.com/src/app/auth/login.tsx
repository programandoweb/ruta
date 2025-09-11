'use client';

import InputField from '@/components/fields/InputField';
import useFormData from '../../hooks/useFormDataNew';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useInitCatalog } from '@/hooks/useInitCatalog';


// Define types for your hooks' return values and other relevant data structures.
// These are examples; you'll need to adjust them based on your actual hook implementations
// and the shape of your Redux state and stored data.

// Type for the data returned by useFormData
interface FormDataHook {
  handleSubmit: (e: React.FormEvent) => void;
  setInputs: React.Dispatch<React.SetStateAction<any>>; // Adjust 'any' to a more specific type if possible
  inputs: {
    email?: string;
    password?: string;
    setting?: any; // Define a more specific type for 'setting' if known
  };
  dataset: {
    token?: string;
    user?: any; // Define a more specific type for 'user' if known
    parking?: any[]; // Define a more specific type for 'parking' if known
    vehicles?: any[]; // Define a more specific type for 'vehicles' if known
    properties?: any[]; // Define a more specific type for 'properties' if known
  };
}

// Type for the data returned by useAsyncStorage
interface AsyncStorageHook<T> {
  getData: () => Promise<T | null>;
  setData: (data: T) => Promise<void>;
  removeItem: () => Promise<void>;
}

// Type for the Redux state (assuming 'data' is the key in your root reducer)
interface ReduxState {
  data?: {
    values?: any; // Define a more specific type for 'values'
    dataInputs?: any; // Define a more specific type for 'dataInputs'
  };
}

// Type for the 'setting' data stored in AsyncStorage
interface SettingData {
  parking: any[]; // Define a more specific type for 'parking'
  vehicles: any[]; // Define a more specific type for 'vehicles'
  properties: any[]; // Define a more specific type for 'properties'
  timestamp: string;
}

let storage: AsyncStorageHook<any>; // Adjust 'any' to a specific user data type
let setting: AsyncStorageHook<SettingData>;
let reduxResponse:any;
let router:any;



const AuthPageLogin = () => {
  reduxResponse = useSelector((state: ReduxState) => state.data || {});
  router = useRouter();
  const { handleSubmit, setInputs, inputs, dataset }: any = useFormData();

  // Explicitly cast the return type of useAsyncStorage
  storage = useAsyncStorage("user") as any; // Adjust 'any' to a specific user data type
  setting = useAsyncStorage("setting") as any;

  useInitCatalog(); // 🚀 carga catálogo apenas renderiza

  useEffect(() => {
    localStorage.removeItem('user');
    Cookies.remove('token');
  }, []);

  useEffect(() => {
    setting.getData().then((response) => {
      if (!response || !response.timestamp) {
        setInputs((prevFormData: any) => ({
          ...prevFormData,
          setting: false,
        }));
      } else {
        const storedTime = new Date(response.timestamp).getTime();
        const currentTime = new Date().getTime();
        const sixHoursInMilliseconds = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

        if (currentTime - storedTime > sixHoursInMilliseconds) {
          // Han pasado más de 6 horas
          setInputs((prevFormData: any) => ({
            ...prevFormData,
            setting: false,
          }));
        } else {
          // Los datos son válidos (menos de 6 horas)
          setInputs((prevFormData: any) => ({
            ...prevFormData,
            setting: response,
          }));
        }
      }
    });
  }, [setInputs]); // Added setInputs to dependency array

  useEffect(() => {
    //console.log(reduxResponse.values)
    if (reduxResponse.values&&dataset?.token) {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 25); // 25 minutos de expiración
      Cookies.set('token', JSON.stringify({ value: dataset?.token, expires }), { expires: 1 / 288, sameSite: 'None', secure: true, }); // 25 minutos = 1/57.6 de un día
      storage.setData({ ...dataset.user, token: dataset.token });
      router.replace(`/dashboard`);
    } else {
      localStorage.removeItem('user');
      Cookies.remove('token');
    }
  }, [reduxResponse?.values]); // Added dataset, storage, setting to dependency array

  return (
    <form onSubmit={handleSubmit}>
      <div className="sm:mt-0 sm:mb-0 mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        {/* Sección de inicio de sesión */}
        <div className="mt-[3vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px] lg:mt-[10vh]">
          <h4 className="mb-2.5 text-4xl font-bold text-blue-mar-700 dark:text-white">
            Iniciar sesión
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            ¡Ingrese su correo electrónico y contraseña para iniciar sesión!
          </p>

          {/* Correo electrónico */}
          <InputField defaultValue={inputs.email} name="email" variant="autenticación" extra="mb-3" label="Correo electrónico*" placeholder="correo@simple.com" id="email" type="text" setInputs={setInputs} />

          {/* Contraseña */}
          <InputField defaultValue={inputs.password} name="password" variant="autenticación" extra="mb-3" label="Contraseña*" placeholder="Mínimo 8 caracteres" id="password" type="password" setInputs={setInputs} />

          {/* Casilla de verificación */}
          <div className="mb-4 flex items-center justify-between px-2">
            <a className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white" href="">
              ¿Olvidó la contraseña?
            </a>
          </div>

          <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Iniciar sesión
          </button>
        </div>
      </div>
    </form>
  );
}

export default AuthPageLogin;