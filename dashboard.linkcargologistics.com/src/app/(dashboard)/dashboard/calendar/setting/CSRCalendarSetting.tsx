'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import Card from '@/components/card';
import BtnBack from '@/components/buttom/BtnBack';
import useFormData from '@/hooks/useFormDataNew';

const weekdays = [
  { key: 1, name: 'Lunes' },
  { key: 2, name: 'Martes' },
  { key: 3, name: 'Miércoles' },
  { key: 4, name: 'Jueves' },
  { key: 5, name: 'Viernes' },
  { key: 6, name: 'Sábado' },
  { key: 7, name: 'Domingo' },
];

const prefixed = 'availabilities';
let formData: any;

const CSRCalendar: React.FC = () => {
  const [availability, setAvailability] = useState<any[]>(
    weekdays.map((day) => ({
      weekday: day.key,
      slots: [],
    }))
  );

  formData = useFormData(false, false, false);

  useEffect(() => {
    const getInit = async () => {
      const res = await formData.handleRequest(
        `${formData.backend}/dashboard/calendar_availabilities`
      );

      if (res?.[prefixed]) {
        const slotsFromApi = res[prefixed];

        const grouped = weekdays.map((day) => {
          const daySlots = slotsFromApi
            .filter((slot: any) => slot.weekday === day.key)
            .map((slot: any) => ({
              start: slot.start_time.slice(0, 5),
              end: slot.end_time.slice(0, 5),
            }));

          return {
            weekday: day.key,
            slots: daySlots,
          };
        });

        setAvailability(grouped);
      }
    };

    getInit();
  }, []);

  const handleSlotChange = (
    weekday: number,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? {
              ...day,
              slots: day.slots.map((slot: any, i: number) =>
                i === index ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
  };

  const addSlot = (weekday: number) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? { ...day, slots: [...day.slots, { start: '', end: '' }] }
          : day
      )
    );
  };

  const removeSlot = (weekday: number, index: number) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.weekday === weekday
          ? { ...day, slots: day.slots.filter((_: any, i: number) => i !== index) }
          : day
      )
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir payload con estructura esperada por el backend:
    const payload = {
      availability: availability.flatMap((day) =>
        day.slots
          .filter((slot: any) => slot.start && slot.end)
          .map((slot: any) => ({
            weekday: day.weekday,
            start: slot.start,
            end: slot.end,
          }))
      ),
    };

    formData
      .handleRequest(
        `${formData.backend}/dashboard/calendar_availabilities`,
        'post',
        payload
      )
      .then((res: any) => {
        if (res?.success) {
          console.log('Disponibilidad guardada correctamente');
          // Aquí podrías redirigir, mostrar notificación, etc.
        }
      })
      .catch((err: any) => {
        console.error('Error guardando disponibilidad:', err);
      });
  };


  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {availability.map((day) => (
          <Card key={day.weekday}>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {weekdays.find((w) => w.key === day.weekday)?.name}
              </h3>
              {day.slots.map((slot: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleSlotChange(day.weekday, index, 'start', e.target.value)
                    }
                    className="border rounded px-2 py-1 w-28"
                    required
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleSlotChange(day.weekday, index, 'end', e.target.value)
                    }
                    className="border rounded px-2 py-1 w-28"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(day.weekday, index)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSlot(day.weekday)}
                className="mt-2 text-blue-600 hover:underline"
              >
                + Añadir franja horaria
              </button>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};

export default CSRCalendar;
