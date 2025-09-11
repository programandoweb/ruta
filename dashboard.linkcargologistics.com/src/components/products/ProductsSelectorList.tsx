'use client';

import { useEffect, useState, Fragment } from 'react';
import { FaSave, FaTrashAlt } from 'react-icons/fa';
import { NextPage } from 'next';
import SelectField from '@/components/fields/SelectField';
import InputField from '@/components/fields/InputField';
import useFormData from '@/hooks/useFormDataNew';
import { formatearMonto } from '@/utils/fuctions';

interface Props {
  dataset: any;
  setInputs: any;
  inputs: any;
}

const prefixed = 'product';

const ProductsSelectorList: NextPage<Props> = ({ dataset, inputs, setInputs }) => {
  const formData = useFormData(false, false, false);
  const [showFields, setShowFields] = useState(false);
  
  if (!dataset.map) return null;

  const productOptions = dataset
    .map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
    .sort((a: any, b: any) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (inputs.product_id) {
      const selected = dataset.find((item: any) => item.id === parseInt(inputs.product_id));
      if (selected) {
        setInputs((prev: any) => ({
          ...prev,
          avg_cost: selected.avg_cost,
          unit_name: selected.unit?.name,
          unit_id: selected.unit?.id,
          inventory_item_id:selected.id
        }));
      }
      setShowFields(true);
    }
  }, [inputs.product_id]);

  useEffect(() => {
    const qty = parseFloat(inputs.qty) || 0;
    const cost = parseFloat(inputs.avg_cost) || 0;
    const total = qty * cost;
    setInputs((prev: any) => ({ ...prev, total: total.toFixed(2) }));
  }, [inputs.qty, inputs.avg_cost]);

  const onSubmit = () => {
    formData
      .handleRequest(`${formData.backend + location.pathname}/add_product`, 'post', { ...inputs, product_id:inputs?.product_id_new })
      .then((res: any) => {
        if (res?.items) setInputs((prev: any) => ({
          ...prev,
          items:res.items
        }));
      });
  };

  const onDelete = (id: number) => {
    formData
      .handleRequest(`${formData.backend}/dashboard/recipes/delete_product/${id}`, 'delete')
      .then((res: any) => {
        if (res?.items) setInputs((prev: any) => ({
          ...prev,
          items:res.items
        }));
      });
  };

  
  useEffect(() => {
    // Recalcular total gastos cada vez que cambien los items
    const totalGastos =
      inputs?.items?.reduce((acc: number, item: any) => {
        const qty = parseFloat(item?.qty) || 0;
        const cost = parseFloat(item?.inventory_item?.avg_cost) || 0;
        return acc + qty * cost;
      }, 0) || 0;

    // Actualizar en el padre el campo cost
    setInputs((prev: any) => ({
      ...prev,
      cost: totalGastos.toFixed(2), // ← se guarda como número con 2 decimales
    }));
  }, [inputs?.items]);


  return (
    <Fragment>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-4">
          <SelectField
            prefixed={prefixed}
            name="product_id"
            variant="autenticación"
            extra="mb-0"
            label="Selecciona un producto"
            defaultValue={inputs.product_id || ''}
            options={productOptions}
            setInputs={setInputs}
          />

          {showFields && (
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-xl"
              title="Guardar"
              onClick={onSubmit}
            >
              <FaSave className="mt-6 h-6 w-6" />
            </button>
          )}
        </div>

        {showFields && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              required
              prefixed={prefixed}
              name="qty"
              variant="autenticación"
              extra="mb-0"
              label={`Cantidad ${inputs.unit_name || ''}`}
              placeholder={`Cantidad ${inputs.unit_name || ''}`}
              type="number"
              defaultValue={inputs.qty}
              setInputs={setInputs}
            />

            <InputField
              disabled
              prefixed={prefixed}
              name="unit_price"
              variant="autenticación"
              extra="mb-0"
              label="Costo"
              type="text"
              defaultValue={`$${parseFloat(inputs.avg_cost || 0).toLocaleString('es-CO')}`}
            />

            <InputField
              disabled
              prefixed={prefixed}
              name="total"
              variant="autenticación"
              extra="mb-0"
              label="Total"
              type="text"
              defaultValue={`$${parseFloat(inputs.total || 0).toLocaleString('es-CO')}`}
            />
          </div>
        )}

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border-b">Producto</th>
              <th className="px-4 py-2 border-b text-center">Cantidad</th>
              <th className="px-4 py-2 border-b text-right">Costo unitario</th>
              <th className="px-4 py-2 border-b text-right">Total</th>
              <th className="px-4 py-2 border-b text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {inputs?.items?.map((item: any, index: number) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item?.inventory_item?.name || '—'}</td>
                <td className="px-4 py-2 border-b text-center">
                    {(parseFloat(item?.qty) || 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  $ {formatearMonto(parseFloat(item?.inventory_item?.avg_cost) || 0)}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  $ {formatearMonto((parseFloat(item?.qty) || 0) * (parseFloat(item?.inventory_item?.avg_cost) || 0))}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    type='button'
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}

            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2 text-right" colSpan={3}>
                Precio de venta:
              </td>
              <td className="px-4 py-2 text-right border-t">
                $ {formatearMonto(parseFloat(inputs.price) || 0)}
              </td>
              <td className="border-t"></td>
            </tr>

            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2 text-right" colSpan={3}>
                Total gastos:
              </td>
              <td className="px-4 py-2 text-right border-t">
                $ {
                  formatearMonto(
                    inputs?.items?.reduce((acc: number, item: any) => {
                      const qty = parseFloat(item?.qty) || 0;
                      const cost = parseFloat(item?.inventory_item?.avg_cost) || 0;
                      return acc + qty * cost;
                    }, 0) || 0
                  )
                }
              </td>
              <td className="border-t"></td>
            </tr>

            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2 text-right" colSpan={3}>
                Ganancia neta:
              </td>
              <td className="px-4 py-2 text-right border-t">
                $ {
                  formatearMonto(
                    (() => {
                      const totalGastos = inputs?.items?.reduce((acc: number, item: any) => {
                        const qty = parseFloat(item?.qty) || 0;
                        const cost = parseFloat(item?.inventory_item?.avg_cost) || 0;
                        return acc + qty * cost;
                      }, 0) || 0;

                      const price = parseFloat(inputs?.price) || 0;
                      const netProfit = price - totalGastos;

                      return netProfit;
                    })()
                  )
                }
              </td>
              <td className="border-t"></td>
            </tr>
            
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2 text-right" colSpan={3}>
                % de ganancia:
              </td>
              <td className="px-4 py-2 text-right border-t">
                {
                  (() => {
                    const totalGastos = inputs?.items?.reduce((acc: number, item: any) => {
                      const qty = parseFloat(item?.qty) || 0;
                      const cost = parseFloat(item?.inventory_item?.avg_cost) || 0;
                      return acc + qty * cost;
                    }, 0) || 0;

                    const price = parseFloat(inputs?.price) || 0;
                    const netProfit = price - totalGastos;

                    return totalGastos > 0 ? ((netProfit / totalGastos) * 100).toFixed(2) + ' %' : '—';
                  })()
                }
              </td>
              <td className="border-t"></td>
            </tr>


          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ProductsSelectorList;
