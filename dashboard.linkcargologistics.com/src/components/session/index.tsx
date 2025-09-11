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
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { hydrateUser } from '@/store/Slices/userSlice'

const IndexSession: NextPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(hydrateUser())
  }, [dispatch])

  return <div></div>
}

export default IndexSession
