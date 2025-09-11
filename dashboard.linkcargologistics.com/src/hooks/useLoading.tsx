// useLoading.js
import { useState } from 'react'
import {  AnimatePresence } from 'framer-motion'

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState)

  const LoadingIcon = () => (
    <AnimatePresence>
      {loading && (
        <div className="flex items-center justify-center bg-black bg-opacity-20 h-20">
          Cargando...          
        </div>
      )}
    </AnimatePresence>
  )

  return { loading, setLoading, LoadingIcon }
}
