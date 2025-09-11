/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

'use client';

import { useState } from 'react';

const SendTestMessage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '+573115000926', // Tu número Twilio activo
          //to:"+5215526589002",
          body: message || 'Mensaje de prueba desde Ivoolve',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(`✅ Enviado correctamente. SID: ${data.sid}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setResult(`❌ Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-center">Enviar mensaje de prueba</h2>

      <textarea
        className="w-full border rounded p-2"
        rows={4}
        placeholder="Escribe un mensaje para WhatsApp"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {result && <div className="text-sm text-center">{result}</div>}
    </div>
  );
};

export default SendTestMessage;
