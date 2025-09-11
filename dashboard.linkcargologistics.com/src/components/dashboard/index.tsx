'use client'

import { FC } from 'react'
import useFormData from '@/hooks/useFormDataNew' // Asumo que este hook se sigue utilizando para otras funcionalidades del dashboard
import WeeklyCalendar from '../calendar/WeeklyCalendar'
import FoodMesas from '../menu/FoodMesas'

const DashboardHomePage: FC = () => {
  // Se eliminan todos los estados relacionados con la búsqueda
  // const [searchTerm, setSearchTerm] = useState('')
  // const [suggestions, setSuggestions] = useState<any[]>([])
  // const [selectedResult, setSelectedResult] = useState<any | null>(null)

  const formData = useFormData(false, false, false) // Se mantiene por si se usa para otras cosas en el dashboard

  // Se eliminan todas las funciones relacionadas con la búsqueda y el renderizado de tarjetas
  // const searchInBackend = (search: string) => { ... }
  // useEffect(() => { ... }, [searchTerm]);
  // const handleSaveToLocalStorage = (item: any) => { ... }
  // const renderCard = () => { ... }

  return (
    <div className="relative w-full mt-8">
      {/* Se elimina todo el JSX relacionado con el input de búsqueda, sugerencias y la tarjeta */}
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Bienvenido al Dashboard
      </h1>
      <p className="text-center text-gray-600 mt-0">
        Aquí podrás ver la información general de tu panel.        
      </p>    
      <FoodMesas/> 
    </div>
  )
}

export default DashboardHomePage