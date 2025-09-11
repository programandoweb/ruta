'use client'

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFormData from '@/hooks/useFormDataNew';
import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';

const prefixed = 'material';

const RawMaterialFormComponent: React.FC<any> = (props) => {
  const router = useRouter();
  const formData = useFormData(false, false, false);

  const [user, setUser] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [categories	, setCategories] = useState<any[]>([]);
  const [raws, setRaws] = useState<any[]>([]);
  const [inputs, setInputs] = useState<any>({
    sku: '',
    name: '',
    base_unit_id: '',
    stock: '',
    avg_cost: '',
  });

  const getInit = () => {
    formData.handleRequest(formData.backend + location.pathname).then((res: any) => {
      if (res?.material) setInputs(res.material);
      if (res?.units) setUnits(res.units);
      if (res?.raws) setRaws(res.raws);
      if (res?.categories) setCategories(res.categories);
    });
  };

  useEffect(() => {
    getInit();

    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(formData.backend + location.pathname, inputs.id ? 'put' : 'post', inputs)
      .then((res: any) => {
        if (props?.params?.id === 'new') {
          router.replace('/dashboard/inventory/raw-materials/' + res?.material?.id);
        } else {
          router.replace('/dashboard/inventory/raw-materials');
        }
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="grid grid-cols-1 gap-5 mt-5">
        <Card className="mt-2">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <SelectField
              required
              prefixed={prefixed}
              name="inventory_categories_id"
              label="Categoría"
              id="inventory_categories_id"
              defaultValue={inputs.inventory_categories_id}
              setInputs={setInputs}
              options={categories.map((u) => ({ label: `${u.name}`, value: u.id }))}
            />
            <InputField
              required
              prefixed={prefixed}
              name="sku"
              label="Código SKU"
              id="sku"
              type="text"
              defaultValue={inputs.sku}
              setInputs={setInputs}
            />
            <InputField
              required
              prefixed={prefixed}
              name="name"
              label="Nombre del material"
              id="name"
              type="text"
              defaultValue={inputs.name}
              setInputs={setInputs}
            />
            <SelectField
              required
              prefixed={prefixed}
              name="base_unit_id"
              label="Unidad base"
              id="base_unit_id"
              defaultValue={inputs.base_unit_id}
              setInputs={setInputs}
              options={units.map((u) => ({ label: `${u.name} (${u.code})`, value: u.id }))}
            />
            <InputField
              required
              prefixed={prefixed}
              name="stock"
              label="Stock actual"
              id="stock"
              type="number"
              defaultValue={inputs.stock}
              setInputs={setInputs}
            />
            <InputField
              required
              prefixed={prefixed}
              name="avg_cost"
              label="Costo promedio"
              id="avg_cost"
              type="number"
              defaultValue={inputs.avg_cost}
              setInputs={setInputs}
            />
            
          </div>
        </Card>
      </div>
    </form>
  );
};

export default RawMaterialFormComponent;
