import React, { Fragment, useEffect, useState } from 'react';
//import useFormData from '@/hooks/useFormDataNew';
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import useModalState,{ModalHook} from '../modal/useModalState';
import ListIngredient from './ListIngredient';
import {interfaceIndex} from './interfaceIndex';


const prefixed = "ingredients";

const Ingredients: React.FC<interfaceIndex> = ({ ingredients, setIngredients, dataset, setDataset }) => {
    const modal                             =   useModalState();
    //const formData                          =   useFormData(false, false, false);
    
    
    /*
    useEffect(() => {
        formData.handleRequest(formData.backend + location.pathname + "?features=true").then((response:any)=>{
            if(response.features){
                setFeatured(response.features)
            }            
        })
    }, [])
    */

    const [inputs, setInputs] = useState({
        quantity: '',
        properties_id: '',
        units_of_measurement_id: ''
    });

    const handleSubmit = () => {
        // Validar que todos los campos estén completos
        if (!inputs.quantity || !inputs.properties_id || !inputs.units_of_measurement_id) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Aquí puedes realizar tu lógica para enviar los datos al backend usando fetch
        fetch('URL_DEL_BACKEND', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        })
        .then(response => {
            if (response.ok) {
                alert('Datos enviados exitosamente.');
                // Lógica adicional después de enviar los datos
            } else {
                throw new Error('Error al enviar los datos al servidor.');
            }
        })
        .catch(error => {
            alert(error.message);
        });
    };

    const handleAddFeature=()=>{
        modal.openModal()        
    }

    console.log(dataset)

    return (
        <Fragment>
            <ModalHook {...modal} component={<ListIngredient ingredients={ingredients} setIngredients={setIngredients} dataset={dataset} setDataset={setDataset}/>}/>
            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-1">
                    <div>
                        <div onClick={handleAddFeature} className="flex items-center justify-center space-x-2 px-5 py-1 text-base font-medium text-white transition duration-200 rounded-xl bg-brand-200 hover:bg-brand-300 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 cursor-pointer mb-2">
                            <MdOutlineFeaturedPlayList className='mr-1' />
                            <span>Cargar características</span>
                        </div>                        
                    </div>
                    <div>
                        {
                            ingredients&&
                            Object.entries(ingredients)&&
                            Object.entries(ingredients).length>0&&(
                                <table className='w-full'>
                                    <thead className='mr-2 px-5 linear bg-brand-500 py-1 text-base text-white'>
                                        <tr>
                                            <th>
                                                Característica
                                            </th>
                                            <th>
                                                Cantidad / Medida
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                          Object.entries(ingredients).map((row,key)=>{

                                            console.log(row[1])
                                            const val:any  =   row[1];
                                            return  <tr key={key}>
                                                        <td className='text-start'>
                                                            {
                                                                val.name||val.ingredient
                                                            }
                                                        </td>
                                                        <td className='text-end'>
                                                            {val.quantity} <b>{val.units_of_measurement||val.measurement}</b>
                                                        </td>
                                                    </tr>
                                          })  
                                        }
                                        
                                    </tbody>
                                </table>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Ingredients;
