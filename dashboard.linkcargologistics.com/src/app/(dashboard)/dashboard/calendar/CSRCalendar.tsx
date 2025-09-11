'use client';

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: +57 3115000926
 * Website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import useFormData from '@/hooks/useFormDataNew';
import SelectField from '@/components/fields/SelectField'; // Asegúrate de que esta ruta sea correcta

const weekdays = [
  { key: 1, name: 'Lun' },
  { key: 2, name: 'Mar' },
  { key: 3, name: 'Mié' },
  { key: 4, name: 'Jue' },
  { key: 5, name: 'Vie' },
  { key: 6, name: 'Sáb' },
  { key: 7, name: 'Dom' },
];

const prefixed = 'slots';
let formData: any; // Se asume que useFormData proporciona el objeto formData

const CSRCalendarView: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  // selectedEmployee y selectedClient ahora almacenarán directamente el ID
  const [selectedEmployee, setSelectedEmployee] = useState<any>('');
  const [selectedClient, setSelectedClient] = useState<any>('');
  const [isEditing, setIsEditing] = useState<boolean>(false); // Estado para saber si estamos editando

  formData = useFormData(false, false, false);

  useEffect(() => {
    const getInit = async () => {
      const res = await formData.handleRequest(
        `${formData.backend}/dashboard/calendar_slots`
      );

      if (res?.employees) {
        setEmployees(res.employees);
      }

      if (res?.clients) {
        setClients(res.clients);
      }

      if (res?.availabilities) {
        setAvailabilities(res.availabilities);
      }

      if (res?.[prefixed]) {
        const slotsFromApi = res[prefixed].map((slot: any) => {
          const dateObj = new Date(slot.date);
          const jsDay = dateObj.getDay();
          const weekday = jsDay === 0 ? 7 : jsDay; // Domingo es 0 en JS, lo mapeamos a 7
          return { ...slot, weekday };
        });
        setSlots(slotsFromApi);
      }
    };

    getInit();
  }, []);

  // Generar dinámicamente las horas desde availabilities
  const uniqueHours = Array.from(
    new Set(availabilities.map((a: any) => a.start_time.slice(0, 5)))
  ).sort();

  const hours = uniqueHours.length > 0
    ? uniqueHours
    : Array.from({ length: 16 }, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`);

  const handleAssignSlot = async () => {
    if (!selectedEmployee) {
      alert('Debe seleccionar un empleado.');
      return;
    }
    if (!selectedSlot) {
      alert('No hay un slot seleccionado.');
      return;
    }

    const method = isEditing ? 'put' : 'post'; // Determina el método HTTP
    const url = isEditing
      ? `${formData.backend}/dashboard/calendar_slots/asignar/${selectedSlot.id}` // URL para PUT (necesita el ID del slot)
      : `${formData.backend}/dashboard/calendar_slots/asignar`; // URL para POST

    try {
      const res = await formData.handleRequest(
        url,
        method,
        {
          slot: selectedSlot, // Se envía el objeto selectedSlot completo para la info de la fecha/hora/weekday
          employee_id: selectedEmployee,
          client_id: selectedClient,
        }
      );

      // Lógica de actualización de estados después de la respuesta de la API
      if (res?.employees) {
        setEmployees(res.employees);
      }

      if (res?.clients) {
        setClients(res.clients);
      }

      if (res?.availabilities) {
        setAvailabilities(res.availabilities);
      }

      if (res?.[prefixed]) {
        const slotsFromApi = res[prefixed].map((slot: any) => {
          const dateObj = new Date(slot.date);
          const jsDay = dateObj.getDay();
          const weekday = jsDay === 0 ? 7 : jsDay;
          return { ...slot, weekday };
        });
        setSlots(slotsFromApi);
      }

      // Cerrar modal y resetear estados
      setShowModal(false);
      setSelectedEmployee('');
      setSelectedClient('');
      setSelectedSlot(null);
      setIsEditing(false); // Resetea el estado de edición
    } catch (error) {
      console.error('Error al asignar/actualizar la cita:', error);
      alert('Hubo un error al procesar la cita. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b bg-gray-100 text-center font-semibold">
          <div className="border p-2">Hora</div>
          {weekdays.map((day) => (
            <div key={day.key} className="border p-2">{day.name}</div>
          ))}
        </div>

        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] border-b min-h-[40px]">
            <div className="border p-1 text-sm text-right pr-2 bg-gray-50">{hour}</div>
            {weekdays.map((day) => {
              const slot = slots.find(
                (s: any) => s.weekday === day.key && s.start_time.slice(0, 5) === hour
              );

              const isAvailable = availabilities.some((a: any) =>
                a.weekday === day.key &&
                a.start_time.slice(0, 5) === hour &&
                a.status === 'activo'
              );

              const cellClasses = `border p-1 text-center text-xs ${
                slot
                  ? 'bg-green-300 cursor-pointer hover:bg-green-400' // Habilitar clic en slots asignados para editar
                  : isAvailable
                  ? 'cursor-pointer hover:bg-yellow-100'
                  : 'bg-gray-200 opacity-50 cursor-not-allowed'
              }`;

              return (
                <div
                  key={day.key + hour}
                  className={cellClasses}
                  title={slot?.client ? `${slot.client.name} - ${slot.client.email}` : ''}
                  onClick={() => {
                    console.log(slot)
                    if (slot) { // Si hay un slot asignado, lo editamos
                      setSelectedSlot(slot);
                      setSelectedEmployee({ employee:slot?.employee_id?slot?.employee_id.toString():''}); // Establece el ID del empleado
                      setSelectedClient({clients:slot?.client_id?slot?.client_id.toString():''});     // Establece el ID del cliente
                      setIsEditing(true); // Modo edición
                      setShowModal(true);
                    } else if (isAvailable) { // Si no hay slot y está disponible, creamos uno nuevo
                      setSelectedSlot({ weekday: day.key, hour });
                      setSelectedEmployee(''); // Limpiar selecciones previas para nueva cita
                      setSelectedClient('');
                      setIsEditing(false); // Modo nueva asignación
                      setShowModal(true);
                    }
                  }}
                >
                  {slot ? (
                    <div>
                      <div className="font-bold">Reservado</div>
                      <div className="truncate">{slot.client?.name || 'Sin cliente'}</div>
                      <div className="truncate"><b>{slot.employee?.name || 'Sin empleado'}</b></div>
                    </div>
                  ) : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{isEditing ? 'Editar Cita' : 'Asignar Cita'}</h2>
            <SelectField
              id="employee"
              name="employee"
              placeholder="Seleccione un empleado"
              label="Empleado"
              required={true}
              // Corrección: defaultValue debe ser el ID directamente
              defaultValue={selectedEmployee?.employee} 
              setInputs={setSelectedEmployee}
              options={employees.map((e: any) => ({
                label: e.name,
                value: e.id,
              }))}
              variant="autenticación"
              extra="mb-4"
            />

            <SelectField
              id="clients"
              name="clients"
              placeholder="Seleccione un cliente"
              label="Cliente"
              required={true}
              // Corrección: defaultValue debe ser el ID directamente
              defaultValue={selectedClient?.clients} 
              setInputs={setSelectedClient}
              options={clients.map((e: any) => ({
                label: e.name,
                value: e.id,
              }))}
              variant="autenticación"
              extra="mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false); // Reinicia el estado de edición
                  setSelectedEmployee(''); // Limpia los campos
                  setSelectedClient('');
                  setSelectedSlot(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAssignSlot}
              >
                {isEditing ? 'Actualizar' : 'Asignar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSRCalendarView;