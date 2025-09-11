import useFormData from "@/hooks/useFormDataNew";
import { formatearMonto } from "@/utils/fuctions";
import { useState, useEffect } from "react";
import { IoMdSave, IoMdTrash } from "react-icons/io";

interface Variant {
  variant_name: string;
  variant_code: string;
  variant_price: string;
  id?: number;
}

interface Props {
  id?: number;
  ingredients?: Variant[];
  dataset?: Variant[];
  getInit?: () => void;
}


const defaultValue:Variant  = { variant_name: "", variant_code: "", variant_price: "" }
let formData: any;

const CardVariants: React.FC<Props> = ({ id, ingredients = [], dataset = [], getInit }) => {
  const [inputs, setInputs]           =   useState<Variant>(defaultValue);
  const [variantList, setVariantList] =   useState<Variant[]>(dataset || []);
  const [loading, setLoading]         =   useState<boolean>(false);
  
  formData                            =   useFormData();

  const handleSave = () => {
    setLoading(true);
    setVariantList([...variantList, inputs]);
    setInputs(defaultValue);

    if (getInit) {
      getInit();
    }

    formData.handleRequest(formData.backend + location.pathname.replace("products", "products-ingredient"), "post", {
        ...inputs,
        store_product_id: id,
        type:"variant"
      }).then((response: any) => {
        if (getInit) {
          getInit();
        }
        setLoading(false);
      });

  };

  const handleDelete = (index: number, variant:any) => {
    const newList = [...variantList];
    newList.splice(index, 1);
    setVariantList(newList);
    formData.handleRequest(formData.backend + "/dashboard/store/products-ingredient/" + variant.id, "delete").then((response: any) => {});
  };

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      setVariantList(dataset);
    }
  }, [dataset]);

  if (loading) {
    return <div>Guardando...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {/* Campo de nombre de la variante */}
        <div className="col-span-1">
          <input
            type="text"
            name="variant_name"
            className="w-full p-2 border rounded"
            placeholder="Ingrese la variante"
            value={inputs.variant_name}
            onChange={(e) => setInputs({ ...inputs, variant_name: e.target.value })}
          />
        </div>
        {/* Campo de precio adicional */}
        <div className="col-span-1">
          <input
            type="number"
            name="variant_price"
            className="w-full p-2 border rounded"
            placeholder="Precio adicional"
            value={inputs.variant_price}
            onChange={(e) => setInputs({ ...inputs, variant_price: e.target.value })}
          />
        </div>
        <div className="text-center">
          <div className="flex justify-center cursor-pointer mt-4" onClick={handleSave}>
            <IoMdSave className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Mostrar el listado de variantes */}
      <div className="mt-4">
        {variantList.map((variant, index) => (
          <div key={index} className="flex items-center border p-2 my-2 rounded bg-green-100">
            <span className="flex-1">{`${variant.variant_name} -  Precio adicional: $${formatearMonto(variant.variant_price,0)}`}</span>
            <IoMdTrash className="cursor-pointer text-red-500" onClick={() => handleDelete(index,variant)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardVariants;
