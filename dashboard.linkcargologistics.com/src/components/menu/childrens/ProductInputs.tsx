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

import { useState } from "react"
import { formatearMonto } from "@/utils/fuctions"
import { FiPlus, FiSave, FiX } from "react-icons/fi"
import useFormData from "@/hooks/useFormDataNew"

interface Props {
  categories: any[]
  products: any[]
  selectedProduct: number | ''
  setSelectedProduct: (id: number | '') => void
  quantity: number
  setQuantity: (q: number) => void
  description: string
  setDescription: (d: string) => void
  descriptionsList: string[]
  handleAdd: () => void
  getInit?:any
}

const ProductInputs: React.FC<Props> = ({
  categories,
  products,
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  description,
  setDescription,
  descriptionsList,
  handleAdd,
  getInit
}) => {
  const formData = useFormData(false, false, false)
  const [localProducts, setLocalProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    product_category_id: ""
  })

  const filteredProducts = localProducts.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exists = filteredProducts.length > 0

  const handleCreate = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.product_category_id) {
      alert("Todos los campos son obligatorios")
      return
    }

    try {
      setLoading(true)
      const res: any = await formData.handleRequest(
        formData.backend + "/dashboard/fastCreateProduct",
        "post",
        newProduct
      )

      if (res?.product) {
        setLocalProducts([...localProducts, res.product])
        setSelectedProduct(res.product.id)
        setSearchTerm("")
        setSelectedProduct("")
        setShowSuggestions(false)        
        //document.location.reload()
      }

      setShowCreateForm(false)
      setNewProduct({ name: "", price: "", product_category_id: "" })
    } catch (err) {
      console.error("Error creando producto:", err)
      alert("Error al crear el producto")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProduct = (p: any) => {
    setSelectedProduct(p.id)
    setSearchTerm(p.name)
    setShowSuggestions(false)
  }

  const handleAddClick = () => {
    if (!selectedProduct) {
      alert("Debe seleccionar un producto")
      return
    }
    handleAdd()
    setShowSuggestions(false)
    setSearchTerm("")          // limpiar campo de búsqueda
    setSelectedProduct("")     // limpiar selección
  }

  if(loading)return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
      {/* Autocomplete o formulario de creación */}
      {!showCreateForm ? (
        <div className="sm:col-span-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setSelectedProduct("")
              setShowSuggestions(true)
            }}
            placeholder="Buscar producto..."
            className="border rounded-lg px-3 py-2 w-full"
          />
          {showSuggestions && searchTerm && !selectedProduct && (
            <ul className="absolute bg-white border rounded-lg shadow mt-1 w-full z-20 max-h-56 overflow-y-auto">
              {filteredProducts.map((p: any) => (
                <li
                  key={p.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectProduct(p)}
                >
                  {p.name}{" "}
                  <span className="text-sm text-gray-500">
                    {p.product_category?.name}
                  </span>{" "}
                  <span className="font-semibold">
                    ${formatearMonto(p.price)}
                  </span>
                </li>
              ))}
              {!exists && (
                <li
                  className="px-3 py-2 flex items-center justify-between bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setShowSuggestions(false)
                    setShowCreateForm(true)
                  }}
                >
                  <span>No existe. Crear “{searchTerm}”</span>
                  <FiPlus />
                </li>
              )}
            </ul>
          )}
        </div>
      ) : (
        <div className="sm:col-span-4 border rounded-lg p-3 bg-gray-50">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border rounded-lg px-3 py-2 mb-2 w-full"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border rounded-lg px-3 py-2 mb-2 w-full"
            required
          />
          <select
            value={newProduct.product_category_id}
            onChange={e =>
              setNewProduct({ ...newProduct, product_category_id: e.target.value })
            }
            className="border rounded-lg px-3 py-2 mb-2 w-full"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((row: any) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleCreate}
              className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              <FiSave /> {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-400 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500"
            >
              <FiX /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Inputs adicionales */}
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        className="border rounded-lg px-3 py-2"
        placeholder="Cantidad"
      />
      <input
        type="text"
        list="descriptions"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded-lg px-3 py-2 sm:col-span-2"
        placeholder="Descripción (ej: Carlos, Chica rubia)"
      />
      <datalist id="descriptions">
        {descriptionsList.map((desc, idx) => (
          <option key={idx} value={desc} />
        ))}
      </datalist>
      <button
        type="button"
        onClick={handleAddClick}
        className="bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 flex justify-center items-center"
      >
        <FiPlus size={20} />
      </button>
    </div>
  )
}

export default ProductInputs
