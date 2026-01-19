'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve - Drawer Detalle Comentario
 * ---------------------------------------------------
 */

import { useEffect, useState, Fragment } from 'react';
import { FiClock, FiUser, FiFileText, FiMessageCircle } from 'react-icons/fi';
import DrawerComponent from '@/components/drawer';
import useFormData from '@/hooks/useFormDataNew';
import CommentsForm from '@/components/comments/CommentsForm';

interface CommentDetailDrawerProps {
  comment: any;
  handleClose: () => void;
}

const CommentDetailDrawer: React.FC<CommentDetailDrawerProps> = ({
  comment,
  handleClose,
}) => {
  const formData = useFormData(false, false, false);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getInit = async () => {
    if (!comment?.id) return;
    setLoading(true);
    try {
      const response = await formData.handleRequest(
        `${formData.backend}/dashboard/supports/${comment.id}/children`
      );
      setChildren(response?.childrens || []);
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
    } finally {
      // 🔹 Delay de 2 segundos antes de quitar el loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    getInit();
  }, [comment?.id]);

  if (!comment) return null;

  return (
    <DrawerComponent>
      <div className="relative flex flex-col h-[100vh] bg-gray-50/30 dark:bg-gray-900/40">
        {/* 🔹 Loading principal con delay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-50">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Cargando detalles...
            </p>
          </div>
        )}

        {/* 🔹 Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-5 pb-56">
          <Fragment>
            <h2 className="text-xl font-bold mb-5 text-right text-gray-800 dark:text-gray-100">
              Detalle del Comentario
            </h2>

            {/* 🔹 Comentario principal */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
              <div className="flex items-center gap-2 text-sm mb-2 text-gray-600 dark:text-gray-300">
                <FiUser className="text-brand-500" /> <span>{comment.usuario}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <FiClock /> {new Date(comment.created_at!).toLocaleString()}
              </div>

              <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                {comment.mensaje}
              </p>

              <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2 mt-3">
                <FiFileText className="inline mr-1 text-gray-400" />
                <strong>Módulo:</strong> {comment.module} <br />
                <strong>Ruta:</strong> {comment.pathname}
              </div>             
            </div>

            {/* 🔹 Respuestas / hijos */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FiMessageCircle className="text-brand-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Respuestas
                </h3>
              </div>

              {!loading && children.length === 0 && (
                <p className="text-xs text-gray-400">No hay respuestas registradas.</p>
              )}

              <div className="space-y-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                        <FiUser className="h-3 w-3 text-brand-500" /> {child.usuario}
                      </span>
                      <span>{new Date(child.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
                      {child.mensaje}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        </div>

        {/* 🔹 Formulario fijo inferior */}
        <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <CommentsForm
            skiptType={true}
            parentId={comment?.id}
            module={comment.module}
            pathnameOverride={`/dashboard/supports/${comment.id}/children`}
            setDataset={setChildren}
            className="w-full"
          />
        </div>
      </div>
    </DrawerComponent>
  );
};

export default CommentDetailDrawer;
