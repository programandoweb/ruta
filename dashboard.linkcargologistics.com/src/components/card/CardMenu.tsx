'use client';
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Dropdown from '@/components/dropdown';
import InputField from '@/components/fields/InputField';
import { BsThreeDots } from 'react-icons/bs';
import useAsyncStorage from '@/hooks/useAsyncStorage';

type Props = {
  back?: boolean;
  status?: any;
  skipHeader?: boolean;
  transparent?: boolean;
  viewDateFilter?: boolean;
  viewSearchFilter?: boolean;
  download?: any;
};

let storage:any;
let pathname:any;
let router:any;

function CardMenu(props: Props) {
  storage = useAsyncStorage();
  pathname = usePathname();
  router = useRouter();

  const { transparent, viewDateFilter, viewSearchFilter, skipHeader, status, back, download } = props;

  const [href, setHref] = useState('');
  const [inputs, setInputs] = useState<{ name?: string; value?: any }>({});
  const [filters, setFilters] = useState({ startDate: '', endDate: '', search: '' });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newHref = window.location.origin+""+window.location.pathname
    //console.log(newHref,window.location.pathname)
    setHref(newHref);
    //setHref(window.location.href);
  }, []);

  const updateUrlWithFilters = (newFilters: { startDate?: string; endDate?: string; search?: string }) => {
    const qp = new URLSearchParams();
    if (newFilters.startDate) qp.set('startDate', newFilters.startDate);
    if (newFilters.endDate)   qp.set('endDate',   newFilters.endDate);
    if (newFilters.search)    qp.set('search',    newFilters.search);
    router.push(`${href.split('?')[0]}?${qp.toString()}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateUrlWithFilters(filters);
    }
  };

  useEffect(() => updateUrlWithFilters(filters), [filters]);

  useEffect(() => {
    if (inputs.name === 'import' && inputs.value instanceof File) {
      (async () => {
        setUploadError(null);
        try {
          const formData = new FormData();
          formData.append('file', inputs.value as File);

          const user      =   await storage.getData('user');
          const token     =   user?.token;
          const endpoint  =   `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_VERSION}${pathname}/imports-template`;
          const res       =   await fetch(endpoint, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });

          if (!res.ok) throw new Error('Error al importar el archivo');
          //document.location.reload()
          console.log('Importación exitosa');
        } catch (err: any) {
          console.error(err);
          setUploadError(err.message || 'Error al importar el archivo');
        }
      })();
    }
  }, [inputs]);

  return (
    <Fragment>
      {viewDateFilter && (
        <div className="flex">
          <InputField id="startDate" name="startDate" type="date" setInputs={setFilters} defaultValue={filters.startDate} extra="mt-2 mr-2" />
          <InputField id="endDate"   name="endDate"   type="date" setInputs={setFilters} defaultValue={filters.endDate}   extra="mt-2" />
        </div>
      )}

      {viewSearchFilter && (
        <div className="relative w-full flex">
          {back && (
            <div className="w-40 mr-2" onClick={() => router.back()}>
              <div className="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full text-center cursor-pointer">
                Volver atrás
              </div>
            </div>
          )}
          <input
            id="search"
            name="search"
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar..."
            className="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full"
          />
          {status?.paymentStatuses?.length > 0 && (
            <div className="absolute right-[1px] top-[10px] w-[120px] md:w-[300px] border-1 rounded-md">
              <select
                name="payment_status"
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-gray-50 text-center"
                onChange={e => {
                  const ps = e.target.value;
                  if (ps) {
                    const qp = new URLSearchParams(window.location.search);
                    qp.set('payment_status', ps);
                    router.push(`${href.split('?')[0]}?${qp.toString()}`);
                  }
                }}
              >
                <option value="">Seleccione una opción</option>
                {status.paymentStatuses.map((row: any, idx: number) => (
                  <option key={idx} value={row.id}>{row.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {!skipHeader && (
        <Dropdown
          button={
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center text-xl hover:cursor-pointer ${transparent ? 'bg-none text-white' : 'bg-lightPrimary p-2 text-brand-500'} linear justify-center rounded-lg font-bold transition duration-200`}
            >
              <BsThreeDots className="h-6 w-6" />
            </button>
          }
          animation="origin-top-right transition-all duration-300 ease-in-out"
          className={`${transparent ? 'top-8' : 'top-11'} right-0 w-max`}
        >
          <div className="z-50 w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="hover:text-black flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium">
              <Link href={`${href}/new`}>Agregar</Link>
            </p>
            {
              /*
                <div className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium relative">
                  <input
                    type="file"
                    name="import"
                    accept=".xls,.xlsx"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      setInputs({ name: e.target.name, value: file });
                    }}
                    className="w-full h-full opacity-0 absolute left-0"
                  />
                  Importar
                </div>  
              */
            }
            
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
            {download && (
              <div className="hover:text-black mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium relative">
                <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_VERSION}${pathname}/template`} target="_blank">
                  Plantilla
                </Link>
              </div>
            )}
          </div>
        </Dropdown>
      )}
    </Fragment>
  );
}

export default CardMenu;
