import { useEffect, useState } from "react";
import Autocomplete from "../fields/Autocomplete";
import InputField from "../fields/InputField";
import { IoMdSave, IoMdTrash } from "react-icons/io";
import useFormData from "@/hooks/useFormDataNew";

const prefixed = "ingredients";
let formData: any;

interface Props {
  id?: number;
  ingredients?: any;
  variants?: any[];
  dataset?: any[];
  getInit?: any;
}

const CardIngredients: React.FC<Props> = (props) => {
  const { id, ingredients, dataset, getInit, variants } = props;
  const [inputs, setInputs]                   =   useState({ ingredient_id: "", quantity: "", variant_id: "" });
  const [ingredientList, setIngredientList]   =   useState<any[]>(dataset || []);
  //const [variantsList, setVariantsList]       =   useState<any[]>([]);  
  const [variants2, setVariants2]             =   useState<any[]>(variants||[]);  
  const [loading, setLoading] = useState<boolean>(false);
  //console.log(variantsList)

  formData = useFormData();

  const handleSave = () => {
    setLoading(true);
    const inputs_send: any = { ...inputs };

    if(inputs_send.variant_id_object&&inputs_send.variant_id_object.id){
      inputs_send.variant_id  = inputs_send.variant_id_object.id;
      delete inputs_send.variant_id_object;
    }    

    inputs_send.ingredient_id = inputs_send.ingredient_id_object.id;

    delete inputs_send.ingredient_id_object;

    // Añadir los inputs actuales al listado de ingredientes
    setIngredientList([...ingredientList, inputs]);

    // Limpiar los inputs
    setInputs({ ingredient_id: "", quantity: "", variant_id:"" });

    formData
      .handleRequest(formData.backend + location.pathname.replace("products", "products-ingredient"), "post", {
        ...inputs_send,
        store_product_id: id,
      })
      .then((response: any) => {
        if (getInit) {
          getInit();
        }
        setLoading(false);
      });
  };

  const handleDelete = (index: number, ingredient: any) => {
    const newList = [...ingredientList];
    newList.splice(index, 1);
    setIngredientList(newList);

    formData.handleRequest(formData.backend + "/dashboard/store/products-ingredient/" + ingredient.id, "delete").then((response: any) => {});
  };

  const handleDispatch = (name: any, value: any) => {
    let result: any | undefined;

    if (name === "ingredient_id") {
      result = ingredients.find((search: any) => search.label === value);
    }

    if (name === "variant_id") {
      result = variants2.find((search: any) => search.label === value);
    }

    setInputs((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
      [name + "_object"]: result,
    }));
  };

  useEffect(() => {
    if (dataset) {

      let items3: any[] = [];
      if(variants&&variants.map){
        let items2: any[] = [];
        let items4: any[] = [];
        variants.map((row: any) => {
          const item2 = {
            ingredient_id: row.variant_name,
            quantity: 0,
            id: row.id,
          };
          items3.push(row);
          items4.push({
            id:row.id,
            label:row.variant_name
          })
          return items2.push(item2);
        });
        console.log(items4)
        setVariants2(items4);
      }      

      //console.log(items3)

      let items: any[] = [];
      
      dataset.map((row: any) => {
        let variant_name      =   "";
        let ingredient: any   =   ingredients.find((search: any) => search.id === row.ingredient_id);
        if(items3&&items3.find){
          let variant: any      =   items3.find((search: any) => search.id === row?.parent?.id||0);
          if(variant){
            variant_name=variant.variant_name;
          }          
        }
        
        //console.log(items3,row?.parent?.id)
        const item = {
          variant_id: variant_name,
          ingredient_id: ingredient.label,
          quantity: row.quantity,
          id: row.id,
        };

        return items.push(item);
        
      });

      setIngredientList(items);

      

    }
  }, [dataset]);

  if (loading) {
    return <div>Guardando...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
        {/* Campo de característica (ingrediente) */}
        <div className="col-span-2">
          <Autocomplete
            id="ingredient_id"
            name="ingredient_id"
            variant="autenticación"
            extra="mb-0"
            label={"Materia Prima"}
            placeholder={"Materia Prima"}
            defaultValue={inputs?.ingredient_id}
            setInputs={setInputs}
            multiSelection={false}
            options={ingredients}
            handleDispatch={handleDispatch}
          />
        </div>
        <div className="col-span-2">
          <Autocomplete
            id="variant_id"
            name="variant_id"
            variant="autenticación"
            extra="mb-0"
            label={"Variante"}
            placeholder={"Variante"}
            defaultValue={inputs?.variant_id}
            setInputs={setInputs}
            multiSelection={false}
            options={variants2||[]}
            handleDispatch={handleDispatch}
          />
        </div>
        {/* Campo de cantidad */}
        <div>
          <InputField
            prefixed={prefixed}
            id="quantity"
            name="quantity"
            variant="autenticación"
            extra="mb-0"
            label="Cantidad"
            placeholder="Cantidad"
            type="text"
            defaultValue={inputs.quantity}
            setInputs={setInputs}
          />
        </div>
        <div className="text-center pt-8">
          <div className="flex justify-center cursor-pointer" onClick={handleSave}>
            <IoMdSave className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/* Mostrar el listado de ingredientes */}
      <div className="mt-4">
        {ingredientList.map((ingredient, index) => (
          <div key={index} className="flex items-center border p-2 my-2 rounded bg-green-100">
            <span className="flex-1">{`${ingredient.quantity} de ${ingredient.ingredient_id}`} {ingredient.variant_id!==''&&((<b>{ingredient.variant_id}</b>))}</span>
            <IoMdTrash className="cursor-pointer text-red-500" onClick={() => handleDelete(index, ingredient)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardIngredients;
