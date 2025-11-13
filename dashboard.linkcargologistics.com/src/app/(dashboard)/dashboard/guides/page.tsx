'use client';
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect, useState } from 'react';
import useFormData from '@/hooks/useFormDataNew';

const RemoteGuides = () => {
  const formData = useFormData(false, false, false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postJson = async (endpoint: string, payload: any) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Request error');
    return data;
  };

  const getInit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await formData.handleRequest(
        formData.backend + '/dashboard/get-token'
      );

      if (response && response.tokens) {
        setTokens(response.tokens);

        const firstToken = response.tokens?.[0]?.token ?? response.tokens?.[0] ?? '';
        if (firstToken) {
          const data = await postJson(firstToken.options + '/apirest/get/guides', {
            token: firstToken.value,
          });
          const payload = Array.isArray(data) ? data : data?.data ?? [];
          setGuides(payload);
        }
      }
    } catch (err: any) {
      console.error('Error al cargar guías:', err);
      setError('Error al cargar guías desde el backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInit();
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Cargando guías...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Listado de Guías Remotas</h2>

      {guides.length === 0 ? (
        <div className="text-gray-500 text-sm">No hay guías registradas.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left"># Guía</th>
                <th className="px-4 py-2 border-b text-left">Remitente</th>
                <th className="px-4 py-2 border-b text-left">Destinatario</th>
                <th className="px-4 py-2 border-b text-left">Origen</th>
                <th className="px-4 py-2 border-b text-left">Destino</th>
                <th className="px-4 py-2 border-b text-left">Tamaño</th>
                <th className="px-4 py-2 border-b text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((g: any) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b font-semibold text-blue-600">{g.guideNumber}</td>
                  <td className="px-4 py-2 border-b">{g.name_sender}</td>
                  <td className="px-4 py-2 border-b">{g.name_receives}</td>
                  <td className="px-4 py-2 border-b">{g.output_address}</td>
                  <td className="px-4 py-2 border-b">{g.delivery_address}</td>
                  <td className="px-4 py-2 border-b">{g.size}</td>
                  <td className="px-4 py-2 border-b text-xs text-gray-500">
                    {new Date(g.created_at).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RemoteGuides;
