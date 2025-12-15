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
import useFormData from '@/hooks/useFormDataNew';
import Card from '@/components/card';
import { FaCheckCircle, FaClock, FaUser, FaBox, FaCalendarAlt, FaListUl } from 'react-icons/fa';

interface SubProcess {
  id: number;
  subproceso_name: string;
  finalizado_en: string | null;
  asignado_a_id: number | null;
  item?: {
    variant_name?: string;
    quantity?: number;
    status?: string;
  };
}

interface Process {
  id: number;
  subproceso_name: string;
  finalizado_en: string | null;
  asignado_a_id: number | null;
  children?: SubProcess[];
}

const CSRQRDiciembre: React.FC = () => {
  const formData = useFormData(false, false, false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();
  const id = params.get('id'); // /dashboard/qr?id=7

  const getInit = async () => {
    if (!id) return;
    setLoading(true);
    const res = await formData.handleRequest(`${formData.backend}/open/production-order/${id}`, 'get');
    if (res) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    getInit();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Cargando datos...</div>;
  if (!data) return <div className="p-6 text-center text-red-500">No se encontraron datos</div>;

  const batch = data?.batches?.[0];
  const steps: Process[] = data?.steps_all || [];

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-700">Resumen de Producción</h2>
        <div className="text-gray-500 text-sm">Orden #{batch?.id}</div>
      </div>

      {/* Información general */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-gray-700">
          <div className="flex items-center gap-2">
            <FaBox className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Código de lote</div>
              <div className="font-semibold">{batch?.batch_code || '—'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaListUl className="text-green-600" />
            <div>
              <div className="text-xs text-gray-500">Cantidad total</div>
              <div className="font-semibold">{batch?.quantity || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            <div>
              <div className="text-xs text-gray-500">Creado</div>
              <div className="font-semibold">{batch?.created_at || '—'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Procesos principales */}
      {steps.map((step: Process, i: number) => {
        const progreso =
          step.children && step.children.length > 0
            ? Math.round(
                (step.children.filter((c) => c.finalizado_en).length / step.children.length) * 100
              )
            : step.finalizado_en
            ? 100
            : 0;

        const isComplete = progreso === 100;

        return (
          <Card key={i} className="bg-white border border-gray-200">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-t-lg">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                {isComplete ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaClock className="text-yellow-500" />
                )}
                {step.subproceso_name}
              </span>
              <span className="text-xs text-gray-500">{progreso}%</span>
            </div>

            <div className="p-4 space-y-3">
              {step.children && step.children.length > 0 ? (
                step.children.map((sub: SubProcess, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg ${
                      sub.finalizado_en ? 'bg-green-50 border-green-300' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-sm">
                          {sub.subproceso_name}
                        </span>
                        {sub.item?.variant_name && (
                          <span className="text-xs text-gray-500">
                            Variante: <b>{sub.item.variant_name}</b> — Cantidad:{' '}
                            {sub.item.quantity} ({sub.item.status})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {sub.finalizado_en ? (
                          <span className="text-green-600 font-semibold">
                            ✔ {sub.finalizado_en}
                          </span>
                        ) : (
                          <span className="text-gray-400">Pendiente</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">Sin subprocesos asociados</div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CSRQRDiciembre;
