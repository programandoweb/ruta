import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface LinkItem {
  url: string | null
  label: string
  active: boolean
}

interface PaginatorData {
  current_page: number
  data: any[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: LinkItem[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

interface TablePaginationProps {
  paginator: PaginatorData
}

const WINDOW_SIZE = 5
const HALF_WINDOW = Math.floor(WINDOW_SIZE / 2)

const TablePagination: React.FC<TablePaginationProps> = ({ paginator }) => {
  const router = useRouter()
  const params = useSearchParams()
  const search = params.get('search') ?? ''
  const grupo = params.get('grupo') ?? ''
  const per_page = params.get('per_page') ?? `${paginator.per_page}`
  const page = Number(params.get('page') ?? paginator.current_page)
  const totalPages = paginator.last_page

  // Cálculo de rango central
  let start = Math.max(1, page - HALF_WINDOW)
  let end = Math.min(totalPages, start + WINDOW_SIZE - 1)
  if (end - start + 1 < WINDOW_SIZE) {
    start = Math.max(1, end - WINDOW_SIZE + 1)
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // Generar bloques de selección
  const blocks = Array.from(
    { length: Math.ceil(totalPages / WINDOW_SIZE) },
    (_, i) => {
      const first = i * WINDOW_SIZE + 1
      const last = Math.min((i + 1) * WINDOW_SIZE, totalPages)
      return { label: `${first}-${last}`, start: first }
    }
  )

  const changePage = (p: number) => {
    router.replace(
      `?search=${encodeURIComponent(search)}&grupo=${encodeURIComponent(
        grupo
      )}&page=${p}&per_page=${per_page}`
    )
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-4">
      {/* Select de bloques */}
      <select
        value={
          blocks.find((b) => page >= b.start && page < b.start + WINDOW_SIZE)
            ?.start
        }
        onChange={(e) => changePage(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {blocks.map((b) => (
          <option key={b.start} value={b.start}>
            {b.label}
          </option>
        ))}
      </select>

      {/* Botón Anterior */}
      <button
        onClick={() => changePage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      {/* Páginas centrales */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => changePage(p)}
          className={`px-3 py-1 border rounded ${
            p === page ? 'bg-gray-300' : ''
          }`}
        >
          {p}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => changePage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  )
}

export default TablePagination
