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

import Card from '@/components/card';
import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import InputField from '@/components/fields/InputField';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const prefixed = 'event';

const formatCOP = (value: number | string | null | undefined): string => {
  const number = typeof value === 'string' ? Number(value) : value;
  if (isNaN(number as number) || number == null) return '$0';
  return `$${(number as number).toLocaleString('es-CO')}`;
};

const parsePrice = (price: any): number => {
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 0 : parsed;
};

const EventFormComponent: React.FC<any> = (props) => {
  const formData = useFormData(false, false, false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [inputs, setInputs] = useState<any>({
    title: '',
    event_date: '',
    budget: '',
    guests: '',
    notes: '',
  });

  const [items, setItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getInit = () => {
    formData.handleRequest(formData.backend + location.pathname).then((response: any) => {
      if (response && response[prefixed]) {
        setInputs(response[prefixed]);
        if (response[prefixed].items) setItems(response[prefixed].items);
        if (response.services) setServices(response.services);
      }
    });
  };

  const getTotalContratado = () => {
    let total = 0;
    items.forEach((row) => {
      total += parsePrice(row.servicio?.price);
    });
    return total;
  };

  useEffect(getInit, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    formData
      .handleRequest(formData.backend + location.pathname, inputs.id ? 'put' : 'post', { ...inputs })
      .then((response: any) => {
        if (props?.params?.id === 'new') {
          router.replace('/dashboard/events/' + response?.event?.id);
        } else {
          router.replace('/dashboard/events');
        }
      });
  };

  const handleAddService = () => {
    if (!selectedService) return;

    const serviceData = services.find((s: any) => s.id === parseInt(selectedService));
    if (!serviceData) return;

    const simulatedItem = {
      id: Date.now(),
      quantity: 1,
      notes: `Servicio agregado manualmente: ${serviceData.name}`,
      servicio: serviceData,
    };

    setItems([...items, simulatedItem]);
    setSelectedService(null);
    onSubmitNewService(serviceData);
  };

  const onSubmitNewService = (data: any) => {
    formData.handleRequest(formData.backend + location.pathname + "/addItem", 'post', {
      ...inputs,
      newServiceId: data.id,
    }).then((response: any) => {
      console.log(response);
    });
  };

  const total = getTotalContratado();
  const presupuesto = parsePrice(inputs.budget);
  const saldo = Math.max(0, presupuesto - total);

  const usedServiceIds = items.map((item) => item.servicio?.id);
  const availableServices = services.filter((s) => !usedServiceIds.includes(s.id));

  const handleRemoveItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    formData
      .handleRequest(formData.backend + location.pathname + "/removeItem", 'post', {
        ...inputs,
        itemId: id,
      })
      .then((response: any) => {
        console.log('Removed:', response);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="h-12 mb-4">
        <BtnBack back save={user?.role === 'clients'} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        <Card className="mt-2">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <InputField
                disabled={user?.role !== 'clients'}
                required
                prefixed={prefixed}
                name="title"
                label="Título del evento"
                placeholder="Ej: Fiesta de Camila"
                id="title"
                type="text"
                defaultValue={inputs.title}
                setInputs={setInputs}
              />
              <InputField
                disabled={user?.role !== 'clients'}
                required
                prefixed={prefixed}
                name="event_date"
                label="Fecha tentativa"
                id="event_date"
                type="date"
                defaultValue={inputs.event_date}
                setInputs={setInputs}
              />
              <InputField
                disabled={user?.role !== 'clients'}
                required
                prefixed={prefixed}
                name="budget"
                label="Presupuesto"
                id="budget"
                type="number"
                defaultValue={inputs.budget}
                setInputs={setInputs}
              />
              <InputField
                disabled={user?.role !== 'clients'}
                required
                prefixed={prefixed}
                name="guests"
                label="Número de invitados"
                id="guests"
                type="number"
                defaultValue={inputs.guests}
                setInputs={setInputs}
              />
              <InputField
                disabled={user?.role !== 'clients'}
                prefixed={prefixed}
                name="notes"
                label="Notas u observaciones"
                id="notes"
                type="text"
                defaultValue={inputs.notes}
                setInputs={setInputs}
              />
            </div>
          </div>
        </Card>

        {items.length > 0 && (
          <Card className="mt-2">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Servicios contratados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded p-4 shadow-sm">
                    <div className="text-sm text-gray-500 font-semibold">{item.servicio?.name}</div>
                    <div className="text-xs text-gray-400">{item.servicio?.location}</div>
                    <div className="mt-2 text-sm">{item.servicio?.description}</div>

                    {/* NUEVO: Mostrar status del item */}
                    <div className="mt-2 text-xs">
                      <span className="font-medium text-gray-600">Estado:</span>{' '}
                      <span className={item.status === 'aceptado' ? 'text-green-700 font-semibold' : 'text-yellow-600 font-semibold'}>
                        {item.status === 'aceptado' ? 'Aceptado' : 'Pendiente'}
                      </span>
                    </div>

                    {user?.role === 'clients' && (
                      <Fragment>
                        {item.servicio?.contact_phone && (
                          <a
                            href={item.servicio.whatsapp_link}
                            target="_blank"
                            className="text-xs text-green-600 underline mt-1 block"
                            rel="noreferrer"
                          >
                            WhatsApp
                          </a>
                        )}
                        <button
                          type="button"
                          className="mt-2 text-xs text-red-600 underline"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Eliminar
                        </button>
                      </Fragment>
                    )}
                  </div>
                  ))
                }

              </div>
            </div>
          </Card>
        )}

        {inputs.id && user?.role === 'clients' && (
          <Fragment>
            <Card className="mt-2">
              <div className="p-4">
                <div className="mt-6 flex gap-4 items-end">
                  <div className="flex-1">
                    <label htmlFor="serviceSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Selecciona un servicio para agregar
                    </label>
                    <select
                      id="serviceSelect"
                      value={selectedService || ''}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">-- Seleccionar --</option>
                      {availableServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    onClick={handleAddService}
                    disabled={!selectedService}
                  >
                    Agregar
                  </button>
                </div>

                <hr className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-700">
                    <strong>Presupuesto del evento:</strong><br />
                    {formatCOP(presupuesto)}
                  </div>
                  <div className={`font-semibold ${total > presupuesto ? 'text-red-600' : 'text-green-600'}`}>
                    Total servicios contratados:<br />
                    {formatCOP(total)}
                  </div>
                  <div className="text-gray-800 font-medium">
                    Saldo disponible:<br />
                    {formatCOP(saldo)}
                  </div>
                </div>
              </div>
            </Card>
          </Fragment>
        )}
      </div>
    </form>
  );
};

export default EventFormComponent;
