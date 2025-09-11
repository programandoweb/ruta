/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import useFormData from "@/hooks/useFormDataNew";

export interface Variant {
  variant_name: string;
  variant_code: string;
  variant_price: string;
  id?: number;
}

export interface FeatureOption {
  label: string;
  value: string;
}

export interface Feature {
  label: string;
  description: string; // Describe el tipo de campo (text, select, date, etc.)
  options?: FeatureOption[]; // Opciones disponibles si el campo es un select
  bool_status: number; // Indica si el campo está habilitado o no
  medida_id?: number; // Relaciona el feature con un grupo o medida
}

export interface GroupFeatures {
  [key: string]: FeatureOption[]; // Relación entre grupos y sus opciones
}

interface Props {
  inputs?: any; // Almacena los valores de los inputs dinámicos
  setInputs?:  any ; // Función para actualizar los valores de inputs
  group_features?: GroupFeatures; // Opciones agrupadas disponibles
  name: string;
  id?: number;
  feature_id?: number;
  ingredients?: Variant[];
  dataset?: Variant[];
  getInit?: () => void;
}

let formData: any;
let dataDinamic:any = {};

const CardFeatures: React.FC<Props> = ({ group_features, dataset = [], name, feature_id, setInputs, inputs }) => {
  formData = useFormData(); 
  const inputsList = dataset.filter((search: any) => search.medida_id === feature_id);
  const handleOnChange = (e: any) => {
    const { name, type, value, checked } = e.target;  
    const fieldValue = type === "checkbox" ? checked : value;  
    dataDinamic = { ...dataDinamic, [name]: fieldValue };  
    setInputs((prevFormData: any) => ({
      ...prevFormData,
      dataDinamic,
    }));
  };
  
  
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 md:col-span-3 text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {name}
        </div>
        {inputsList &&
          inputsList.map((row: any, key) => {
            const dataList = group_features&&group_features[row.options] || [];
            if (row.bool_status === 0) return null;

            return (
              <div key={key} className="space-y-2">
                <label
                  htmlFor={row.label}
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  {row.label}
                </label>
                {(() => {
                  switch (row.description) {
                    case "text":
                      return (
                        <>
                          <input
                            id={row.label}
                            type="text"
                            name={row.label}
                            className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
                            placeholder={`Ingrese ${row.label}`}
                            defaultValue={inputs&&inputs?.dataDinamic&&inputs?.dataDinamic[row.label]?inputs?.dataDinamic[row.label]:""}
                            onChange={handleOnChange}
                          />
                        </>
                      );
                    case "select":
                      return (
                        <select
                          id={row.label}
                          name={row.label}
                          className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
                          defaultValue={inputs&&inputs?.dataDinamic&&inputs?.dataDinamic[row.label]}
                          onChange={handleOnChange}
                        >
                          <option value="">Seleccione {row.label}</option>
                          {dataList &&
                            dataList.map((r: any, k: number) => (
                              <option key={k} value={r.label}>
                                {r.label}
                              </option>
                            ))}
                        </select>
                      );
                    case "date":
                      return (
                        <input
                          id={row.label}
                          type="date"
                          name={row.label}
                          className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
                          defaultValue={inputs[row.label]}
                          onChange={handleOnChange}
                        />
                      );
                    case "boolean":
                      return (
                        <div className="flex items-center">
                          <input
                            id={row.label}
                            type="checkbox"
                            name={row.label}
                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                            defaultChecked={inputs&&inputs?.dataDinamic&&inputs?.dataDinamic[row.label]&&inputs?.dataDinamic[row.label]===true}
                            onChange={handleOnChange}
                          />                         
                        </div>
                      );
                    default:
                      return (
                        <input
                          id={row.label}
                          type="text"
                          name={row.label}
                          className="block w-full px-3 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white"
                          placeholder={`Ingrese ${row.label}`}
                          defaultValue={inputs&&inputs?.dataDinamic&&inputs?.dataDinamic[row.label]?inputs?.dataDinamic[row.label]:""}
                          onChange={handleOnChange}
                        />
                      );
                  }
                })()}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CardFeatures;
