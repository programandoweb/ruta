'use client'

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { MdOutlineReceiptLong } from 'react-icons/md'
import { FaMoneyBillWave } from 'react-icons/fa'
import { formatearMonto } from '@/utils/fuctions'

interface ItemSale {
  id: number
  order_id: number
  product_id: number
  name: string
  category: string
  quantity: number
  price: string
  description: string
  subtotal: string
  status: string
  created_at: string
  updated_at: string
}

interface Sale {
  id: number
  code: string
  table_id: number
  user_id: number
  customer_name: string | null
  status: string
  total_price: string
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items_sales: ItemSale[]
}

interface Props {
  sales: Sale[]
}

const SalesList: React.FC<Props> = ({ sales }) => {
  const [openSale, setOpenSale] = useState<number | null>(null)

  const toggleSale = (id: number) => {
    setOpenSale(openSale === id ? null : id)
  }

  // 👉 total de todas las ventas
  const totalVentas = sales.reduce((acc, s) => acc + Number(s.total_price), 0)

  return (
    <div className="space-y-4">
      {/* Encabezado con el total */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-xl shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="text-3xl" />
          <div>
            <p className="text-sm opacity-90">Total de Ventas</p>
            <p className="text-2xl font-bold">${formatearMonto(totalVentas)}</p>
          </div>
        </div>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {sales.length} {sales.length === 1 ? 'venta' : 'ventas'}
        </span>
      </div>

      {/* Listado de ventas */}
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="border rounded-lg shadow-sm bg-white"
        >
          {/* Header venta */}
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSale(sale.id)}
          >
            <div className="flex items-center gap-2">
              <MdOutlineReceiptLong className="text-blue-600 text-xl" />
              <div>
                <p className="font-semibold text-gray-700">
                  Venta #{sale.code}
                </p>
                <p className="text-xs text-gray-500">
                  Estado:{' '}
                  <span
                    className={
                      sale.status === 'Cerrada'
                        ? 'text-green-600 font-bold'
                        : 'text-gray-600'
                    }
                  >
                    {sale.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-700">
                ${formatearMonto(Number(sale.total_price))}
              </span>
              {openSale === sale.id ? (
                <FiChevronDown className="text-gray-500" />
              ) : (
                <FiChevronRight className="text-gray-500" />
              )}
            </div>
          </div>

          {/* Detalles expandibles */}
          <AnimatePresence initial={false}>
            {openSale === sale.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-3"
              >
                <ul className="divide-y text-sm">
                  {sale.items_sales.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between">
                      <div>
                        <p className="font-medium text-gray-700">
                          {item.name}{' '}
                          <span className="text-xs text-gray-500">
                            ({item.category})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x ${formatearMonto(Number(item.price))}
                        </p>
                        <p className="text-[11px] text-gray-400 italic">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">
                          ${formatearMonto(Number(item.subtotal))}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            item.status === 'Pagada'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default SalesList
