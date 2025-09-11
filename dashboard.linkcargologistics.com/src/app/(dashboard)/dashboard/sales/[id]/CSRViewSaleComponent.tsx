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

import Card from '@/components/card'
import useFormData from '@/hooks/useFormDataNew'
import BtnBack from '@/components/buttom/BtnBack'
import { useEffect, useState } from 'react'
import { MdOutlineReceiptLong } from 'react-icons/md'
import { FiPrinter } from 'react-icons/fi'
import { formatearMonto } from '@/utils/fuctions'

interface Item {
  id: number
  name: string
  category: string
  quantity: number
  price: string
  description: string
  subtotal: string
  status: string
}

interface Order {
  id: number
  Código: string
  Estado: string
  Precio_Total: string
  Última_Actualización: string
  user?: { id: number; name: string } | null
  items: Item[]
}

const CSRViewSaleComponent: React.FC = () => {
  const formData = useFormData(false, false, false)
  const [order, setOrder] = useState<Order | null>(null)

  const getInit = () => {
    formData.handleRequest(formData.backend + location.pathname).then((res: any) => {
      if (res?.order) {
        setOrder(res.order)
      }
    })
  }

  useEffect(getInit, [])

  // 👉 imprimir todos los ítems de esta orden
  const handlePrintAll = () => {
    if (!order) return
    const ids = order.items.filter(i => i.status !== 'Cancelada').map(i => i.id)

    if (ids.length === 0) {
      alert('No hay ítems válidos para imprimir 🚫')
      return
    }

    formData
      .handleRequest(formData.backend + '/dashboard/order/print-group', 'post', { items: ids })
      .then((res: any) => {
        if (res?.pdf_url) {
          window.open(res.pdf_url, '_blank')
        }
      })
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500">
        Cargando información de la venta...
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="h-12 mb-4 flex justify-between items-center">
        <BtnBack back />        
      </div>

      {/* Datos principales */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Código</p>
            <p className="font-semibold">{order.Código}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p
              className={`font-semibold ${
                order.Estado === 'Cerrada' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {order.Estado}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-bold text-blue-700 text-lg">
              ${formatearMonto(Number(order.Precio_Total))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Última actualización</p>
            <p className="text-sm">{order.Última_Actualización}</p>
            <button
              onClick={handlePrintAll}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 flex items-center gap-2"
            >
              <FiPrinter size={18} /> 
            </button>
          </div>          
        </div>
      </Card>

      {/* Ítems de la venta */}
      <Card className="p-5">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <MdOutlineReceiptLong className="text-blue-600" /> Ítems de la venta
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Producto</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Precio</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">${formatearMonto(Number(item.price))}</td>
                  <td className="p-2 font-semibold text-blue-600">
                    ${formatearMonto(Number(item.subtotal))}
                  </td>
                  <td
                    className={`p-2 font-bold ${
                      item.status === 'Pagada' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="p-2 text-gray-500 italic text-xs">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default CSRViewSaleComponent
