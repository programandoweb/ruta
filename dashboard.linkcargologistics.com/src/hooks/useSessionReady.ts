'use client';

import { useEffect, useState } from 'react';

export default function useSessionReady(
  sessionId: string,
  intervalMs = 5000
): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let timer: NodeJS.Timeout;
    const token = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN;

    const check = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WHATSAPP_URL}/api/${sessionId}/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (res.ok) {
          const { ready: isReady } = await res.json();
          setReady(isReady);
          if (isReady) clearInterval(timer);
        }
      } catch (err) {
        console.error('Error checking status:', err);
      }
    };

    check();
    timer = setInterval(check, intervalMs);
    return () => clearInterval(timer);
  }, [sessionId]);

  return ready;
}
