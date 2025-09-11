import { useState } from 'react';
import FormPersonNatural from './FormPersonNatural';
import FormPersonJuridico from './FormPersonJuridico';

interface Props {
    setTable?:any;
    waiter:any;
    table: any; // Consider refining the `any` type to a more specific type
}

type ClientType = 'natural' | 'jurídico' | null;

interface ClientTypeState {
  type: ClientType | null;
  
}

const FormClient = (props: Props) => {
  const [clientType, setClientType] = useState<ClientTypeState>({ type: null });

  const handleClientTypeChange = (newType: ClientType) => {
    setClientType({ type: newType });
  };

  

  if(!props.table.order)return<></>

  return (
    <div>
        <div className="flex">
            {
                clientType.type===null&&(
                    <button onClick={()=>handleClientTypeChange("natural")} className="cursor-pointer flex justify-center items-center mr-2 px-5 rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                        Natural
                    </button>
                )
            }
            {
                clientType.type===null&&(
                    <button onClick={()=>handleClientTypeChange("jurídico")} className="cursor-pointer flex justify-center items-center px-5 rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                        Jurídico
                    </button>
                )
            }
            {
                clientType.type&&(
                    <div className='flex'>Persona <span className='mr-2 ml-2'> <b>{clientType.type}</b> </span></div>
                )
            }            
        </div>
        <div>
            {
                clientType.type==='natural'&&(
                    <FormPersonNatural {...props} onClick={handleClientTypeChange} table={props.table} waiter={props.waiter}/>
                )
            }
            {
                clientType.type==='jurídico'&&(
                    <FormPersonJuridico {...props} onClick={handleClientTypeChange} table={props.table} waiter={props.waiter}/>
                )
            }
        </div>
    </div>
  );
};

export default FormClient;
