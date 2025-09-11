'use client'
import { motion } from "framer-motion"
import { FiTrash2 } from "react-icons/fi"
import { formatearMonto } from "@/utils/fuctions"
import { Fragment } from "react"

const formatearFecha = (fecha: string | undefined) => {
  if (!fecha) return ""
  const date = new Date(fecha)
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

interface Props {
  items: any[]
  confirmIndex: number | null
  setConfirmIndex: (i: number | null) => void
  handleRemove: (i: number, item: any) => void
  user: any
}

const ProductList: React.FC<Props> = ({
  items, confirmIndex, setConfirmIndex, handleRemove, user
}) => {
  return (
    <ul className="space-y-1 max-h-80 overflow-y-auto">
      {items.map((item: any, index) => (
        <motion.li
          key={`${item.id}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex justify-between items-start p-2 rounded-md shadow-sm ${
            item.status === "Cancelada"
              ? "bg-red-50 border border-red-300"
              : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col text-xs sm:text-sm flex-1">
            <span
              className={`font-medium ${
                item.status === "Cancelada" ? "text-red-600" : "text-gray-700"
              }`}
            >
              <b>{item.description || "Sin descripción"}</b>: {item.name}
            </span>
            {item.created_at && (
              <span className="text-[11px] text-gray-500 mt-1">
                {formatearFecha(item.created_at)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end ml-2">
            <span
              className={`text-sm font-semibold ${
                item.status === "Cancelada" ? "text-red-500" : "text-blue-600"
              }`}
            >
              {item.quantity} x ${formatearMonto(item.price)} = $
              {formatearMonto(item.price * item.quantity)}
            </span>
            {item.status === "Cancelada" && (
              <span className="text-[11px] font-bold text-red-600 mt-1">
                ❌ Cancelada
              </span>
            )}
          </div>

          {item.status !== "Cancelada" &&
            (user?.role === "admin" || user?.role === "managers") &&
            (confirmIndex === index ? (
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleRemove(index, item)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Sí
                </button>
                <button
                  onClick={() => setConfirmIndex(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                >
                  No
                </button>
              </div>
            ):item.status === "Pagada"?<Fragment></Fragment> : (
              <button
                onClick={() => setConfirmIndex(index)}
                className="text-red-500 hover:text-red-700 p-1 ml-2"
              >
                <FiTrash2 size={16} />
              </button>
            ))}
        </motion.li>
      ))}
    </ul>
  )
}

export default ProductList
