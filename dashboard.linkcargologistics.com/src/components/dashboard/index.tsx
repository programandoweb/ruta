'use client'

import { FC } from 'react'
import useFormData from '@/hooks/useFormDataNew'
import Link from 'next/link'

const DashboardHomePage: FC = () => {
  const formData = useFormData(false, false, false)

  return (
    <div className="relative w-full mt-8">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Bienvenido al Dashboard
      </h1>

      <div className="mt-6 flex justify-center">
        <Link
          href="/dashboard/tracking"
          className="px-5 py-2 rounded-xl bg-brand-500 text-base font-medium text-white 
                     transition duration-200 hover:bg-brand-600 active:bg-brand-700 
                     dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Haz click para ir a la lista de rutas
        </Link>
      </div>
    </div>
  )
}

export default DashboardHomePage
