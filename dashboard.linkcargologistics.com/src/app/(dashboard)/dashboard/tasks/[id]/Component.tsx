"use client";

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import SelectField from '@/components/fields/SelectField';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const prefixed = 'task';

const EventTaskFormComponent: React.FC<any> = () => {
  const formData = useFormData(false, false, false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [statuses] = useState<any[]>([
    { id: 'pendiente', name: 'Pendiente' },
    { id: 'en_progreso', name: 'En progreso' },
    { id: 'completada', name: 'Completada' },
    { id: 'cancelada', name: 'Cancelada' },
  ]);
  const [events, setEvents] = useState<any[]>([]);
  const [servicesForEvent, setServicesForEvent] = useState<any[]>([]);

  const [inputs, setInputs] = useState<any>({
    name: '',
    description: '',
    start_date: '',
    due_date: '',
    status: 'pendiente',
    client_id: '',
    event_id: '',
    servicio_id: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (e) { console.error('Parse user error:', e); }
    }
  }, []);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((res: any) => {
        if (res?.employees) {
          setEmployees(res.employees);
        }
        if (res?.[prefixed]) setInputs(res[prefixed]);
        if (res?.servicios) setEvents(res.servicios); // eventos con servicios
      });
  };

  useEffect(getInit, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(
        formData.backend + location.pathname,
        inputs.id ? 'put' : 'post',
        { ...inputs }
      )
      .then(() => {
        router.replace('/dashboard/tasks');
      });
  };

  useEffect(() => {
    if (inputs.event_id) {
      const selectedEvent = events.find(ev => String(ev.id) === String(inputs.event_id));
      if (selectedEvent && selectedEvent.items?.length > 0) {
        // Mapear servicios
        const mappedServices = selectedEvent.items.map((item: any) => ({
          id: item.servicio?.id,
          name: item.servicio?.name,
        }));
        setServicesForEvent(mappedServices);

        // Establecer client_id usando el primer item del evento
        const clientIdFromEvent = selectedEvent.items[0].event?.user_id;
        if (clientIdFromEvent) {
          setInputs((prev: any) => ({
            ...prev,
            client_id: clientIdFromEvent,
          }));
        }
      } else {
        setServicesForEvent([]);
        setInputs((prev: any) => ({ ...prev, client_id: '' }));
      }
    } else {
      setServicesForEvent([]);
      setInputs((prev: any) => ({ ...prev, client_id: '' }));
    }
  }, [inputs.event_id, events]);

  console.log(inputs.employee_id)

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <SelectField
                id="employee_id"
                name="employee_id"
                placeholder="Seleccione un empleado"
                label="Empleado"
                required={true}
                // Corrección: defaultValue debe ser el ID directamente
                defaultValue={inputs?.employee_id} 
                setInputs={setInputs}
                options={employees.map((e: any) => ({
                  label: e.name,
                  value: e.id,
                }))}
                variant="autenticación"
                extra="mb-4"
              />
              <InputField
                required
                prefixed={prefixed}
                name="name"
                label="Nombre de la tarea"
                id="name"
                type="text"
                defaultValue={inputs.name}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="description"
                label="Descripción de la tarea"
                id="description"
                type="text"
                defaultValue={inputs.description}
                setInputs={setInputs}
              />

              <SelectField
                prefixed={prefixed}
                name="event_id"
                label="Evento"
                id="event_id"
                defaultValue={inputs.event_id}
                setInputs={setInputs}
                options={events.map((ev) => ({ id: ev.id, name: ev.label }))}
                variant="autenticación"
                extra="mb-0"
              />

              <SelectField
                prefixed={prefixed}
                name="servicio_id"
                label="Servicio del evento"
                id="servicio_id"
                defaultValue={inputs.servicio_id}
                setInputs={setInputs}
                options={servicesForEvent}
                variant="autenticación"
                extra="mb-0"
              />

              <InputField
                prefixed={prefixed}
                name="start_date"
                label="Fecha de inicio"
                id="start_date"
                type="datetime-local"
                defaultValue={inputs.start_date}
                setInputs={setInputs}
              />
              <InputField
                prefixed={prefixed}
                name="due_date"
                label="Fecha límite"
                id="due_date"
                type="datetime-local"
                defaultValue={inputs.due_date}
                setInputs={setInputs}
              />

              <SelectField
                prefixed={prefixed}
                name="status"
                label="Estado de la tarea"
                id="status"
                defaultValue={inputs.status}
                setInputs={setInputs}
                options={statuses}
                variant="autenticación"
                extra="mb-0"
              />             
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default EventTaskFormComponent;
