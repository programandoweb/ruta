/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React, { useState, ReactNode, Fragment } from 'react';
import { FaSearch } from 'react-icons/fa';
import ModalComponent from './ModalComponent';

interface ResumeButtonProps {
    module?:string;
    dataset?: any; // Dataset opcional
    children?: ReactNode; // Contenido adicional para renderizar
}

const ResumeButton: React.FC<ResumeButtonProps> = ({ dataset, children }) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleClick = () => {
        setIsActive((prevState) => !prevState); // Alternar el estado booleano
    };

    const Component=()=>{
        //console.log(dataset)
        return (
            <div className="logbook-container bg-gray-100 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Bitácora</h2>
              <div className="logbook-list space-y-4">
                {dataset.map((item:any) => (
                  <div
                    key={item.id}
                    className="logbook-item bg-white p-4 rounded-md shadow-md border border-gray-200"
                  >
                    <div className="logbook-header flex justify-between items-center mb-2">
                      <div className="logbook-user font-semibold text-blue-600">
                        {item.mensaje.split(":")[0]}
                      </div>
                      <div className="logbook-time text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="logbook-message text-gray-700">
                      <div dangerouslySetInnerHTML={{ __html: item.mensaje.split(":")[1] }} />
                    </div>
                    {item.json && (
                      <details className="logbook-json mt-2 text-sm text-gray-600">
                        <summary className="cursor-pointer text-blue-500">
                          Ver detalles JSON
                        </summary>
                        <pre className="bg-gray-50 p-2 rounded-md overflow-auto">
                          {JSON.stringify(JSON.parse(item.json), null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
    }

    return (
    <Fragment>
        {             
            isActive&&(<ModalComponent component={Component} modal={isActive} onClose={() => setIsActive(false)} />)
        } 
        <div className="flex flex-col items-start space-y-2">
        <div className="flex items-center">
            <button        
            type="button"
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors mr-2 ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            title="Bitácora"
            >
            <FaSearch size={20} />
            </button>
            {children && (children)}
        </div>
        
        </div>
    </Fragment>
  );
};

export default ResumeButton;
