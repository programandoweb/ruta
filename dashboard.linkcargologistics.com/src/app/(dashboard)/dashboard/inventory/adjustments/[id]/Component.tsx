'use client';

import { useEffect, useState } from 'react';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import Card from '@/components/card';

const prefixed = 'adjustment';

const InventoryAdjustmentForm = () => {
  const formData = useFormData(false, false, false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [inputs, setInputs] = useState<any>({
    id: null,
    reference: '',
    movement_date: new Date().toISOString().substring(0, 10),
    note: '',
    items: [],
  });

  const [newItem, setNewItem] = useState<any>({
    product_id: '',
    quantity: '',
    location: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    formData.handleRequest(formData.backend + location.pathname).then((res: any) => {
      setProducts(res?.raws || []);
      if (res?.movement) {
        setInputs(res.movement);
      }
    });
  }, []);

  const isReadOnly = !!inputs.id;

  const handleAddItem = () => {
    if (!newItem.product_id || !newItem.quantity) return;
    setInputs({
      ...inputs,
      items: [...inputs.items, newItem],
    });
    setNewItem({
      product_id: '',
      quantity: '',
      location: '',
    });
  };

  const handleRemoveItem = (idx: number) => {
    const updated = [...inputs.items];
    updated.splice(idx, 1);
    setInputs({ ...inputs, items: updated });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isReadOnly) return;

    formData.handleRequest(formData.backend + location.pathname, 'post', {
      ...inputs,
      type: 'ajuste',
      user_id: user?.id,
    }).then(() => {
      setInputs({
        reference: '',
        movement_date: new Date().toISOString().substring(0, 10),
        note: '',
        items: [],
      });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save={!isReadOnly} />
      </div>

      <Card className="mb-4">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isReadOnly ? (
            <>
              <div>
                <label className="text-sm font-bold">Referencia</label>
                <div className="mt-1 text-sm">{inputs.reference}</div>
              </div>
              <div>
                <label className="text-sm font-bold">Fecha del ajuste</label>
                <div className="mt-1 text-sm">{inputs.movement_date}</div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold">Nota</label>
                <div className="mt-1 text-sm">{inputs.note || '---'}</div>
              </div>
            </>
          ) : (
            <>
              <InputField
                prefixed={prefixed}
                name="reference"
                id="reference"
                label="Referencia"
                type="text"
                defaultValue={inputs.reference}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="movement_date"
                id="movement_date"
                label="Fecha del ajuste"
                type="date"
                defaultValue={inputs.movement_date}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="note"
                id="note"
                label="Nota"
                type="text"
                defaultValue={inputs.note}
                setInputs={setInputs}
              />
            </>
          )}
        </div>
      </Card>

      {inputs.items?.length > 0 && (
        <Card className="mb-4">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Productos ajustados</h3>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Producto</th>
                  <th className="p-2 text-right">Cantidad</th>
                  <th className="p-2 text-left">Ubicación</th>
                  {!isReadOnly && <th className="p-2 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody>
                {inputs.items.map((item: any, idx: number) => {
                  const prod = item.product || products.find(p => p.id == item.product_id);
                  return (
                    <tr key={idx}>
                      <td className="p-2">{prod?.name || '---'}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2">{item.location}</td>
                      {!isReadOnly && (
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!isReadOnly && (
        <>
          <Card className="mb-4">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Agregar producto a ajustar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <SelectField
                  name="product_id"
                  label="Producto"
                  defaultValue={newItem.product_id}
                  options={products.map(p => ({ label: p.name, value: p.id }))}
                  setInputs={setNewItem}
                />
                <InputField
                  name="quantity"
                  label="Cantidad (use negativa para restar)"
                  type="number"
                  defaultValue={newItem.quantity}
                  setInputs={setNewItem}
                />
                <InputField
                  name="location"
                  label="Ubicación"
                  defaultValue={newItem.location}
                  setInputs={setNewItem}
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Agregar a la lista
              </button>
            </div>
          </Card>

          <div className="text-right">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Registrar ajuste
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default InventoryAdjustmentForm;
