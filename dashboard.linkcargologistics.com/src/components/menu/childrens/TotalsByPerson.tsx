'use client'
import { useState } from 'react'
import { FiDollarSign, FiPrinter, FiSave } from 'react-icons/fi'
import { formatearMonto } from '@/utils/fuctions'

const formatearFecha = (fecha: string | undefined) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

type PaymentMethod = '' | 'transferencia' | 'efectivo' | 'otro'

interface GroupData {
  total: number
  remaining: number   // 👈 nuevo campo: pendiente por pagar
  status: string
  fecha: string
}

export interface RegisterPaymentPayload {
  amount: number
  method: PaymentMethod
  note?: string | null
}

interface Props {
  groupByDesc: Record<string, GroupData>
  handlePrintGroup: (desc: string) => void
  onSubmitPayment: (desc: string, payload: RegisterPaymentPayload) => Promise<void> | void
}

const TotalsByPerson: React.FC<Props> = ({ groupByDesc, handlePrintGroup, onSubmitPayment }) => {
  const [openFormDesc, setOpenFormDesc] = useState<string | null>(null)
  const [forms, setForms] = useState<
    Record<
      string,
      { amount: string; method: PaymentMethod; otherDetail: string; loading: boolean; error?: string | null }
    >
  >({})

  const ensureForm = (desc: string, total: number, remaining: number) => {
    setForms(prev =>
      prev[desc]
        ? prev
        : {
            ...prev,
            [desc]: {
              amount: String(remaining > 0 ? remaining : total ?? 0), // por defecto: lo que resta
              method: '',
              otherDetail: '',
              loading: false,
              error: null,
            },
          }
    )
  }

  const updateForm = (desc: string, patch: Partial<(typeof forms)[string]>) => {
    setForms(prev => ({ ...prev, [desc]: { ...prev[desc], ...patch } }))
  }

  const toggleForm = (desc: string, total: number, remaining: number) => {
    if (openFormDesc === desc) {
      setOpenFormDesc(null)
      return
    }
    ensureForm(desc, total, remaining)
    setOpenFormDesc(desc)
  }

  const submit = async (desc: string, remaining: number) => {
    const form = forms[desc]
    if (!form) return

    const amountNum = Number(form.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      updateForm(desc, { error: 'Monto inválido' })
      return
    }
    if (amountNum > remaining) {
      updateForm(desc, { error: `El monto no puede superar lo restante ($${formatearMonto(remaining)})` })
      return
    }
    if (!form.method) {
      updateForm(desc, { error: 'Seleccione un método de pago' })
      return
    }
    if (form.method === 'otro' && !form.otherDetail.trim()) {
      updateForm(desc, { error: 'Describa el método "otro"' })
      return
    }

    try {
      updateForm(desc, { loading: true, error: null })
      await onSubmitPayment(desc, {
        amount: amountNum,
        method: form.method,
        note: form.method === 'otro' ? form.otherDetail.trim() : null,
      })
      setOpenFormDesc(null)
      setForms(prev => {
        const { [desc]: _, ...rest } = prev
        return rest
      })
    } catch (e: any) {
      updateForm(desc, { error: e?.message || 'Error al registrar el pago' })
    } finally {
      updateForm(desc, { loading: false })
    }
  }

  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
      <h3 className="font-semibold text-gray-700 mb-2">Totales por persona</h3>

      <ul className="space-y-2">
        {Object.entries(groupByDesc).map(([desc, data], idx) => {
          const isOpen = openFormDesc === desc
          const form = forms[desc]
          const remaining = Math.max(0, Number(data.remaining || 0)) // seguridad

          return (
            <li key={idx} className="text-sm bg-white p-2 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-gray-600">{desc}</span>
                  <span
                    className={`text-xs font-bold ${
                      data.status === 'Pagada' ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {data.status} • {formatearFecha(data.fecha)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end leading-tight">
                    <span className="font-semibold text-blue-700">
                      ${formatearMonto(data.total || 0)}
                    </span>
                    {remaining > 0 && (
                      <span className="text-xs font-semibold text-red-600">
                        Resta: ${formatearMonto(remaining)}
                      </span>
                    )}
                  </div>

                  {/* Abrir/cerrar formulario */}
                  {data.status !== 'Pagada' && (
                    <button
                      onClick={() => toggleForm(desc, data.total, remaining)}
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                      title="Registrar pago"
                    >
                      <FiDollarSign size={16} />
                    </button>
                  )}

                  <button
                    onClick={() => handlePrintGroup(desc)}
                    className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                    title="Imprimir"
                  >
                    <FiPrinter size={16} />
                  </button>
                </div>
              </div>

              {/* Formulario inline */}
              {isOpen && data.status !== 'Pagada' && form && (
                <div className="mt-3 border-t pt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {/* Monto */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Monto {remaining > 0 && (
                        <span className="text-red-600 font-semibold"> (máx. ${formatearMonto(remaining)})</span>
                      )}
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={remaining || undefined}   // 👈 límite duro en el input
                      step="0.01"
                      value={form.amount}
                      onChange={e => {
                        const raw = e.target.value
                        const n = Number(raw)
                        // clamp al rango [0, remaining]
                        let val = raw
                        if (!isNaN(n)) {
                          if (n < 0) val = '0'
                          if (remaining > 0 && n > remaining) val = String(remaining)
                        }
                        updateForm(desc, { amount: val })
                      }}
                      className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Método */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">Método</label>
                    <select
                      value={form.method}
                      onChange={e => updateForm(desc, { method: e.target.value as PaymentMethod })}
                      className="w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seleccione…</option>
                      <option value="nequi">Nequi</option>
                      <option value="qr">QR</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Detalle si es "otro" */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">Detalle (si es otro)</label>
                    <input
                      type="text"
                      value={form.otherDetail}
                      onChange={e => updateForm(desc, { otherDetail: e.target.value })}
                      disabled={form.method !== 'otro'}
                      className="w-full border rounded px-2 py-1 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Describa el método"
                    />
                  </div>

                  {/* Guardar */}
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      onClick={() => submit(desc, remaining)}
                      disabled={form.loading || remaining <= 0}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                      title="Guardar pago"
                    >
                      <FiSave size={16} />
                      {form.loading ? 'Guardando…' : 'Guardar'}
                    </button>
                  </div>

                  {/* Error */}
                  {form.error && (
                    <div className="sm:col-span-4 text-red-600 text-xs mt-1">{form.error}</div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TotalsByPerson
