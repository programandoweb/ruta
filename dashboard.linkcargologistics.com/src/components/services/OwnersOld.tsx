import { useEffect, useState } from "react";
import Card from "../card";
import SelectField from "../fields/SelectField";
import { formatearMonto } from "@/utils/fuctions";
import InputField from "../fields/InputField";

interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  identity_card: string;
  email: string;
  cell_phone: string;
  rate: string;
  account_number: string;
  bank_id: number;
  reference: string;
  ref_cell_phone: string;
  observations: string;
  driving_license: string | null;
  license_category: string | null;
  license_expiration_date: string | null;
  is_agency: string | null;
  accreditation_card: string | null;
  language_ids: string;
  people_type: string;
  register_number: string | null;
  bool_status_id: string | null;
  created_at: string;
  updated_at: string;
  properties: any[];  // Puedes especificar mejor el tipo de 'properties' si conoces la estructura
}

interface OwnersData {
    tour_service_ids:any;
    name: string;
    label?: string;
    dataset: Owner[];
    inputs?: any;
    setInputs?: React.Dispatch<React.SetStateAction<any>>;
}

interface Property {
    id: number;
    transport_type: string;
    borrower_id: number;
    title: string;
    plate: string;
    color: string;
    model: string;
    cost_price: number;
    sale_price: number;
    bool_status_id: number | null;
    created_at: string;
    updated_at: string;
}



const Owners    =   (props: OwnersData) => {
  
    const { name, label, dataset, inputs, setInputs, tour_service_ids } = props;
    const [data, setData]           =   useState<any>();
    const [select, setSelect]       =   useState<any>([]);
    const [selected, setSelected]   =   useState<boolean|number>(false);
    const [value, setValue]         =   useState<any>(false);

    const prefixed                  =   name

    useEffect(() => {
        let data_: any[] = [];
        if (dataset.map) {
            dataset.map((row: any) => {
                return data_.push({ value: row.id, name: row.first_name });
            });
            setData(data_);
        }
    }, [dataset]);

    useEffect(() => {
        if (inputs[name]) {
            const result = dataset.find((search: any) => search.first_name.toString() === inputs[name].toString());
            if (result && result.properties) {
                const filteredProperties = result.properties.filter((property: Property) => property.transport_type === name);
                setSelect(filteredProperties);
            } else {
                setSelect([]);
            }
        }
    }, [inputs[name], dataset, name]);

    const handleClick = (value: any) => {
        setSelected(value)
        setValue(select.find((search:any)=>search.id===value))        
        /*
        if (setInputs) {
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: value,
            }));
        }*/
    };

    const handleClose=()=>{
        setSelected(false)
        setValue(false) 
    }

    if(!tour_service_ids.includes(label)){
        return <></>
    }

    return (
        <div>
            <Card className="p-4" variant={selected?"brand":false}>
                {
                    !selected?
                        <>
                            <SelectField
                                label={label}
                                defaultValue={inputs[name]}
                                setInputs={setInputs}
                                options={data}
                                name={name}
                                variant="autenticación"
                                extra="mb-0"
                                id={name}
                            />
                            {
                                select && select.length > 0 && (
                                    <div className="mt-2 grid h-full grid-cols-1 md:grid-cols-6 ">
                                        <div className="col-span-4">Describe</div>
                                        <div className="text-center">Costo</div>
                                        <div className="text-center">Venta</div>
                                        {
                                            select && select.map((row: any, key: number) => (
                                                <div key={key} className={` col-span-6  ${ selected && selected===row.id ? "bg-indigo-800 hover:bg-indigo-600 text-white": key % 2 === 0 ? "bg-indigo-300 hover:bg-indigo-400 transition-colors duration-300 text-white" : "hover:bg-indigo-200 transition-colors duration-300"}` } onClick={() => handleClick(row.id)}>                                        
                                                    <div className={`cursor-pointer grid h-full grid-cols-1 gap-2 md:grid-cols-6 `}>
                                                        <div className="col-span-4 p-1">{row.title}</div>
                                                        <div className="px-1 py-1 text-right">{formatearMonto(row.cost_price)}</div>
                                                        <div className="px-1 py-1 text-right ">{formatearMonto(row.sale_price)}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </>:<div className="">
                                <label className="font-bold text-white mb-2 text-sm text-navy-700 dark:text-white  ">
                                    {value.title}
                                </label>
                                <div className="text-white text-sm">
                                    {value.model} - {value.plate} 
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="mt-1">                                        
                                        <InputField
                                                        required={true}
                                                        prefixed={prefixed}
                                                        name="cost_price"
                                                        variant="autenticación"
                                                        extra="mb-0"
                                                        placeholder={"Precio Costo"}
                                                        id="cost_price"
                                                        type="number"
                                                        defaultValue={value.cost_price||inputs?.cost_price}
                                                        setInputs={setInputs}                                                                    
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <InputField
                                                        required={true}
                                                        prefixed={prefixed}
                                                        name="sale_price"
                                                        variant="autenticación"
                                                        extra="mb-0"
                                                        placeholder={"Precio Venta"}
                                                        id="sale_price"
                                                        type="number"
                                                        defaultValue={value.sale_price||inputs?.sale_price}
                                                        setInputs={setInputs}                                                                    
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <div onClick={handleClose} className="cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-gray-600 py-1 text-base font-medium text-white transition duration-200 hover:bg-gray-700 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-400 dark:active:bg-gray-200">Cambiar</div>
                                    </div>
                                    <div>
                                        <div className=" cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>
                                    </div>
                                </div>
                            </div>        
                    
                }                
            </Card>
        </div>
    );
};

export default Owners;
