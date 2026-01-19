'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve - Support Comments
 * ---------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiClock,
  FiImage,
  FiFile,
  FiFileText,
  FiExternalLink,
  FiArchive,
  FiTrash2,
} from 'react-icons/fi';

import CommentDetailDrawer from '@/components/comments/CommentDetailDrawer';


export type CommentItem = {
  id: number | string;
  mensaje: string;
  image?: string | null;
  module?: string | null;
  pathname?: string | null;
  json?: any;
  user_id?: any;
  created_at?: string;
  updated_at?: string;
  type?: string;
  user?: { id: number; name?: string };
};

interface SupportCommentsProps {
  dataset: CommentItem[]; // 🔹 Dataset pasado desde el padre
  className?: string;
  emptyLabel?: string;
  handleDeleteItem?: (id: number | string) => void;
  onSelectComment?: (comment: CommentItem) => void; // 🔹 Nuevo callback para abrir el drawer
}

const IMG_EXT = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'];
const PDF_EXT = ['pdf'];
const ZIP_EXT = ['zip'];

const getExt = (url?: string | null) =>
  (url || '').split('?')[0].split('#')[0].split('.').pop()?.toLowerCase() || '';

const isImage = (url?: string | null) => IMG_EXT.includes(getExt(url));
const isPDF = (url?: string | null) => PDF_EXT.includes(getExt(url));
const isZIP = (url?: string | null) => ZIP_EXT.includes(getExt(url));

const fileName = (url?: string | null) => {
  if (!url) return '';
  const clean = url.split('?')[0].split('#')[0];
  return decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1)) || clean;
};

// Paleta de colores por tipo
const colorPalette: Record<string, string> = {
  Comentario: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20',
  Pagos: 'bg-green-50 border-green-100 dark:bg-green-900/20',
  Soporte: 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20',
  'Reporte de Usuario': 'bg-red-50 border-red-100 dark:bg-red-900/20',
  Default: 'bg-gray-50 border-gray-100 dark:bg-gray-900/20',
};

const SupportComments: React.FC<SupportCommentsProps> = ({
  dataset = [],
  className,
  emptyLabel = 'No hay comentarios registrados.',
  handleDeleteItem,
  onSelectComment, // 🔹 Se recibe el callback del padre
}) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleDeleteComment = (commentId: number | string) => {
    if (handleDeleteItem) handleDeleteItem(commentId);
    console.log(`Eliminar comentario con ID: ${commentId}`);
  };

  return (
    <div className={className}>
      {/* 🔹 Mensaje vacío */}
      {(!dataset || dataset.length === 0) && (
        <div className="rounded-md border border-dashed border-gray-300 p-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {emptyLabel}
        </div>
      )}

      {/* 🔹 Lista de comentarios */}
      <div className="space-y-2">
        {dataset?.map((c: CommentItem) => {
          const hasFile = !!c.image;
          const showImg = isImage(c.image);
          const showPdf = isPDF(c.image);
          const showZip = isZIP(c.image);
          const isOwner = user && user.id === c.user_id;
          const colorClass = colorPalette[c.type ?? 'Default'] || colorPalette.Default;

          return (
            <article
              key={c.id}
              className={`group relative rounded-md border p-3 shadow-sm transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${colorClass}`}
              onClick={() => onSelectComment && onSelectComment(c)} // 🔹 Al hacer clic, dispara el drawer
            >
              <header className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <FiUser className="h-3.5 w-3.5 text-brand-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {c?.user?.name ?? '—'} #{c.id}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">· {c.module || '—'}</span>
                </div>
                {c.created_at && (
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <FiClock className="h-3 w-3" />
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                )}
              </header>

              <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                {c.mensaje}
              </p>

              {(parseInt(user?.id) === parseInt(c.user_id) || user?.role === 'admin' || isOwner) && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // evita abrir el drawer
                      handleDeleteComment(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900"
                    title="Eliminar comentario"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {hasFile && (
                <div className="mt-2 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {showImg ? <FiImage /> : showPdf ? <FiFileText /> : showZip ? <FiArchive /> : <FiFile />}
                    <span className="truncate max-w-[150px]">{fileName(c.image)}</span>
                    <a
                      href={c.image || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto hover:underline"
                      download={showZip}
                      onClick={(e) => e.stopPropagation()} // evita abrir drawer al abrir archivo
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
              )}

              {c.updated_at && c.updated_at !== c.created_at && (
                <footer className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  Editado: {new Date(c.updated_at).toLocaleString()}
                </footer>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default SupportComments;
