'use client';

import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import useFormData from '@/hooks/useFormDataNew';
import { useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiLogOut, FiCalendar, FiHash, FiRefreshCw } from 'react-icons/fi';

type ZTotals = {
  ingresos: number;
  egresos: number;
  neto: number;
  opening_amount?: number;
  saldo_esperado?: number;
  closing_amount_real?: number;
  diferencia?: number;
};

type Range = { from: string; to: string };

type ReportZ = {
  range: Range;
  totals: ZTotals;
  by_method: Record<string, { ingresos: number; egresos: number }>;
  shift?: { id: number; opened_at?: string; closed_at?: string | null };
};

type Movement = {
  id: number;
  amount: number;
  type: 'apertura' | 'ingreso' | 'egreso' | 'cierre';
  reference?: string | null; // "safe_drop"
  created_at?: string;
};

type Paginated<T> = { data: T[]; total: number; per_page: number; current_page: number };

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);

const CSRCashReportZ: React.FC = () => {
  const formData = useFormData(false, false, false);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<ReportZ | null>(null);
  const [safeDrops, setSafeDrops] = useState<Paginated<Movement> | null>(null);

  // Filtros opcionales
  const [shiftId, setShiftId] = useState<string>(''); // si lo llenas, consulta por turno
  const [date, setDate] = useState<string>(''); // YYYY-MM-DD para consultar por fecha

  const ventasTotales = useMemo(() => Number(report?.totals?.ingresos || 0), [report]);
  // Efectivo en caja: usamos saldo_esperado cuando el reporte viene por turno; si no, neto
  const efectivoCaja = useMemo(
    () => Number(report?.totals?.saldo_esperado ?? report?.totals?.neto ?? 0),
    [report]
  );
  const totalRetiros = useMemo(
    () => (safeDrops?.data || []).reduce((acc, m) => acc + (Number(m.amount) || 0), 0),
    [safeDrops]
  );

  const fetchReportZ = async () => {
    setError('');
    setFetching(true);
    try {
      const params = shiftId
        ? `?shift_id=${encodeURIComponent(shiftId)}`
        : date
        ? `?date=${encodeURIComponent(date)}`
        : '';
      const res: any = await formData.handleRequest(formData.backend + `/dashboard/cash/report-z${params}`, 'get');
      setReport(res as ReportZ);
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar el Reporte Z.');
    } finally {
      setFetching(false);
    }
  };

  const fetchSafeDrops = async () => {
    try {
      const qs = new URLSearchParams({ type: 'egreso', q: 'safe_drop', per_page: '100' }).toString();
      const res: any = await formData.handleRequest(formData.backend + `/dashboard/cash/movements?${qs}`, 'get');
      setSafeDrops(res?.movements || { data: [], total: 0, per_page: 100, current_page: 1 });
    } catch {
      // no romper la UI si falla esta consulta
      setSafeDrops({ data: [], total: 0, per_page: 100, current_page: 1 });
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchReportZ();
      await fetchSafeDrops();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <div className="h-12">
        <BtnBack back />
      </div>

      {/* Filtros */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Turno (shift_id)</label>
              <div className="relative">
                <FiHash className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                  placeholder="Ej. 42"
                  className="pl-10 flex h-11 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blueSecondary dark:bg-navy-800 dark:border-white/10 dark:text-white"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Fecha (YYYY-MM-DD)</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 flex h-11 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blueSecondary dark:bg-navy-800 dark:border-white/10 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Si especificas turno, se ignora la fecha.
              </p>
            </div>
            <div className="md:col-span-1 flex gap-2">
              <button
                onClick={fetchReportZ}
                disabled={fetching}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <FiRefreshCw /> {fetching ? 'Cargando…' : 'Generar Z'}
              </button>
              <button
                onClick={fetchSafeDrops}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-gray-100"
              >
                <FiRefreshCw /> Retiros
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {report?.range && (
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-3">
              Rango: <strong>{new Date(report.range.from).toLocaleString()}</strong> —{' '}
              <strong>{new Date(report.range.to).toLocaleString()}</strong>
            </p>
          )}
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ventas Totales */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-bold">Ventas Totales</h3>
            <p className="text-2xl font-extrabold text-green-600 mt-2">
              {loading ? '—' : peso(ventasTotales)}
            </p>
          </div>
        </Card>

        {/* Efectivo en Caja (esperado si hay turno; si es por fecha, usa neto) */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-indigo-500 mb-2" />
            <h3 className="text-lg font-bold">
              {report?.shift ? 'Efectivo Esperado en Caja' : 'Neto (Ingresos - Egresos)'}
            </h3>
            <p className="text-2xl font-extrabold text-indigo-600 mt-2">
              {loading ? '—' : peso(efectivoCaja)}
            </p>
          </div>
        </Card>

        {/* Retiros a Bóveda */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogOut className="text-4xl text-red-500 mb-2" />
            <h3 className="text-lg font-bold">Retiros a Bóveda</h3>
            <p className="text-2xl font-extrabold text-red-600 mt-2">
              {loading ? '—' : peso(totalRetiros)}
            </p>
          </div>
        </Card>
      </div>

      {/* Detalle por método */}
      {report?.by_method && Object.keys(report.by_method).length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Detalle por método de pago</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Método</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Ingresos</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Egresos</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-navy-800">
                  {Object.entries(report.by_method).map(([method, vals]) => {
                    const neto = (vals?.ingresos || 0) - (vals?.egresos || 0);
                    return (
                      <tr key={method}>
                        <td className="px-4 py-3 text-sm capitalize">{method || '—'}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">{peso(vals.ingresos)}</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">{peso(vals.egresos)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">{peso(neto)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {report?.shift && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="text-sm">
                  <div className="text-gray-500 dark:text-gray-300">Apertura</div>
                  <div className="font-semibold">{peso(report.totals.opening_amount)}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 dark:text-gray-300">Esperado</div>
                  <div className="font-semibold">{peso(report.totals.saldo_esperado)}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 dark:text-gray-300">Cierre Real</div>
                  <div className="font-semibold">{peso(report.totals.closing_amount_real)}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 dark:text-gray-300">Diferencia</div>
                  <div
                    className={[
                      'font-semibold',
                      (report.totals.diferencia ?? 0) === 0
                        ? 'text-gray-700'
                        : (report.totals.diferencia ?? 0) > 0
                        ? 'text-green-600'
                        : 'text-red-600',
                    ].join(' ')}
                  >
                    {peso(report.totals.diferencia)}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-300 mt-3">
              Fuente: <code>/dashboard/cash/report-z</code> y retiros desde <code>/dashboard/cash/movements?type=egreso&q=safe_drop</code>.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CSRCashReportZ;
