'use client';

import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import useFormData from '@/hooks/useFormDataNew';
import { useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiLogIn, FiLogOut } from 'react-icons/fi';

type Shift = {
  id: number;
  opening_amount: number;
  closing_amount_expected?: number | null;
  closing_amount_real?: number | null;
  opened_at?: string | null;
  closed_at?: string | null;
};

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);

const CSRCashAudit: React.FC = () => {
  const formData = useFormData(false, false, false);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');
  const [shift, setShift] = useState<Shift | null>(null);

  // Totales de status
  const [opening, setOpening] = useState<number>(0);
  const [expected, setExpected] = useState<number>(0);

  // Datos Z (si aplica)
  const [real, setReal] = useState<number>(0);
  const [byMethod, setByMethod] = useState<Record<string, { ingresos: number; egresos: number }>>({});

  const diferencia = useMemo(() => (real || 0) - (expected || 0), [real, expected]);

  const fetchStatus = async () => {
    const res: any = await formData.handleRequest(formData.backend + '/dashboard/cash/status', 'get');
    if (res?.status === 'open') {
      setStatus('open');
      setShift(res?.shift || null);
      setOpening(Number(res?.summary?.opening_amount || 0));
      setExpected(Number(res?.summary?.saldo_esperado || 0));
      setReal(0);
      setByMethod({});
    } else if (res?.status === 'closed') {
      setStatus('closed');
      setShift(null);
      setOpening(0);
      setExpected(0);
      setReal(0);
      setByMethod({});
    } else {
      setStatus('unknown');
    }
  };

  // Si quieres auditar con reporte Z del turno abierto actual (o pasado con ?shift_id=…)
  const fetchReportZ = async (sid?: number) => {
    const url =
      formData.backend + '/dashboard/cash/report-z' + (sid ? `?shift_id=${sid}` : '');
    const res: any = await formData.handleRequest(url, 'get');
    // Cuando hay turno (o parámetro), el backend retorna totales + by_method + (opcional) shift
    if (res?.totals) {
      setOpening(Number(res?.totals?.opening_amount || 0));
      setExpected(Number(res?.totals?.saldo_esperado ?? res?.totals?.neto ?? 0));
      setReal(Number(res?.totals?.closing_amount_real || 0));
    }
    if (res?.by_method) setByMethod(res.by_method);
    if (res?.shift) setShift(res.shift);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchStatus();
      // Si quieres forzar auditoría con Z del turno abierto actual, descomenta:
      // if (status === 'open') await fetchReportZ(); // back ya infiere turno actual
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <div className="h-12">
        <BtnBack back />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Apertura */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogIn className="text-4xl text-indigo-500 mb-2" />
            <h3 className="text-lg font-bold">Apertura</h3>
            <p className="text-2xl font-extrabold text-indigo-600 mt-2">
              {loading ? '—' : peso(opening)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              {shift?.opened_at ? new Date(shift.opened_at).toLocaleString() : status === 'open' ? 'Turno abierto' : '—'}
            </p>
          </div>
        </Card>

        {/* Cierre esperado */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-bold">Cierre esperado</h3>
            <p className="text-2xl font-extrabold text-green-600 mt-2">
              {loading ? '—' : peso(expected)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              Calculado por movimientos del turno
            </p>
          </div>
        </Card>

        {/* Cierre real / Diferencia */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogOut className="text-4xl text-red-500 mb-2" />
            <h3 className="text-lg font-bold">Cierre real</h3>
            <p className="text-2xl font-extrabold text-red-600 mt-2">
              {loading ? '—' : real ? peso(real) : (status === 'open' ? '—' : 'No registrado')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              {status === 'open' ? 'Turno en curso' : (shift?.closed_at ? new Date(shift.closed_at).toLocaleString() : '—')}
            </p>
            {/* Diferencia si hay real */}
            {real > 0 && (
              <div className={`mt-3 text-sm font-semibold ${diferencia === 0 ? 'text-gray-600' : diferencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Diferencia: {peso(diferencia)}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Detalle por método (opcional con Report Z) */}
      {Object.keys(byMethod).length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Detalle por método de pago</h2>
              <button
                onClick={() => fetchReportZ(shift?.id)}
                className="inline-flex justify-center rounded-lg px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Refrescar Z
              </button>
            </div>

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
                  {Object.entries(byMethod).map(([method, vals]) => {
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

            <p className="text-xs text-gray-500 dark:text-gray-300 mt-3">
              Estos totales provienen de <code>/dashboard/cash/report-z</code>.
              Si el turno está abierto y aún no has registrado un cierre real, la diferencia se calcula en 0.
            </p>
          </div>
        </Card>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Auditar turno actual</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Consulta el reporte Z del turno en curso y re-calcula el esperado.
              </p>
            </div>
            <button
              onClick={() => fetchReportZ(shift?.id)}
              className="inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Generar Z
            </button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold mb-2">Estado</h3>
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
              {status === 'unknown' ? 'Cargando…' : status === 'open' ? 'Abierta' : 'Cerrada'}
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              {status === 'open'
                ? 'Para comparar con cierre real, primero cierra el turno desde la pantalla de cierre.'
                : 'Puedes consultar un turno pasado con Reporte Z por ID.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CSRCashAudit;
