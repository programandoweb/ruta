'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import SelectField from '@/components/fields/SelectField';
import useFormData from '@/hooks/useFormDataNew';
import { FaUser, FaCalendarAlt, FaClock, FaUserTie, FaStickyNote } from 'react-icons/fa';
import ProductsSelectorList from '@/components/products/ProductsSelectorList';

const prefixed = 'attention';

const CSRAttention: React.FC = () => {
  const [inputs, setInputs] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [statusOptions] = useState([

    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Atendida', value: 'atendida' },
    { label: 'Cancelada', value: 'cancelada' },
  ]);

  const router = useRouter();
  const params = useSearchParams();
  const formData = useFormData(false, false, false);

  const slotId = params.get('slot_id');

  useEffect(() => {
    const getInit = async () => {
      if (!slotId) return;

      const res = await formData.handleRequest(`${formData.backend}/dashboard/calendar_slots/${slotId}`, 'get');
      if (res?.slot) {
        setInputs(res.slot);
      }
      if (res?.products) {
        setProducts(res.products);
      }
    };

    getInit();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.handleRequest(
      `${formData.backend}/dashboard/calendar_slots/${inputs.id}/update_attention`,
      'put',
      { status: inputs.status, notes: inputs.notes }
    ).then((res: any) => {
      if (res) router.back();
    });
  };



  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Card className="mt-2">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <div className="flex items-center gap-3 border p-3 rounded shadow bg-white">
              <FaUser className="text-pink-500 text-xl" />
              <div>
                <div className="text-xs font-semibold text-gray-500">Cliente</div>
                <div className="text-sm font-bold">{inputs.client?.name || 'Sin cliente'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 border p-3 rounded shadow bg-white">
              <FaUserTie className="text-blue-500 text-xl" />
              <div>
                <div className="text-xs font-semibold text-gray-500">Empleado</div>
                <div className="text-sm font-bold">{inputs.employee?.name || 'Sin empleado'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 border p-3 rounded shadow bg-white">
              <FaCalendarAlt className="text-green-500 text-xl" />
              <div>
                <div className="text-xs font-semibold text-gray-500">Fecha</div>
                <div className="text-sm font-bold">
                  {inputs.date ? new Date(inputs.date).toLocaleDateString('es-ES') : 'Sin fecha'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border p-3 rounded shadow bg-white">
              <FaClock className="text-yellow-500 text-xl" />
              <div>
                <div className="text-xs font-semibold text-gray-500">Hora</div>
                <div className="text-sm font-bold">{inputs.start_time?.slice(0, 5) || 'Sin hora'}</div>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="mt-2">
            <div className="p-6 grid grid-cols-1 gap-4">
              <SelectField
                required
                prefixed={prefixed}
                name="status"
                variant="autenticación"
                extra="mb-0"
                label="Estado de la cita"
                defaultValue={inputs.status || ''}  // ← usa value en lugar de defaultValue
                options={statusOptions}
                setInputs={setInputs}
              />


              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-2">
                  <FaStickyNote className="text-purple-500" /> Resumen de la atención
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={6}
                  className="w-full border rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Escribe aquí un resumen de la atención..."
                  value={inputs.notes || ''}
                  onChange={(e) => setInputs((prev: any) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          </Card>
          <Card className="mt-2">
            <div className="p-6 grid grid-cols-1 gap-4">
              <ProductsSelectorList dataset={products} inputs={inputs} setInputs={setInputs} />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default CSRAttention;
