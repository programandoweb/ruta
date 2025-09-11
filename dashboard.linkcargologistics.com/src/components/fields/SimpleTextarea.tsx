    import { Fragment, useEffect, useState } from "react";
    import { SimpleTextareaProps } from "./interfaceSimpleTextarea";

    

    const SimpleTextarea: React.FC<SimpleTextareaProps> = ({
    data,
    label,
    name,
    rows,
    setInputs,
    disabled
    }) => {

    const [value, setValue] = useState(data[name] || "");
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (setInputs) {
            setInputs((prevFormData:any) => ({
                ...prevFormData,
                [name]: newValue,
            }));
        }
    };

    useEffect(()=>{
        if(value==='' && data[name]){
            setValue(data[name])
        }
    },[data])

    return (
        <Fragment>
        {label && (
            <label className={`text-sm text-navy-700 dark:text-white font-bold mb-2`}>
                    {label}
            </label> 
        )}
        <textarea
            value={value}
            onChange={handleChange}
            placeholder={`Escribe acá para ${label}`}
            name={name}
            rows={rows || 4}
            className={`mt-2 flex h-40 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none duration-300 ${disabled? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"                : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white"}`}/>
        </Fragment>
    );
    };

    export default SimpleTextarea;
