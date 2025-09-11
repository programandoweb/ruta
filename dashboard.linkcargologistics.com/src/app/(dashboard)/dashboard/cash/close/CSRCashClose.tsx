'use client';

import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import TextArea from '@/components/fields/TextArea';
import useFormData from '@/hooks/useFormDataNew';

import { useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiLogIn, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);

const CSRCashCloseForm: React.FC = () => {
  const router = useRouter();
  const formData = useFormData(false, false, false);

  // Estado de backend
  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');
  const [summary, setSummary] = useState<{
    opening_amount: number;
    ingresos: number;
    egresos: number;
    saldo_esperado: number;
  } | null>(null);

  // Form inputs
  const [inputs, setInputs] = useState<any>({
    closing_amount_real: '',
    note: '',
  });

  const [loading, setLoading] = useState(false);

  const isOpen = useMemo(() => status === 'open', [status]);
  const diff = useMemo(() => {
    const real = Number(inputs.closing_amount_real || 0);
    const exp = Number(summary?.saldo_esperado || 0);
    return real - exp;
  }, [inputs.closing_amount_real, summary?.saldo_esperado]);

  const getInit = () => {
    setLoading(true);
    formData
      .handleRequest(formData.backend + '/dashboard/cash/status', 'get')
      .then((response: any) => {
        // response: { status: 'open'|'closed', shift, summary }
        if (response?.status === 'open') {
          setStatus('open');
          setSummary(response?.summary ?? null);
        } else if (response?.status === 'closed') {
          setStatus('closed');
          setSummary(null);
        } else {
          setStatus('unknown');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!isOpen || loading) return;

    setLoading(true);
    formData
      .handleRequest(formData.backend + '/dashboard/cash/close', 'post', {
        closing_amount_real: Number(inputs.closing_amount_real || 0),
        // Nota: el backend que compartiste no recibe 'note' en close().
        // Si luego lo agregas, envíalo aquí.
      })
      .then((response: any) => {
        // Puedes redirigir al resumen de caja o mostrar el resultado del cierre
        router.replace('/dashboard/cash'); // Ajusta a tu ruta principal de caja
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-3">
        {/* Ingresos */}
        <Card className="mt-2">
          <div className="p-6 flex flex-col items-center">
            <FiLogIn className="text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-bold">Ingresos</h3>
            <p className="text-2xl font-extrabold text-green-600 mt-2">
              {loading ? '—' : peso(summary?.ingresos)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Incluye ventas y otros ingresos</p>
          </div>
        </Card>

        {/* Egresos */}
        <Card className="mt-2">
          <div className="p-6 flex flex-col items-center">
            <FiLogOut className="text-4xl text-red-500 mb-2" />
            <h3 className="text-lg font-bold">Egresos</h3>
            <p className="text-2xl font-extrabold text-red-600 mt-2">
              {loading ? '—' : peso(summary?.egresos)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Gastos, safe drops, devoluciones</p>
          </div>
        </Card>

        {/* Saldo esperado */}
        <Card className="mt-2">
          <div className="p-6 flex flex-col items-center">
            <FiDollarSign className="text-4xl text-indigo-500 mb-2" />
            <h3 className="text-lg font-bold">Saldo esperado</h3>
            <p className="text-2xl font-extrabold text-indigo-600 mt-2">
              {loading ? '—' : peso(summary?.saldo_esperado)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              Fondo + ingresos - egresos
            </p>
          </div>
        </Card>
      </div>

      {/* Detalle y acción de cierre */}
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Resumen adicional */}
        <Card className="mt-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen del turno</h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-300">Saldo inicial</p>
                <p className="font-semibold">{loading ? '—' : peso(summary?.opening_amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-300">Ingresos</p>
                <p className="font-semibold">{loading ? '—' : peso(summary?.ingresos)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-300">Egresos</p>
                <p className="font-semibold">{loading ? '—' : peso(summary?.egresos)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-300">Esperado</p>
                <p className="font-semibold">{loading ? '—' : peso(summary?.saldo_esperado)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-100 dark:border-white/10 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Diferencia (Real - Esperado)</span>
                <span
                  className={[
                    'font-semibold',
                    diff === 0
                      ? 'text-gray-600 dark:text-gray-200'
                      : diff > 0
                      ? 'text-green-600'
                      : 'text-red-600',
                  ].join(' ')}
                >
                  {peso(diff)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Si hay diferencia, quedará reflejada al cerrar.
              </p>
            </div>
          </div>
        </Card>

        {/* Formulario de cierre */}
        <Card className="mt-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cierre de caja</h2>

            <div className="grid grid-cols-1 gap-4">
              <InputField
                required
                name="closing_amount_real"
                variant="autenticación"
                extra="mb-0"
                label="Saldo contado (real)"
                placeholder="Ingrese el total contado"
                id="closing_amount_real"
                type="number"
                defaultValue={inputs.closing_amount_real}
                setInputs={setInputs}
              />

              <TextArea
                name="note"
                variant="autenticación"
                extra="mb-0"
                label="Notas (opcional)"
                placeholder="Observaciones del cierre (ej. corte de billetes, diferencias explicadas)"
                id="note"
                defaultValue={inputs.note}
                setInputs={setInputs}
              />

              <button
                type="submit"
                disabled={!isOpen || loading}
                className={[
                  'mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                  !isOpen || loading
                    ? 'bg-gray-300 text-gray-600 dark:bg-white/10 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700',
                ].join(' ')}
              >
                <FiCheckCircle className="text-lg" />
                {loading ? 'Cerrando...' : !isOpen ? 'No hay caja abierta' : 'Cerrar caja'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default CSRCashCloseForm;
