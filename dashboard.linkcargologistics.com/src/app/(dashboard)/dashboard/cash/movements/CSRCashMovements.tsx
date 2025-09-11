'use client';

import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import useFormData from '@/hooks/useFormDataNew';

import { useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiLogIn, FiLogOut } from 'react-icons/fi';

type Movement = {
  id: number;
  type: 'apertura' | 'ingreso' | 'egreso' | 'cierre';
  method: string | null;
  amount: number;
  reference: string | null;
  note: string | null;
  created_at: string;
};

const peso = (n?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);

const CSRCashMovements: React.FC = () => {
  const formData = useFormData(false, false, false);

  // KPIs
  const [status, setStatus] = useState<'open' | 'closed' | 'unknown'>('unknown');
  const [ingresos, setIngresos] = useState<number>(0);
  const [egresos, setEgresos] = useState<number>(0);

  // Movimientos + paginación
  const [loading, setLoading] = useState<boolean>(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null>(null);

  // Filtros
  const [filters, setFilters] = useState<any>({
    type: '',    // apertura|ingreso|egreso|cierre
    method: '',  // efectivo|tarjeta|transferencia|safe_drop
    q: '',
    per_page: 15,
    page: 1,
  });

  const totalMovs = useMemo(() => pagination?.total ?? movements.length, [pagination, movements]);

  // Carga KPIs
  const fetchStatus = () => {
    formData.handleRequest(formData.backend + '/dashboard/cash/status', 'get').then((res: any) => {
      if (res?.status === 'open') {
        setStatus('open');
        setIngresos(Number(res?.summary?.ingresos || 0));
        setEgresos(Number(res?.summary?.egresos || 0));
      } else if (res?.status === 'closed') {
        setStatus('closed');
        setIngresos(0);
        setEgresos(0);
      } else {
        setStatus('unknown');
      }
    });
  };

  // Carga movimientos con filtros/paginación
  const fetchMovements = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.method) params.set('method', filters.method);
    if (filters.q) params.set('q', filters.q);
    params.set('per_page', String(filters.per_page || 15));
    params.set('page', String(filters.page || 1));

    formData
      .handleRequest(formData.backend + '/dashboard/cash/movements?' + params.toString(), 'get')
      .then((res: any) => {
        const paginated = res?.movements;
        setMovements(paginated?.data || []);
        if (paginated) {
          setPagination({
            current_page: paginated.current_page,
            last_page: paginated.last_page,
            per_page: paginated.per_page,
            total: paginated.total,
          });
        } else {
          setPagination(null);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    fetchMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.per_page, filters.type, filters.method]);

  const onSearch = (e: any) => {
    e.preventDefault();
    setFilters((f: any) => ({ ...f, page: 1 })); // reset page on new search
    fetchMovements();
  };

  const changeFilter = (name: string, value: any) => {
    setFilters((f: any) => ({ ...f, [name]: value }));
  };

  const canPaginate = (dir: 'prev' | 'next') => {
    if (!pagination) return false;
    if (dir === 'prev') return pagination.current_page > 1;
    return pagination.current_page < pagination.last_page;
  };

  return (
    <div className="space-y-5">
      {/* Barra superior */}
      <div className="h-12">
        <BtnBack back />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ingresos */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogIn className="text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-bold">Ingresos</h3>
            <p className="text-2xl font-extrabold text-green-600 mt-2">
              {status === 'unknown' ? '—' : peso(ingresos)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              {status === 'open' ? 'Turno abierto' : status === 'closed' ? 'Caja cerrada' : 'Cargando…'}
            </p>
          </div>
        </Card>

        {/* Egresos */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiLogOut className="text-4xl text-red-500 mb-2" />
            <h3 className="text-lg font-bold">Egresos</h3>
            <p className="text-2xl font-extrabold text-red-600 mt-2">
              {status === 'unknown' ? '—' : peso(egresos)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              {status === 'open' ? 'Turno abierto' : status === 'closed' ? 'Caja cerrada' : 'Cargando…'}
            </p>
          </div>
        </Card>

        {/* Movimientos totales */}
        <Card>
          <div className="p-6 rounded-xl bg-white dark:bg-navy-800 flex flex-col items-center justify-center">
            <FiDollarSign className="text-4xl text-blue-500 mb-2" />
            <h3 className="text-lg font-bold">Movimientos</h3>
            <p className="text-2xl font-extrabold text-blue-600 mt-2">{loading ? '—' : totalMovs}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Última consulta</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <SelectField
              id="type"
              name="type"
              placeholder="Tipo"
              label="Tipo"
              defaultValue={filters.type}
              setInputs={(set: any) => changeFilter('type', set?.target?.value ?? set)}
              options={[
                { name: 'Todos', value: '' },
                { name: 'Apertura', value: 'apertura' },
                { name: 'Ingreso', value: 'ingreso' },
                { name: 'Egreso', value: 'egreso' },
                { name: 'Cierre', value: 'cierre' },
              ]}
              variant="autenticación"
              extra="mb-0"
            />

            <SelectField
              id="method"
              name="method"
              placeholder="Método"
              label="Método"
              defaultValue={filters.method}
              setInputs={(set: any) => changeFilter('method', set?.target?.value ?? set)}
              options={[
                { name: 'Todos', value: '' },
                { name: 'Efectivo', value: 'efectivo' },
                { name: 'Tarjeta', value: 'tarjeta' },
                { name: 'Transferencia', value: 'transferencia' },
                { name: 'Safe drop', value: 'safe_drop' },
              ]}
              variant="autenticación"
              extra="mb-0"
            />

            <InputField
              name="q"
              variant="autenticación"
              extra="mb-0"
              label="Buscar"
              placeholder="Referencia / Nota"
              id="q"
              type="text"
              defaultValue={filters.q}
              setInputs={(updater: any) =>
                changeFilter('q', typeof updater === 'function' ? updater(filters).q : updater.q ?? '')
              }
            />

            <SelectField
              id="per_page"
              name="per_page"
              placeholder="Por página"
              label="Por página"
              defaultValue={String(filters.per_page)}
              setInputs={(set: any) => changeFilter('per_page', Number(set?.target?.value ?? set))}
              options={[
                { name: '10', value: '10' },
                { name: '15', value: '15' },
                { name: '25', value: '25' },
                { name: '50', value: '50' },
              ]}
              variant="autenticación"
              extra="mb-0"
            />

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </form>
        </div>
      </Card>

      {/* Tabla de movimientos */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Movimientos</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Método</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Monto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Referencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-navy-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      Cargando…
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      Sin resultados.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 text-sm">{new Date(m.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm capitalize">{m.type}</td>
                      <td className="px-4 py-3 text-sm">{m.method || '—'}</td>
                      <td
                        className={[
                          'px-4 py-3 text-sm text-right font-semibold',
                          m.type === 'egreso' ? 'text-red-600' : 'text-green-600',
                        ].join(' ')}
                      >
                        {peso(m.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">{m.reference || '—'}</td>
                      <td className="px-4 py-3 text-sm">{m.note || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                Página {pagination.current_page} de {pagination.last_page} — {pagination.total} registros
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters((f: any) => ({ ...f, page: Math.max(1, f.page - 1) }))}
                  disabled={!canPaginate('prev') || loading}
                  className={[
                    'inline-flex rounded-lg px-3 py-2',
                    !canPaginate('prev') || loading
                      ? 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setFilters((f: any) => ({ ...f, page: (f.page || 1) + 1 }))}
                  disabled={!canPaginate('next') || loading}
                  className={[
                    'inline-flex rounded-lg px-3 py-2',
                    !canPaginate('next') || loading
                      ? 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CSRCashMovements;
