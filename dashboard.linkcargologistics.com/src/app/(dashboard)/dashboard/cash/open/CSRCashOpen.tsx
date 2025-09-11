'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useMemo, useState } from 'react';
import InputField from '@/components/fields/InputField';
import TextArea from '@/components/fields/TextArea'; // si no tienes, cambia por tu InputField
import { useRouter } from 'next/navigation';

/**
 * Prefijo para mapear la respuesta del backend.
 * Ejemplo esperado del backend:
 *  GET /dashboard/cash/status => { status: "open"|"closed", shift: {...} }
 *  POST /dashboard/cash/open  => { shift: {...} }
 */
const prefixed = 'shift';

const CSRCashOpenForm: React.FC = () => {
  const router = useRouter();
  const formData = useFormData(false, false, false);

  const [inputs, setInputs] = useState<any>({
    opening_amount: 200000,
    note: '',
  });

  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');
  const [loading, setLoading] = useState<boolean>(false);

  const isOpen = useMemo(() => status === 'open', [status]);

  const getInit = () => {
    // Trae estado de caja
    formData
      .handleRequest(formData.backend + '/dashboard/cash/status', 'get')
      .then((response: any) => {
        // Puedes loggear para depurar: console.log(response)
        if (response?.status === 'open') {
          setStatus('open');
          if (response[prefixed]) {
            // si quieres mostrar datos del turno abierto, puedes guardarlos
            // setInputs((prev: any) => ({ ...prev, ...response[prefixed] }));
          }
        } else if (response?.status === 'closed') {
          setStatus('closed');
        } else {
          setStatus('unknown');
        }
      });
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (isOpen) return; // no permitir abrir si ya está abierta

    setLoading(true);
    formData
      .handleRequest(
        formData.backend + '/dashboard/cash/open',
        'post',
        { ...inputs }
      )
      .then((response: any) => {
        // Si todo bien, marca como abierta y navega o actualiza
        if (response && response[prefixed]) {
          setStatus('open');
          // redirige a la vista general de caja o refresca esta
          // router.replace('/dashboard/cash'); // opcional
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Tarjeta: Estado actual */}
        <Card className="mt-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Estado de caja</h2>

            <div className="flex items-center gap-3">
              <span
                className={[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                  isOpen
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'
                    : status === 'closed'
                    ? 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300',
                ].join(' ')}
              >
                {status === 'unknown' ? 'Cargando...' : isOpen ? 'Abierta' : 'Cerrada'}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
              {isOpen
                ? 'Ya hay un turno de caja abierto. Debes cerrarlo antes de abrir uno nuevo.'
                : 'No hay turno abierto. Configura el saldo inicial y abre la caja.'}
            </p>
          </div>
        </Card>

        {/* Tarjeta: Apertura */}
        <Card className="mt-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Apertura de turno</h2>

            <div className="grid grid-cols-1 gap-4">
              <InputField
                required
                prefixed={prefixed}
                name="opening_amount"
                variant="autenticación"
                extra="mb-0"
                label="Saldo inicial (efectivo)"
                placeholder="200000"
                id="opening_amount"
                type="number"
                defaultValue={inputs.opening_amount}
                setInputs={setInputs}
              />

              {/* Si no tienes TextArea, cambia por InputField con type="text" */}
              <TextArea
                prefixed={prefixed}
                name="note"
                variant="autenticación"
                extra="mb-0"
                label="Nota (opcional)"
                placeholder="Observaciones para la apertura"
                id="note"
                defaultValue={inputs.note}
                setInputs={setInputs}
              />

              <button
                type="submit"
                disabled={isOpen || loading}
                className={[
                  'mt-2 inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold',
                  isOpen || loading
                    ? 'bg-gray-300 text-gray-600 dark:bg-white/10 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700',
                ].join(' ')}
              >
                {loading ? 'Abriendo...' : isOpen ? 'Caja abierta' : 'Abrir caja'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default CSRCashOpenForm;
