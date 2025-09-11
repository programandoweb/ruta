/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve - Condominios
 * ---------------------------------------------------
 */

import { NextPage } from 'next'
import Card from '../card'
import { Fragment, useEffect, useState } from 'react'
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'
import useFormData from '@/hooks/useFormDataNew'
import SelectField from '../fields/SelectField'

interface Props {
  user_id: number
}

const title: string = "Inmuebles"
const prefixed = 'properties'
let formData: any

const defaultValues = { property_id: "", role: "", user_id: 0, status: '', comentario: '' }

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'prohibido', label: 'Prohibido' },
]

const AddProperty: NextPage<Props> = ({ user_id }) => {
  formData = useFormData(false, false, false)

  const [open, setOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<any>(null)
  const [inputs, setInputs] = useState({ ...defaultValues, user_id: user_id })
  const [dataset, setDataset] = useState<any>([])
  const [properties, setProperties] = useState([])
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const getInit = async () => {
      formData.handleRequest(formData.backend + "/dashboard/dataset/properties?user_id=" + user_id).then((response: any) => {
        if (response && response.user && response.user.properties_all) {
          setDataset(response.user.properties_all)
        }
        if (response && response[prefixed]) {
          setProperties(response[prefixed])
        }
        if (response && response?.roles) {
          setRoles(response.roles)
        }
      })
    }
    getInit()
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    formData.handleRequest(formData.backend + "/dashboard/dataset/set/properties?user_id=" + user_id, "post", inputs).then((response: any) => {
      if (response && response.user && response.user.properties_all) {
        setDataset(response.user.properties_all)
      }
    })
    setOpen(false)
    setInputs({ ...defaultValues, user_id: user_id })
  }

  const handleDeleteConfirm = () => {
    formData.handleRequest(formData.backend + "/dashboard/dataset/delete/properties" + user_id, "delete", deleteItem).then((response: any) => {
      if (response && response.user && response.user.properties_all) {
        setDataset(response.user.properties_all)
      }
    })
    setDeleteModal(false)
    setInputs({ ...defaultValues, user_id: user_id })
  }

  return (
    <div>
      <Card className="p-4">
        {user_id === 0 ? (
          <div className="text-center">Usuario no disponible</div>
        ) : (
          <Fragment>
            <div className="flex justify-between items-center">
              <div>{title}</div>
              <div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center mr-2 px-5 linear rounded-md bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>
            </div>
            <div className='mt-2'>
              <table className='w-full'>
                <thead className='bg-brand-500 text-white pt-[5px] pb-[5px]'>
                  <th>{title}</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                </thead>
                <tbody>
                  {dataset?.map((row: any, key: number) => (
                    <tr key={key} className='border-t'>
                      <td>{row.label}</td>
                      <td className='text-center'>{row.pivot.role}</td>
                      <td className='text-center'>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => {
                            setDeleteItem({ ...row, user_id })
                            setDeleteModal(true)
                          }}
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Fragment>
        )}
      </Card>

      {/* Modal agregar */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div><b>Agregar {title}</b></div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField required placeholder="Propiedad" label="Propiedad" defaultValue={inputs.property_id} setInputs={setInputs} options={properties} name="property_id" variant="autenticación" />
                    <SelectField required placeholder="Rol" label="Rol" defaultValue={inputs.role} setInputs={setInputs} options={roles} name="role" variant="autenticación" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 flex-wrap mt-4">
                  <button onClick={() => setOpen(false)} type="button" className="px-5 py-1 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition">Cerrar</button>
                  <button type="submit" className="px-5 py-1 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition">Agregar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Modal eliminar */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.25 }}>
              <div><b>Estado y motivo</b></div>
              <div className="p-4">
                <SelectField
                  required
                  placeholder="Estado"
                  label="Estado"
                  defaultValue={inputs.status}
                  setInputs={setInputs}
                  options={statusOptions}
                  name="status"
                  variant="autenticación"
                />
                <textarea
                  className="mt-4 w-full border rounded p-2"
                  rows={3}
                  placeholder="Motivo o comentario"
                  value={inputs.comentario}
                  onChange={(e) => setInputs({ ...inputs, comentario: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 flex-wrap mt-4">
                <button onClick={() => setDeleteModal(false)} type="button" className="px-5 py-1 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition">Cancelar</button>
                <button onClick={handleDeleteConfirm} type="button" className="px-5 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition">Confirmar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddProperty;
