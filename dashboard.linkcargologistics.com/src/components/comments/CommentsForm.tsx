'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve - Comments Form
 * ---------------------------------------------------
 */

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import UploadBtn from '@/components/buttom/UploadBtn';
import { FiSend, FiXCircle, FiMessageSquare, FiCreditCard } from 'react-icons/fi';
import useFormData from '@/hooks/useFormDataNew';
import { motion } from 'framer-motion';

interface CommentsFormProps {
  module?: string;
  pathnameOverride?: string;
  parentId?: number | string; // ✅ Nuevo parámetro opcional
  className?: string;
  setDataset: React.Dispatch<React.SetStateAction<any[]>>;
  skiptType?:undefined|boolean|null;
}

const CommentsForm: React.FC<CommentsFormProps> = ({
  module,
  pathnameOverride,
  parentId,
  className,
  setDataset,
  skiptType
}) => {
  const currentPathname = usePathname();
  const formData = useFormData(false, false, false);

  const [inputs, setInputs] = useState<any>({
    mensaje: '',
    image: '',
    module: module ?? '',
    pathname: '',
    type: 'Comentario',
    parent_id:parentId||null
  });

  useEffect(() => {
    setInputs((prev: any) => ({
      ...prev,
      pathname: pathnameOverride || currentPathname || '',
      module: module ?? prev.module,
    }));
  }, [currentPathname, module, pathnameOverride]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      mensaje: inputs.mensaje,
      image: inputs.image,
      module: inputs.module,
      pathname: inputs.pathname,
      type: inputs.type,
      parent_id:parentId||null
    };

    // ✅ Determina el endpoint dinámicamente
    const endpoint = `${formData.backend}/dashboard/comments`;
   
      /*
    const endpoint = parentId
      ? `${formData.backend}/dashboard/supports/${parentId}/children`
      : `${formData.backend}/dashboard/comments`;
    */

    const response = await formData.handleRequest(endpoint, 'post', payload);

    if (response?.childrens || response?.comments) {
      // ✅ Actualiza el dataset según la respuesta
      setDataset(response.childrens || response.comments);
    }

    setInputs((p: any) => ({ ...p, mensaje: '', image: '' }));
  };

  const clearImage = () => setInputs((p: any) => ({ ...p, image: '' }));

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`${className} mb-2`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-3">
        {/* 🔹 Tipo de mensaje */}
        {
          /*
          !skiptType&&(
            <div className="flex gap-3 items-center">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Tipo:
              </label>
              <select
                value={inputs.type}
                onChange={(e) => setInputs((p: any) => ({ ...p, type: e.target.value }))}
                className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="Comentario">Comentario</option>
                <option value="Pagos">Pagos</option>
              </select>
              {inputs.type === 'Comentario' && <FiMessageSquare className="text-gray-500" />}
              {inputs.type === 'Pagos' && <FiCreditCard className="text-gray-500" />}
            </div>
          )
          */
        }
        
        {/* 🔹 Campo de mensaje */}
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          rows={2}
          value={inputs.mensaje}
          onChange={(e) => setInputs((p: any) => ({ ...p, mensaje: e.target.value }))}
          placeholder={parentId ? 'Escribe una respuesta…' : 'Escribe tu comentario…'}
          required
        />

        {/* 🔹 Acciones */}
        <div className="flex items-center gap-1">
          <UploadBtn
            label="Archivo"
            name="image"
            preview={false}
            setFormData={setInputs}
            className="text-sm"
          />
          {inputs.image && (
            <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-1 text-xs rounded-md dark:border-gray-700 dark:bg-gray-800">
              <span className="truncate max-w-[150px]">{inputs.image}</span>
              <button type="button" onClick={clearImage} title="Quitar">
                <FiXCircle className="h-4 w-4 text-red-500" />
              </button>
            </div>
          )}
          <motion.button
            type="submit"
            disabled={!inputs.mensaje}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 ml-auto shadow-md"
          >
            <FiSend className="h-4 w-4" /> {parentId ? 'Responder' : 'Enviar'}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default CommentsForm;
