import { useEffect, useState } from "react";
import Card from "../card";
import SelectField from "../fields/SelectField";
import { formatearMonto } from "@/utils/fuctions";
import InputField from "../fields/InputField";
import StringAndLabel from "../fields/StringAndLabel";
import { IoMdRefresh } from "react-icons/io";

interface Owner {
    borrower: any;
    data: any;
}

interface OwnersData {
    disabled?:boolean|undefined;
    tour_service_ids:any;
    name: string;
    label?: string;
    dataset: Owner;
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

let value_:any

const Owners    =   (props: OwnersData) => {
    
    const { name, label, dataset, inputs, setInputs, tour_service_ids,disabled } = props;
    const [data, setData]           =   useState<any>();
    const [select, setSelect]       =   useState<any>([]);
    const [selected, setSelected]   =   useState<boolean|number>(false);
    const [value, setValue]         =   useState<any>(false);
    const [input, setInput]         =   useState<any>(false);
    const [save, setSave]           =   useState<boolean>(false);
    

    const prefixed                  =   name

    useEffect(() => {
        let data_: any[] = [];
        if (dataset&&dataset.borrower&&Object.entries(dataset.borrower)) {
            Object.entries(dataset.borrower).map((row: any) => {
                return data_.push({ value: row[1].borrower_id, name: row[1].provider_name });
            });
            setData(data_);
        }
    }, [dataset]);

    
    useEffect(() => {
        if(inputs.items){
            const result    =   inputs.items.find((search:any)=>{return search.item_type===name})
            if(!result)return;
            const result2   =   data&&data.find((search:any)=>search.value===result.owner_id)
            if(!result2)return;
            const insert    =   {
                cost_price:result.cost_price,
                sale_price:result.sale_price,
                [name]:result.owner_id,
                label:result2.name,
                owner_id:result.owner_id
            }

            setSave(true);
            setInput(insert)
            setSelected(result.service_id)            
        }
    }, [inputs.items]);
    

    //console.log(input,selected)

    useEffect(() => {

        if(tour_service_ids.includes(label)&&setInputs){
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: null,
            }));
        } 
        
    }, []);

    useEffect(() => {

        if (input[name]) {
            if (    input[name]    && 
                    dataset.data    &&
                    dataset.data[input[name]]
                ) {
                setSelect(dataset.data[input[name]]);                    
            }else{
                setSelect([]);
            }            
        }
        
    }, [input[name], dataset, name]);

    const handleClick = (value: any) => {
        
        setSelected(value)
        
        value_      =       select.find((search:any)=>search.value===value)

        setInput((prevFormData:any) => ({
            ...prevFormData,
            ...value_,
            owner_id:input[name]
        }));

        setValue(value_)   

    };

    const handleClose=()=>{
        setSelected(false)
        setValue(false) 
    }

    const handleSave=()=>{
        setSave(true)
        if (setInputs) {
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: {...value_,...input},
            }));    
        }        
    }

    if(!tour_service_ids.includes(label)){
        return <></>
    }

    return (
        <div >
            <Card className="p-4" variant={selected?"brand":false}>
                {
                    !selected?
                        <>
                            <SelectField
                                label={label}
                                defaultValue={input[name]}
                                setInputs={setInput}
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
                                                <div key={key} className={` col-span-6  ${ selected && selected===row.id ? "bg-indigo-800 hover:bg-indigo-600 text-white": key % 2 === 0 ? "bg-indigo-300 hover:bg-indigo-400 transition-colors duration-300 text-white" : "hover:bg-indigo-200 transition-colors duration-300"}` } onClick={() => handleClick(row.value)}>                                        
                                                    <div className={`cursor-pointer grid h-full grid-cols-1 gap-2 md:grid-cols-6 `}>
                                                        <div className="col-span-4 p-1">{row.label}</div>
                                                        <div className="px-1 py-1 text-right">{formatearMonto(row.cost_price)}</div>
                                                        <div className="px-1 py-1 text-right ">{formatearMonto(row.sale_price)}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </>:<div className="relative">
                                <label className="font-bold text-white mb-2 text-sm text-navy-700 dark:text-white  ">
                                    {value.label} {!disabled&&save&&(<><IoMdRefresh onClick={()=>{setSave(false)}} className="h-6 w-6 absolute right-2 top-0 cursor-pointer" /></>)}
                                </label>
                                {
                                    !save?(
                                        <>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="mt-1">                                        
                                                    <InputField
                                                                    required={true}
                                                                    prefixed={prefixed}
                                                                    name="cost_price"
                                                                    variant="autenticación"
                                                                    extra="mb-0"
                                                                    label="Precio Costo"
                                                                    placeholder={"Precio Costo"}
                                                                    id="cost_price"
                                                                    type="number"
                                                                    defaultValue={value.cost_price||input?.cost_price}
                                                                    setInputs={setInput}                                                                    
                                                    />
                                                </div>
                                                <div className="mt-1">
                                                    <InputField
                                                                    required={true}
                                                                    prefixed={prefixed}
                                                                    name="sale_price"
                                                                    variant="autenticación"
                                                                    extra="mb-0"
                                                                    label="Precio Venta"
                                                                    placeholder={"Precio Venta"}
                                                                    id="sale_price"
                                                                    type="number"
                                                                    defaultValue={value.sale_price||input?.sale_price}
                                                                    setInputs={setInput}                                                                    
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div>
                                                    <div onClick={handleSave} className=" cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Guardar</div>
                                                </div>
                                                <div>
                                                    <div onClick={handleClose} className="cursor-pointer flex justify-center items-center mr-2 px-5 linear rounded-xl bg-gray-600 py-1 text-base font-medium text-white transition duration-200 hover:bg-gray-700 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-400 dark:active:bg-gray-200">Cambiar</div>
                                                </div>                                                
                                            </div>
                                        </>
                                    ):<>
                                        <div className="col-span-2 ">
                                            <label className="font-bold mb-2 text-white text-sm text-navy-700 dark:text-white relative ">
                                                {label}
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="mt-1">
                                                <StringAndLabel 
                                                    className="text-white" 
                                                    label={"Precio Costo"}>
                                                    {input?.cost_price}
                                                </StringAndLabel>
                                            </div>
                                            <div className="mt-1">
                                                <StringAndLabel
                                                    className="text-white" 
                                                    label={"Precio Venta"}>
                                                    {input?.sale_price}
                                                </StringAndLabel>
                                            </div>
                                        </div>    
                                    </>
                                }
                                
                            </div>        
                    
                }                
            </Card>
        </div>
    );
};

export default Owners;
