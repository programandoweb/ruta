'use client'

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
import { useSearchParams } from 'next/navigation';
import Card from '@/components/card';
import {
  FaBox,
  FaMapMarkerAlt,
  FaUser,
  FaWeightHanging,
  FaDollarSign,
} from 'react-icons/fa';
import useUserHook from '@/hooks/useUserHook';
import Link from 'next/link';
import useFormData from '@/hooks/useFormDataNew';

/* ---------------------------------------------------
   ORDEN MAESTRO DE ESTADOS (UI)
--------------------------------------------------- */
const STATUS_FLOW = [
  'Recolecta',
  'En Bodega',
  'Rumbo a Aduana',
  'Ingreso a México',
  'Estafeta o Paquete Express',
  'Entregado',
];

interface CSRQRProps {
  dataset: any | null;
}

const CSRQR: React.FC<CSRQRProps> = ({ dataset }) => {
  const formData = useFormData(false, false, false);
  const { user } = useUserHook();
  const params = useSearchParams();

  const [data, setData] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ---------------------------------------------------
     Obtener estados actuales desde backend
  --------------------------------------------------- */
  const getInit = async () => {
    const rawUrl = params.get('url');
    if (!rawUrl) return;

    const url = new URL(rawUrl);
    const guideNumber = url.searchParams.get('guideNumber');
    if (!guideNumber) return;

    const statusUrl = `${url.origin}/api/v1/packages/${guideNumber}/status?per_page=8&pathname=/`;

    const response = await formData.handleRequest(statusUrl);
    if (response) setInputs(response);
  };

  /* ---------------------------------------------------
     Disparar actualización de estado (ROL → BACKEND)
  --------------------------------------------------- */
  const handleUpdateStatus = async () => {
    if (!data?.id) return;

    const confirm = window.confirm(
      '¿Deseas actualizar el estado del envío según tu rol?'
    );
    if (!confirm) return;

    try {
      setUpdatingStatus(true);

      await formData.handleRequest(
        `${formData.backend}/packages/${data.id}`,
        'get'
      );

      await getInit();
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ---------------------------------------------------
     Init SSR
  --------------------------------------------------- */
  useEffect(() => {
    if (dataset?.package) {
      setData(dataset.package);
      getInit();
    }
    setLoading(false);
  }, [params]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Cargando…</div>;
  }

  if (!user?.id) {
    return (
      <div className="p-6 text-center">
        <Link href="/auth" className="text-white bg-brand-500 px-4 py-2 rounded">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-center text-red-500">Guía no encontrada</div>;
  }

  const item = data.items?.[0];
  const totals = data.cost_price?.[0];

  const completedStatuses = new Set(
    inputs?.statuses?.map((s: any) => s.name)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button
        type='button'
        disabled={updatingStatus}
        onClick={handleUpdateStatus}
        className="
          w-full
          px-4 py-2 text-sm font-semibold rounded-md
          bg-brand-500 text-white
          hover:bg-brand-600
          disabled:opacity-60
          transition
        "
      >
        {updatingStatus ? 'Actualizando…' : 'Actualizar estado'}
      </button>

      {/* =========================
          GUÍA
      ========================= */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FaBox className="text-blue-600" />
          <h2 className="text-lg font-semibold">Guía de Transporte</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Guía</span>
            <div className="font-medium">{data.guideNumber}</div>
          </div>

          <div>
            <span className="text-gray-500">Empresa</span>
            <div className="font-medium">{data.company?.name}</div>
          </div>

          <div>
            <span className="text-gray-500">Destino</span>
            <div className="font-medium">
              {data.state} – {data.city}
            </div>
          </div>
        </div>
      </Card>

      {/* =========================
          DIRECCIONES
      ========================= */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FaMapMarkerAlt className="text-green-600" />
          <h2 className="text-lg font-semibold">Direcciones</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Origen</span>
            <div className="font-medium">{data.output_address}</div>
          </div>

          <div>
            <span className="text-gray-500">Destino</span>
            <div className="font-medium">{data.delivery_address}</div>
          </div>
        </div>
      </Card>

      {/* =========================
          PERSONAS
      ========================= */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FaUser className="text-purple-600" />
          <h2 className="text-lg font-semibold">Remitente / Destinatario</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Remitente</span>
            <div className="font-medium">{data.name_sender}</div>
          </div>

          <div>
            <span className="text-gray-500">Destinatario</span>
            <div className="font-medium">{data.name_receives}</div>
          </div>
        </div>
      </Card>

      {/* =========================
          PAQUETE
      ========================= */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FaWeightHanging className="text-amber-600" />
          <h2 className="text-lg font-semibold">Detalle del Paquete</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Contenido</span>
            <div className="font-medium">{item?.content}</div>
          </div>

          <div>
            <span className="text-gray-500">Peso</span>
            <div className="font-medium">{item?.weight} lb</div>
          </div>

          <div>
            <span className="text-gray-500">Medidas</span>
            <div className="font-medium">{item?.size}</div>
          </div>
        </div>
      </Card>

      {/* =========================
          COSTOS
      ========================= */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FaDollarSign className="text-green-600" />
          <h2 className="text-lg font-semibold">Totales</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Costo</span>
            <div className="font-medium">${totals?.total_cost}</div>
          </div>

          <div>
            <span className="text-gray-500">Precio</span>
            <div className="font-medium">${totals?.total_price}</div>
          </div>

          <div>
            <span className="text-gray-500">Seguro</span>
            <div className="font-medium">${totals?.insurance}</div>
          </div>
        </div>
      </Card>

      {/* =========================
          ESTADOS (TRACKING)
      ========================= */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBox className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Seguimiento del Envío</h2>
          </div>

          
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 text-center">
          {STATUS_FLOW.map((status) => {
            const isCompleted = completedStatuses.has(status);

            return (
              <div key={status} className="flex flex-col items-center gap-2">
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-full
                    ${isCompleted ? 'bg-brand-500' : 'bg-gray-300'}
                  `}
                >
                  <FaBox className="text-white" />
                </div>

                <span
                  className={`text-xs font-semibold uppercase tracking-wide
                    ${isCompleted ? 'text-brand-500' : 'text-gray-400'}
                  `}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

export default CSRQR;
