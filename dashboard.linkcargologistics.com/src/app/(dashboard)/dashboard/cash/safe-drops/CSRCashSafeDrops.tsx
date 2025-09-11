'use client';

import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import useFormData from '@/hooks/useFormDataNew';
import InputField from '@/components/fields/InputField';
import TextArea from '@/components/fields/TextArea';
import { useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiLogOut, FiPlusCircle, FiRefreshCw } from 'react-icons/fi';

type Movement = {
  id: number;
  amount: number;
  type: 'apertura' | 'ingreso' | 'egreso' | 'cierre';
  method?: string | null;
  reference?: string | null; // esperamos 'safe_drop'
  note?: string | null;
  created_at?: string;
};

type Paginated<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
};

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const CSRCashSafeDrops: React.FC = () => {
  const formData = useFormData(false, false, false);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [movements, setMovements] = useState<Paginated<Movement> | null>(null);

  // formulario de retiro
  const [inputs, setInputs] = useState<any>({
    amount: 0,
    note: '',
  });

  const totalRetiros = useMemo(
    () => (movements?.data || []).reduce((acc, m) => acc + (Number(m.amount) || 0), 0),
    [movements]
  );
  const cantidadRetiros = useMemo(() => movements?.data?.length || 0, [movements]);

  const ultimo = useMemo(() => {
    if (!movements?.data?.length) return null;
    // vienen ordenados por id desc desde el backend; por si acaso, escogemos el primero
    return movements.data[0];
  }, [movements]);

  const fetchSafeDrops = async () => {
    try {
      setFetching(true);
      setError('');
      // Movimientos del turno abierto con type=egreso y texto 'safe_drop'
      const url =
        formData.backend + '/dashboard/cash/movements?type=egreso&q=safe_drop&per_page=50';
      const res: any = await formData.handleRequest(url, 'get');
      setMovements(res?.movements || { data: [], current_page: 1, per_page: 50, total: 0 });
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar los retiros.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchSafeDrops();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!inputs.amount || Number(inputs.amount) <= 0) return;

    try {
      setPosting(true);
      setError('');
      await formData.handleRequest(formData.backend + '/dashboard/cash/safe-drop', 'post', {
        amount: Number(inputs.amount),
        note: inputs.note || undefined,
      });
      // limpiar y recargar lista
      setInputs({ amount: 0, note: '' });
      await fetchSafeDrops();
    } catch (e: any) {
      setError(e?.message || 'No se pudo registrar el retiro.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="h-12">
        <BtnBack back />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total de retiros */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogOut className="text-4xl text-yellow-500 mb-2" />
            <h3 className="text-lg font-bold">Total Retiros</h3>
            <p className="text-2xl font-extrabold text-yellow-600 mt-2">
              {loading ? '—' : peso(totalRetiros)}
            </p>
          </div>
        </Card>

        {/* Cantidad de retiros */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-indigo-500 mb-2" />
            <h3 className="text-lg font-bold">Cantidad de Retiros</h3>
            <p className="text-2xl font-extrabold text-indigo-600 mt-2">
              {loading ? '—' : cantidadRetiros}
            </p>
          </div>
        </Card>

        {/* Último retiro */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-bold">Último Retiro</h3>
            <p className="text-base font-medium text-gray-500 dark:text-gray-300 mt-1">
              {loading
                ? '—'
                : ultimo
                ? `${new Date(ultimo.created_at || '').toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} - ${peso(ultimo.amount)}`
                : '—'}
            </p>
          </div>
        </Card>
      </div>

      {/* Formulario: registrar retiro */}
      <Card>
        <form onSubmit={onSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Registrar retiro a bóveda</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fetchSafeDrops}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-gray-100 disabled:opacity-60"
                  disabled={fetching}
                >
                  <FiRefreshCw />
                  Refrescar
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                required
                name="amount"
                label="Monto a retirar"
                id="amount"
                type="number"
                placeholder="100000"
                defaultValue={inputs.amount}
                setInputs={setInputs}
              />
              <TextArea
                name="note"
                label="Nota (opcional)"
                id="note"
                placeholder="Motivo del retiro"
                defaultValue={inputs.note}
                setInputs={setInputs}
              />
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={posting}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-60"
                >
                  <FiPlusCircle />
                  {posting ? 'Guardando…' : 'Registrar retiro'}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-300 mt-3">
              Se guarda como <code>egreso</code> con <code>reference=safe_drop</code> en el turno abierto.
            </p>
          </div>
        </form>
      </Card>

      {/* Tabla de retiros */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Retiros recientes</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Fecha / Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Nota
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-navy-800">
                {(movements?.data || []).map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 text-sm">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {m.note || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                      {peso(m.amount)}
                    </td>
                  </tr>
                ))}
                {!movements?.data?.length && !loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-300"
                    >
                      No hay retiros registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-300 mt-3">
            Fuente: <code>/dashboard/cash/movements?type=egreso&q=safe_drop</code>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CSRCashSafeDrops;
