'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import React from 'react';
import {
  FiUser,
  FiClock,
  FiImage,
  FiFile,
  FiFileText,
  FiExternalLink,
  FiArchive
} from 'react-icons/fi';

export type CommentItem = {
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

interface CommentsSectionProps {
  dataset: CommentItem[];
  className?: string;
  emptyLabel?: string;
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

const CommentsSectionSinBoton: React.FC<CommentsSectionProps> = ({
  dataset,
  className,
  emptyLabel = 'No hay comentarios todavía.',
}) => {
  return (
    <div className={className}>
      {(!dataset || dataset.length === 0) && (
        <div className="rounded-md border border-dashed border-gray-300 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {emptyLabel}
        </div>
      )}

      <div className="space-y-2">
        {dataset?.map((c: any) => {
          const hasFile = !!c.image;
          const showImg = isImage(c.image);
          const showPdf = isPDF(c.image);
          const showZip = isZIP(c.image);

          return (
            <article
              key={c.id}
              className="rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              {/* Header */}
              <header className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <FiUser className="h-3.5 w-3.5 text-brand-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    #{c?.user?.name ?? '—'}
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

              {/* Mensaje */}
              <p className="text-sm text-gray-800 dark:text-gray-200">{c.mensaje}</p>

              {/* Adjunto */}
              {hasFile && (
                <div className="mt-2 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {showImg ? (
                      <FiImage />
                    ) : showPdf ? (
                      <FiFileText />
                    ) : showZip ? (
                      <FiArchive />
                    ) : (
                      <FiFile />
                    )}
                    <span className="truncate max-w-[150px]">{fileName(c.image)}</span>
                    <a
                      href={c.image || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto hover:underline"
                      title={showZip ? 'Descargar ZIP' : 'Abrir'}
                      download={showZip}
                    >
                      <FiExternalLink />
                    </a>
                  </div>

                  {showImg && (
                    <img
                      src={c.image!}
                      alt={fileName(c.image)}
                      className="max-h-48 w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {showPdf && (
                    <iframe
                      src={`${c.image}#view=FitH`}
                      className="h-48 w-full"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {/* Meta */}
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

export default CommentsSectionSinBoton;
