'use client';

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

type StatusResponse = {
  status: 'open' | 'closed';
  shift: { id: number } | null;
  summary?: {
    opening_amount: number;
    ingresos: number;
    egresos: number;
    saldo_esperado: number;
  };
};

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const CSRCash: React.FC = () => {
  const formData = useFormData(false, false, false);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');

  const [opening, setOpening] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [saldo, setSaldo] = useState(0);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const lastUpdated = useRef<Date | null>(null);

  const neto = useMemo(() => ingresos - egresos + opening, [ingresos, egresos, opening]);

  const fetchStatus = async () => {
    setError('');
    setFetching(true);
    try {
      const res = (await formData.handleRequest(
        formData.backend + '/dashboard/cash/status',
        'get'
      )) as StatusResponse;

      if (!res || !res.status) {
        setStatus('unknown');
        return;
      }

      setStatus(res.status);

      if (res.status === 'open' && res.summary) {
        setOpening(Number(res.summary.opening_amount || 0));
        setIngresos(Number(res.summary.ingresos || 0));
        setEgresos(Number(res.summary.egresos || 0));
        setSaldo(Number(res.summary.saldo_esperado || 0));
      } else {
        // caja cerrada: reset
        setOpening(0);
        setIngresos(0);
        setEgresos(0);
        setSaldo(0);
      }

      lastUpdated.current = new Date();
    } catch (e: any) {
      setError(e?.message || 'No se pudo consultar el estado de caja.');
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // auto refresh cada 20s
    const t = setInterval(() => {
      if (autoRefresh) fetchStatus();
    }, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              status === 'open'
                ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'
                : status === 'closed'
                ? 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300',
            ].join(' ')}
          >
            {status === 'unknown' ? 'Cargando…' : status === 'open' ? 'Caja abierta' : 'Caja cerrada'}
          </span>

          {lastUpdated.current && (
            <span className="text-gray-500 dark:text-gray-300">
              • Actualizado: {lastUpdated.current.toLocaleTimeString()}
            </span>
          )}
          {error && (
            <span className="text-red-600 text-sm">• {error}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Auto-refresh
          </label>
          <button
            onClick={fetchStatus}
            disabled={fetching}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <FiRefreshCw className={fetching ? 'animate-spin' : ''} />
            Refrescar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-2 grid h-full grid-cols-1 gap-5 md:grid-cols-3">
        {/* Saldo inicial */}
        <Card className="p-0">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-80">Saldo inicial</span>
              <FiDollarSign className="text-2xl" />
            </div>
            <p className="mt-3 text-2xl font-bold">{loading ? '—' : peso(opening)}</p>
          </div>
        </Card>

        {/* Ingresos */}
        <Card className="p-0">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-80">Ingresos</span>
              <FiTrendingUp className="text-2xl" />
            </div>
            <p className="mt-3 text-2xl font-bold">{loading ? '—' : peso(ingresos)}</p>
          </div>
        </Card>

        {/* Egresos */}
        <Card className="p-0">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium opacity-80">Egresos</span>
              <FiTrendingDown className="text-2xl" />
            </div>
            <p className="mt-3 text-2xl font-bold">{loading ? '—' : peso(egresos)}</p>
          </div>
        </Card>

        {/* Saldo actual */}
        <Card className="col-span-1 md:col-span-3">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Saldo actual</h2>
              <FiDollarSign className="text-green-600 text-2xl" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-green-600">
              {loading ? '—' : peso(saldo || neto)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {status === 'open'
                ? 'Esperado según movimientos del turno'
                : 'Caja cerrada: neto = ingresos - egresos (+ apertura si aplica)'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CSRCash;
