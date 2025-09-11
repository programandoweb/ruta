"use client";

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
import Link from 'next/link';
import useFormData from '@/hooks/useFormDataNew';

const weekdays = [
  { key: 1, name: 'Lun' },
  { key: 2, name: 'Mar' },
  { key: 3, name: 'Mié' },
  { key: 4, name: 'Jue' },
  { key: 5, name: 'Vie' },
  { key: 6, name: 'Sáb' },
  { key: 7, name: 'Dom' },
];

const CSRCalendarView: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const formData = useFormData(false, false, false);

  useEffect(() => {
    const getInit = async () => {
      const res = await formData.handleRequest(`${formData.backend}/dashboard/calendar_slots`, 'get');

      if (res?.availabilities) setAvailabilities(res.availabilities);

      if (res?.slots) {
        const slotsMapped = res.slots.map((slot: any) => {
          const jsDay = new Date(slot.date).getDay();
          const weekday = jsDay === 0 ? 7 : jsDay; // Domingo=7
          return { ...slot, weekday };
        });
        setSlots(slotsMapped);
      }
    };

    getInit();
  }, []);

  const uniqueHours = Array.from(
    new Set([
      ...availabilities.map((a: any) => a.start_time.slice(0,5)),
      ...slots.map((s: any) => s.start_time.slice(0,5))
    ])
  ).sort();

  const hours = uniqueHours.length > 0
    ? uniqueHours
    : Array.from({ length: 16 }, (_, i) => `${(6 + i).toString().padStart(2, '0')}:00`);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b bg-gray-100 text-center font-semibold">
          <div className="border p-2">Hora</div>
          {weekdays.map(day => (
            <div key={day.key} className="border p-2">{day.name}</div>
          ))}
        </div>

        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] border-b min-h-[40px]">
            <div className="border p-1 text-sm text-right pr-2 bg-gray-50">{hour}</div>
            {weekdays.map(day => {
              const slot = slots.find(
                (s: any) => s.weekday === day.key && s.start_time.slice(0,5) === hour
              );

              const isAvailable = availabilities.some(
                (a: any) => a.weekday === day.key && a.start_time.slice(0,5) === hour && a.status === 'activo'
              );

              const cellClasses = `
                border p-1 text-center text-xs 
                ${slot ? 'bg-green-300' 
                  : isAvailable ? 'cursor-pointer hover:bg-yellow-100' 
                  : 'bg-gray-200 opacity-50'}
              `;

              return (
                <div key={day.key + hour} className={cellClasses}>
                  {slot ? (
                    <Link href={`/dashboard/attention?slot_id=${slot.id}`} className="block w-full h-full">
                      <div>
                        <div className="font-bold">Reservado</div>
                        <div className="truncate">{slot.client?.name || 'Sin cliente'}</div>
                        <div className="truncate"><b>{slot.employee?.name || 'Sin empleado'}</b></div>
                      </div>
                    </Link>
                  ) : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSRCalendarView;
