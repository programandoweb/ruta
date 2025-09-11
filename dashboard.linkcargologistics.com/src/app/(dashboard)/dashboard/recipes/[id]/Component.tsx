"use client";

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import UploadWithImage from '@/components/buttom/UploadGalleries';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsSelectorList from '@/components/products/ProductsSelectorList';

const prefixed = 'product';



const CSRProductFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [raws, setRaws] = useState<any[]>([]);

  const [inputs, setInputs] = useState<any>({
    // Campos del servicio principal
    name: '',
    description: '',
    image: '',
    gallery: [],
    product_category_id: '',

    // Campos específicos del producto
    barcode: '',
    brand: '',
    measure_unit: '',
    measure_quantity: '',
    short_description: '',
    long_description: '',
    stock_control: false,
    stock_alert_level: '',
    stock_reorder_amount: '',
    model: '',
    color: '',
    sku: '',
    price: '',
    cost:''
  });

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((res: any) => {
        if (res?.product) {
          const main = res.product;

          setInputs({
            id: main.id,
            name: main.name,
            product_id_new: main.id,
            items: main.items || [],
            description: main.long_description || '',
            image: main.image || '',
            gallery: main.gallery || [],

            product_category_id: main.product_category?.id || '',

            barcode: main.barcode || '',
            brand: main.brand || '',
            measure_unit: main.measure_unit || '',
            measure_quantity: main.measure_quantity || '',
            short_description: main.short_description || '',
            long_description: main.long_description || '',
            stock_control: !!main.stock_control,
            stock_alert_level: main.stock_alert_level || '',
            stock_reorder_amount: main.stock_reorder_amount || '',
            model: main.model || '',
            color: main.color || '',
            sku: main.sku || '',
            price: main.price || '',
            cost: main.cost || '',
          });
        }

        if (res?.categories) setCategories(res.categories);
        if (res?.raws) setRaws(res.raws);
      });
  };


  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then((res:any) => {
        if(!inputs.id&&res[prefixed]?.id){
          router.replace('/dashboard/recipes/'+res[prefixed]?.id);
        }else{
          router.replace('/dashboard/recipes');
        }
      });
  };

  const handleGalleryUpload = (url: string) => {
    setInputs((prev: any) => {
      const arr = Array.isArray(prev.gallery)
        ? prev.gallery
        : typeof prev.gallery === 'string' && prev.gallery !== ''
        ? JSON.parse(prev.gallery)
        : [];
      return { ...prev, gallery: [...arr, url] }; // ← SIN JSON.stringify
    });
  };

  const handleGalleryRemove = (i: number) => {
    setInputs((prev: any) => {
      const arr = Array.isArray(prev.gallery)
        ? prev.gallery
        : typeof prev.gallery === 'string' && prev.gallery !== ''
        ? JSON.parse(prev.gallery)
        : [];
      return { ...prev, gallery: arr.filter((_: any, idx: any) => idx !== i) }; // ← SIN JSON.stringify
    });
  };


  const handleSetMainImage = (url: string) => {
    setInputs((prev: any) => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
              <InputField
                required
                prefixed={prefixed}
                name="name"
                label="Nombre del producto"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />
              <SelectField
                prefixed={prefixed}
                name="product_category_id"
                label="Categoría del producto"
                id="product_category_id"
                defaultValue={inputs.product_category_id}
                setInputs={setInputs}
                options={categories}
                variant="autenticación"
                extra="mb-0"
              />
              {
                /*
                <InputField
                  prefixed={prefixed}
                  name="brand"
                  label="Marca"
                  id="brand"
                  type="text"
                  defaultValue={inputs.brand}
                  setInputs={setInputs}
                />
                <SelectField
                  prefixed={prefixed}
                  name="measure_unit"
                  label="Unidad de medida"
                  id="measure_unit"
                  defaultValue={inputs.measure_unit}
                  setInputs={setInputs}
                  options={[
                    { value: '', label: 'Seleccione...' },
                    { value: 'ml', label: 'Mililitros (ml)' },
                    { value: 'l', label: 'Litros (l)' },
                    { value: 'fl_oz', label: 'Onzas líquidas (fl oz)' },
                    { value: 'g', label: 'Gramos (g)' },
                    { value: 'kg', label: 'Kilogramos (kg)' },
                    { value: 'gal', label: 'Galones (gal)' },
                    { value: 'oz', label: 'Onzas (oz)' },
                    { value: 'lb', label: 'Libras (lb)' },
                    { value: 'cm', label: 'Centímetros (cm)' },
                    { value: 'ft', label: 'Pies (ft)' },
                    { value: 'in', label: 'Pulgadas (in)' },
                    { value: 'unit', label: 'Unidad (unit)' },
                  ]}
                  variant="autenticación"
                  extra="mb-0"
                />

                <InputField
                prefixed={prefixed}
                name="model"
                label="Modelo"
                id="model"
                type="text"
                defaultValue={inputs.model}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="sku"
                label="SKU"
                id="sku"
                type="text"
                defaultValue={inputs.sku}
                setInputs={setInputs}
              />
                */
              }
              

              <InputField
                prefixed={prefixed}
                name="measure_quantity"
                label="Cantidad de medida"
                id="measure_quantity"
                type="number"
                defaultValue={inputs.measure_quantity}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="short_description"
                label="Descripción corta"
                id="short_description"
                type="text"
                defaultValue={inputs.short_description}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="long_description"
                label="Descripción larga"
                id="long_description"
                type="text"
                defaultValue={inputs.long_description}
                setInputs={setInputs}
              />
              
              
              <InputField
                prefixed={prefixed}
                name="price"
                label="Precio"
                id="price"
                type="number"
                defaultValue={inputs.price}
                setInputs={setInputs}
              />

              <InputField
                prefixed={prefixed}
                name="cost"
                label="Costo"
                id="cost"
                type="number"
                defaultValue={inputs.cost}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="stock_alert_level"
                label="Nivel de alerta de stock"
                id="stock_alert_level"
                type="number"
                defaultValue={inputs.stock_alert_level}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="stock_reorder_amount"
                label="Cantidad para reordenar"
                id="stock_reorder_amount"
                type="number"
                defaultValue={inputs.stock_reorder_amount}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>
        {
          inputs?.id&&(
            <div className='grid md:grid-cols-2 gap-5'>
              <div>
                <Card className="mt-2">
                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-4">Galería de imágenes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      {(() => {
                        try {
                          const arr = typeof inputs.gallery === 'string'
                            ? JSON.parse(inputs.gallery || '[]')
                            : inputs.gallery || [];
                          return arr.map((url: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative aspect-square border rounded overflow-hidden group cursor-pointer"
                              onClick={() => handleSetMainImage(url)}
                              title="Establecer como imagen destacada"
                            >
                              <img
                                src={url}
                                alt={`gallery-${idx}`}
                                className={`w-full h-full object-cover ${
                                  inputs.image === url ? 'ring-4 ring-blue-500' : ''
                                }`}
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGalleryRemove(idx);
                                }}
                                title="Eliminar imagen"
                              >
                                ✕
                              </button>
                            </div>
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </div>

                    <UploadWithImage
                      name="temp_image"
                      label="Subir imagen"
                      handleGalleryUpload={handleGalleryUpload}
                      preview={false}
                      inputs={inputs}
                    />
                  </div>
                </Card>
              </div>
              <div>
                <Card className="mt-2">
                  <div className="p-4">
                    <ProductsSelectorList dataset={raws} inputs={inputs} setInputs={setInputs} />
                  </div>
                </Card>
              </div>
          </div>        
          )
        }
        
      </div>
    </form>
  );
};

export default CSRProductFormComponent;
