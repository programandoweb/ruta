import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { ListIngredientProps } from './interfaceListIngredient';
import { MdOutlineScreenSearchDesktop, MdAddToQueue } from "react-icons/md";
import Card from '../card';
import useFormData from '@/hooks/useFormDataNew';
import SelectField from '../fields/SelectField';

const ListIngredient: React.FC<ListIngredientProps> = ({ dataset, setDataset, ingredients, setIngredients }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [measurement, setMeasurement] = useState<any>([]);
    const [inputs, setInputs] = useState<any>({});
    const [inputValue, setInputValue] = useState<string>('');
    const [inputQuantity, setInputQuantity] = useState<any>({});
    const formData = useFormData(false, false, false);

    const handleAdd = () => {
        formData.handleRequest(formData.backend + "/dashboard/master_properties", "post", {...inputs, label: inputValue }, false).then((response) => {
            setOpen(false);
            if (response && response.property) {
                setInputValue("");
                setDataset(response.property);
            }
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleChangeStateMain = (row:any , event: ChangeEvent<HTMLInputElement>) => {
        const {value,name} = event.target
        
        // Verificar si el valor es un número entero
        if (!Number.isInteger(Number(value))) {            
            return event.preventDefault();
        }

        setInputQuantity((prevInputs:any) => ({
            ...prevInputs,
            [name]: value,
        })); 
        
        setIngredients((prevInputs:any) => ({
            ...prevInputs,
            [name]: {...row,quantity:value},
        })); 

    };

    const getInit = () => {
        formData.handleRequest(formData.backend + "/dashboard/master_properties", "get").then((response) => {
            if (response && response.properties) {
                setDataset(response.properties);
                setMeasurement(response.units_of_measurement);
            }
        });
    };

    useEffect(getInit, []);

    console.log(dataset)

    return (
        <div className="h-[90%] overflow-auto">
            <div className="h-[60px] overflow-hidden text-end">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 mb-5 relative">
                        <input
                            onChange={handleChange}
                            value={inputValue}
                            placeholder="Buscar ..."
                            className="mt-2 h-12 w-full pl-3 pr-16 rounded-xl border bg-white p-3 text-sm outline-none duration-300 border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                            <MdOutlineScreenSearchDesktop
                                title='Buscar'
                                className="w-5 h-5 text-gray-400 cursor-pointer transition-colors duration-200 hover:text-brand-600 dark:hover:text-brand-300"
                            />
                            <MdAddToQueue
                                title='Agregar'
                                className="w-5 h-5 text-gray-400 cursor-pointer transition-colors duration-200 hover:text-brand-600 dark:hover:text-brand-300"
                                onClick={() => { setOpen(!open) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='rounded-lg h-[75%] bg-gray-100'>
                <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {
                        open && (
                            <>
                                <div className='mr-1 mb-1 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2'>
                                    <div className=''>
                                        <SelectField
                                            defaultValue={inputs.units_of_measurement_id}
                                            setInputs={setInputs}
                                            options={measurement}
                                            name="units_of_measurement_id"
                                            variant="autenticación"
                                            extra="mb-0"
                                            id="units_of_measurement_id"
                                        />
                                    </div>
                                </div>
                                <div className='mr-1 mb-1 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2'>
                                    <div className=''>
                                        <input
                                            name="label"
                                            value={inputValue}
                                            onChange={handleChange}
                                            placeholder='Nombres, Ej: Plástico, pintura, carne '
                                            type="text"
                                            className='rounded-xl border text-center p-2 w-full items-center justify-center'
                                        />
                                    </div>
                                </div>
                                {
                                    inputs.units_of_measurement_id&&inputValue&&(
                                        <div className='mr-1 mb-1 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2'>
                                            <div className=''>
                                                <div onClick={()=>handleAdd()} className='cursor-pointer text-center flex items-center justify-center p-2 linear rounded-xl bg-brand-500 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200'>
                                                    Agregar
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }                                
                            </>
                        )
                    }
                    {
                        !open &&
                        dataset &&
                        dataset.map &&
                        dataset.map((row, key) => (
                            <div key={key} className='mr-1 mb-1 col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1'>
                                <Card>
                                    <div className='px-2 pt-1 text-center'>
                                        {row.name}  {row.units_of_measurement?<b>({row.units_of_measurement})</b>:""}
                                    </div>
                                    <div className='p-2 mx-2 text-center'>
                                        <input  value={inputQuantity[row.id]||ingredients[row.id]?.quantity} 
                                                name={row.id} 
                                                onChange={(e)=>handleChangeStateMain(row,e)} 
                                                placeholder={ row.units_of_measurement?'Cantidad en '+row.units_of_measurement:'Cantidad'} type="number" className='text-center p-1 w-full items-center justify-center border' />
                                    </div>
                                </Card>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ListIngredient;
