'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import React, { useEffect, useState } from 'react';
import CommentsForm from './CommentsForm';
import useFormData from '@/hooks/useFormDataNew';
import CommentsList from './CommentsSection'; // render de ítems

const debug = false;

type CommentItem = {
  id: number | string;
  mensaje: string;
  image?: string | null;
  module?: string | null;
  pathname?: string | null;
  json?: any;
  user_id?: number | null;
  created_at?: string;
  updated_at?: string;  
};

interface CommentsSectionContainerProps {
  module?: string;          // opcional (default: 'historial')
  pathname?: string;        // opcional para filtrar en backend
  className?: string;
  skipForm?:boolean;
  reload?:boolean
}

const CommentsSectionContainer: React.FC<CommentsSectionContainerProps> = ({
  module = 'historial',
  pathname,
  className,
  skipForm,
  reload
}) => {
  const formData = useFormData(false, false, false);
  const [dataset, setDataset] = useState<CommentItem[]>([]);

  const getInit = () => {
    const qs = new URLSearchParams();
    if (module) qs.set('module', module);
    if (pathname) qs.set('pathname', pathname);

    formData
      .handleRequest(
        formData.backend + '/dashboard/comments' + (qs.toString() ? `?${qs.toString()}` : '')
      )
      .then((response: any) => {
        const rows = response?.comments?.data;
        setDataset(Array.isArray(rows) ? rows : []);
      });
  };

  useEffect(getInit, [module, pathname, reload]); // refresca al cambiar filtros

  const handleDeleteItem=(itemId:any)=>{
    formData
      .handleRequest(formData.backend + '/dashboard/comments/'+itemId,'delete').then((response: any) => {
        getInit();
      });
  }

  return (
    <div className={className ?? 'dark:border-gray-700 dark:bg-gray-900'}>
      <h2 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Comentarios
      </h2>
      {
        !skipForm&&(<CommentsForm module={module} setDataset={setDataset} pathnameOverride={pathname}/>)
      }      
      <CommentsList skipTab dataset={dataset} handleDeleteItem={handleDeleteItem} />
      {debug && (
        <pre className="mt-4 bg-gray-100 p-3 text-xs dark:bg-gray-800">
          {JSON.stringify(dataset, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CommentsSectionContainer;
