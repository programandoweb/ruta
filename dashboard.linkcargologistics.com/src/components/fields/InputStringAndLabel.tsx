/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

type Props = {
    children: ReactNode;
    className?: string | undefined;
    label?: string | undefined;
    error?: string | undefined;
    setInputs?: any;
    group?: string | undefined; 
    skip?:boolean
};

const InputStringAndLabel = ({ 
    children, 
    className, 
    label, 
    skip,
    error, 
    setInputs, 
    group 
}: Props) => {
    const handleOnChange = () => {
        setInputs((prevFormData: any) => {
            const updatedDataDinamic = { ...prevFormData.dataDinamic };

            if (group && label) {
                // Eliminar dependencias basadas en el nivel del label
                const dependencies = ["Departamento", "Ciudad", "Barrio"];
                const startIndex = dependencies.indexOf(label);

                if (startIndex !== -1) {
                    for (let i = startIndex; i < dependencies.length; i++) {
                        delete updatedDataDinamic[group]?.[dependencies[i]];
                    }
                }
            }

            console.log(updatedDataDinamic, group, label);
            return {
                ...prevFormData,
                dataDinamic: updatedDataDinamic,
            };
        });
    };

    return (
        <div className={className || ""}>
            {label && (
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                    <b>{label}</b>
                </label>
            )}

            <div className='
                bg-gray-200
                mt-1 w-full px-3 py-2 
                border rounded-lg text-sm shadow-sm 
                flex items-center justify-between
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white
            '>
                <div>{children}</div>
                {
                    !skip&&(
                        <button 
                            type='button'
                            onClick={handleOnChange} 
                            className="ml-2 flex items-center gap-1 p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            title="Cambiar valor"
                        >
                            <FiX size={20} /> <span>Cambiar</span>
                        </button>
                    )
                }
                
            </div>

            {error && (
                <div className='text-red-400 text-xs'>
                    {error}
                </div>
            )}
        </div>
    );
};

export default InputStringAndLabel;
