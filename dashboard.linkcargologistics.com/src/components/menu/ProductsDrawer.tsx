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

import { NextPage } from 'next'
import { Fragment, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import useFormData from '@/hooks/useFormDataNew'
import { FiPrinter } from 'react-icons/fi'
import { setOpenDrawer } from '@/store/Slices/dialogMessagesSlice'

// 👉 subcomponentes
import ProductInputs from './childrens/ProductInputs'
import ProductList from './childrens/ProductList'
import TotalsByPerson, { RegisterPaymentPayload } from './childrens/TotalsByPerson'

interface Product {
  id: number
  name: string
  price: number | string
  product_category?: {
    id: number
    name: string
  }
}

interface Item {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  description: string
  status?: string
  updated_at?: string
}

interface Props {
  products: Product[]
  storageKey: string
}

const ProductsDrawer: NextPage<Props> = ({ products, storageKey }) => {
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [description, setDescription] = useState<string>('')

  const [items, setItems] = useState<Item[]>([])
  const [descriptionsList, setDescriptionsList] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)
  const [categories	, setCategories]    = useState<any[]>([]);

  const user = useSelector((state: any) => state.user.session)
  const formData = useFormData(false, false, false)
  const dispatch = useDispatch()

  // 👉 cargar orden e items
  const getInit = () => {
    formData
      .handleRequest(formData.backend + '/dashboard/order/' + storageKey)
      .then((res: any) => {
        if (res?.categories) setCategories(res.categories);
        if (res?.order) {
          const order = res.order
          const itemsFromBackend = order.items || []

          setItems(itemsFromBackend)


          const descs: any = [
            ...new Set(itemsFromBackend.map((i: any) => i.description).filter(Boolean)),
          ]
          setDescriptionsList(descs)

          localStorage.setItem(storageKey, JSON.stringify(itemsFromBackend))
          localStorage.setItem(`${storageKey}_descriptions`, JSON.stringify(descs))
        }
      })
  }

  useEffect(() => {
    localStorage.removeItem(storageKey)
    getInit()
  }, [storageKey])

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setItems(JSON.parse(saved))
    const savedDesc = localStorage.getItem(`${storageKey}_descriptions`)
    if (savedDesc) setDescriptionsList(JSON.parse(savedDesc))
    setLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(storageKey, JSON.stringify(items))
    localStorage.setItem(`${storageKey}_descriptions`, JSON.stringify(descriptionsList))
  }, [items, descriptionsList, storageKey, loaded])

  // 👉 agregar producto
  const handleAdd = () => {
    if (!selectedProduct || quantity <= 0) return
    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    const newItem: Item = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      category: product.product_category?.name || '',
      quantity,
      description: description.trim(),
    }

    setItems(prev => [...prev, newItem])
    if (description.trim() && !descriptionsList.includes(description.trim())) {
      setDescriptionsList(prev => [...prev, description.trim()])
    }

    formData
      .handleRequest(formData.backend + '/dashboard/order/add', 'post', {
        item: newItem,
        table_id: storageKey,
      })
      .then(() => {
        getInit()
      })

    setSelectedProduct('')
    setQuantity(1)
    setDescription('')
  }

  // 👉 remover item
  const handleRemove = (index: number, item: any) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    setConfirmIndex(null)

    formData
      .handleRequest(formData.backend + '/dashboard/order/remove/' + item.id, 'delete')
      .then(() => {
        getInit()
      })
  }

  // 👉 imprimir grupo
  const handlePrintGroup = (desc: string) => {
    const ids = items
      .filter(i => i.description === desc && i.status !== 'Cancelada')
      .map(i => i.id)

    formData
      .handleRequest(formData.backend + '/dashboard/order/print-group', 'post', { items: ids })
      .then((res: any) => {
        if (res?.pdf_url) {
          window.open(res.pdf_url, '_blank')
        }
      })
  }

  // 👉 imprimir todo
  const handlePrintAll = () => {
    const ids = items.filter(i => i.status !== 'Cancelada').map(i => i.id)

    formData
      .handleRequest(formData.backend + '/dashboard/order/print-group', 'post', { items: ids })
      .then((res: any) => {
        if (res?.pdf_url) {
          window.open(res.pdf_url, '_blank')
        }
      })
  }

  // 👉 agrupación con status y fecha
  type GroupInfo = {
    total: number
    remaining: number   // 👈 nuevo
    status: string
    fecha: string
  }

  const groupByDesc = items.reduce<Record<string, GroupInfo>>((acc, item: any) => {
    if (item.status === 'Cancelada') return acc

    const key = item.description || 'Sin descripción'
    const price = Number(item.price) || 0
    const qty   = Number(item.quantity) || 1
    const sub   = price * qty

    // crear grupo si no existe (optimista: Pagada)
    if (!acc[key]) {
      acc[key] = {
        total: 0,
        remaining: 0,     // 👈 inicia en 0
        status: 'Pagada', // 👈 asume pagada hasta ver lo contrario
        fecha: item.updated_at || '',
      }
    }

    // acumular total del grupo
    acc[key].total += sub

    // fecha más reciente
    if (item.updated_at && new Date(item.updated_at) > new Date(acc[key].fecha)) {
      acc[key].fecha = item.updated_at
    }

    // si este ítem NO está pagado → cuenta como restante y el grupo baja a "En Espera"
    if (item.status !== 'Pagada') {
      acc[key].remaining += sub    // 👈 suma lo no pagado
      acc[key].status = 'En Espera'
    }

    return acc
  }, {})



  // 👉 verificar si ya está todo pagado
  const allPaid =
    Object.values(groupByDesc).length > 0 &&
    Object.values(groupByDesc).every(g => g.status === 'Pagada')

  // 👉 cerrar mesa
  const handleCloseTable = () => {
    if (!confirm('¿Estás seguro que deseas cerrar la mesa?')) return

    formData
      .handleRequest(formData.backend + '/dashboard/order/close', 'post', {
        table_id: storageKey,
      })
      .then(() => {
        getInit()
        localStorage.removeItem(storageKey)
        setItems([])
        dispatch(setOpenDrawer({ open: false, direction: 'right' }))
      })
  }

  // 👉 pagar todo (flujo existente)
  const handlePayAll = () => {
    const ids = items.filter(i => i.status !== 'Cancelada').map(i => i.id)
    if (ids.length === 0) return

    formData
      .handleRequest(formData.backend + '/dashboard/order/pay-all', 'post', {
        items: ids,
        table_id: storageKey,
      })
      .then(() => {
        getInit()
        localStorage.removeItem(storageKey)
        setItems([])
        dispatch(setOpenDrawer({ open: false, direction: 'right' }))
      })
  }

  /**
   * 👉 NUEVO: registrar pago por grupo con datos del formulario (monto, método, nota)
   * - Endpoint distinto al actual:
   *   Sugerencia: '/dashboard/order/register-payment'
   * - Payload enviado: { items, table_id, amount, method, note }
   */
  const handleRegisterPaymentGroup = async (desc: string, payload: RegisterPaymentPayload) => {
    const ids = items
      .filter(i => i.description === desc && i.status !== 'Cancelada')
      .map(i => i.id)

    if (ids.length === 0) {
      throw new Error('No hay ítems válidos para este grupo')
    }

    // ⤵️ POST al NUEVO endpoint
    await formData.handleRequest(
      formData.backend + '/dashboard/order/register-payment',
      'post',
      {
        items: ids,
        table_id: storageKey,
        amount: payload.amount,
        method: payload.method,
        note: payload.note ?? null,
      }
    )

    // refrescar estado luego del pago
    await getInit()
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 80 }}
      className="p-4 bg-white rounded-2xl shadow-lg w-full h-full max-h-screen overflow-y-auto pb-40"
    >
      <h2 className="text-right text-xl font-semibold mb-4 text-gray-700">Agregar Productos</h2>

      {/* Inputs */}
      <ProductInputs
        getInit={getInit}
        categories={categories}
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        description={description}
        setDescription={setDescription}
        descriptionsList={descriptionsList}
        handleAdd={handleAdd}
      />

      {/* Lista de productos */}
      <ProductList
        items={items}
        confirmIndex={confirmIndex}
        setConfirmIndex={setConfirmIndex}
        handleRemove={handleRemove}
        user={user}
      />

      {/* Totales */}
      {items.length > 0 && (
        <Fragment>
          <div className="mt-4 flex flex-col gap-4">
            <TotalsByPerson
              groupByDesc={groupByDesc}
              handlePrintGroup={handlePrintGroup}
              onSubmitPayment={handleRegisterPaymentGroup}
            />

            <div className="flex gap-2">
              {/* 👉 Solo mostrar si NO está todo pagado */}
              {!allPaid && (
                <button
                  onClick={handlePayAll}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700"
                >
                  Pagar Todo (${items
                    .filter(i => i.status !== 'Cancelada')
                    .reduce((s, it) => s + it.price * it.quantity, 0)
                    .toFixed(2)})
                </button>
              )}

              <button
                onClick={handlePrintAll}
                className="bg-purple-600 text-white px-4 rounded-lg shadow hover:bg-purple-700"
              >
                <span className="flex items-center gap-2">
                  <FiPrinter size={18} /> Imprimir Todo
                </span>
              </button>

              {/* 👉 Botón cerrar mesa SOLO si todo está pagado */}
              {allPaid && (
                <button
                  onClick={handleCloseTable}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                >
                  Cerrar Mesa
                </button>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </motion.div>
  )
}

export default ProductsDrawer
