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
import { FaUser, FaCalendarAlt, FaBox, FaListUl, FaUserTie, FaCheckCircle, FaClock } from 'react-icons/fa';

interface Step {
  proceso: string;
  subProcesos: string[];
}

interface ChecklistItem {
  subproceso_name: string;
  asignado_a: string;
  asignado_por: string;
  finalizado_en?: string;
}

const CSRQROLD: React.FC = () => {
  const formData = useFormData(false, false, false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
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

  const order = data[0] || data;
  const resume = order.resume || {};
  const steps: Step[] = resume.steps || [];
  const checklist: ChecklistItem[] = resume.checklist || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-700">Resumen de Producción</h2>
        <div className="text-gray-500 text-sm">Orden #{order.id}</div>
      </div>

      {/* Información general */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-gray-700">
          <div className="flex items-center gap-2">
            <FaBox className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Producto</div>
              <div className="font-semibold">{order.producto || '—'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaListUl className="text-green-600" />
            <div>
              <div className="text-xs text-gray-500">Cantidad</div>
              <div className="font-semibold">{order.cantidad || '—'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            <div>
              <div className="text-xs text-gray-500">Fecha</div>
              <div className="font-semibold">{order.fecha || '—'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Progreso de pasos */}
      <Card className="bg-white">
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center gap-2">
            <FaClock /> Proceso de Producción
          </h3>

          {steps.map((step, i) => {
  const completados = checklist.filter((c) => c.subproceso_name === step.proceso);
  const subCompletados = step.subProcesos.filter((sp) =>
    checklist.some((c) => c.subproceso_name === sp)
  );

  const totalSub = step.subProcesos.length;
  const progreso = totalSub ? Math.round((subCompletados.length / totalSub) * 100) : 100;
  const isComplete = progreso === 100;

  // 🔹 Extraer comentarios del dataset (por proceso y subprocesos)
  const commentsForStep = resume.comments?.[step.proceso] || [];
  const subComments = step.subProcesos.map((sp) => ({
    name: sp,
    comments: resume.comments?.[sp] || [],
  }));

  return (
    <div
      key={i}
      className="border border-gray-200 rounded-lg mb-4 overflow-hidden bg-gray-50"
    >
      <div className="flex justify-between items-center bg-gray-100 p-3">
        <span className="font-semibold text-gray-700 flex items-center gap-2">
          {isComplete ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaClock className="text-yellow-500" />
          )}
          {step.proceso}
        </span>
        <span className="text-xs text-gray-500">{progreso}%</span>
      </div>
      {
        step.subProcesos.length > 0 && (
              <div className="p-3 grid gap-2">
                {step.subProcesos.map((sub, key) => {
                  const item = checklist.find((c) => c.subproceso_name === sub);
                  return (
                    <div
                      key={key}
                      className={`flex flex-col border rounded p-2 ${
                        item ? 'bg-green-50 border-green-300' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold">{sub}</span>
                          {item?.asignado_a && (
                            <span className="text-xs text-gray-500">
                              Asignado a: {item.asignado_a}
                            </span>
                          )}
                        </div>
                        {item?.finalizado_en ? (
                          <span className="text-xs text-green-600 font-semibold">
                            ✔ {item.finalizado_en}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Pendiente</span>
                        )}
                      </div>

                      {/* 🔹 Comentarios del subproceso */}
                      {resume.comments?.[sub]?.length > 0 && (
                        <div className="mt-2 border-t pt-2">
                          {resume.comments[sub].map((comment: any) => (
                            <div
                              key={comment.id}
                              className="text-xs text-gray-600 border-l-2 border-blue-300 pl-2 mb-1"
                            >
                              <span className="block">
                                💬 <b>{comment.user}</b> — {comment.note}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {comment.created_at}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 🔹 Comentarios del proceso principal */}
            {commentsForStep.length > 0 && (
              <div className="px-4 py-2 border-t bg-white">
                {commentsForStep.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="text-sm text-gray-700 border-l-4 border-blue-300 pl-2 mb-1"
                  >
                    💬 <b>{comment.user}</b>: {comment.note}
                    <div className="text-[11px] text-gray-400">{comment.created_at}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

        </div>
      </Card>
    </div>
  );
};

export default CSRQROLD;
