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
import { db, Product, Category } from '@/db/indexedDB';
import useFormData from '@/hooks/useFormDataNew';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const useCatalog = () => {
  const formData = useFormData(false, false, false);
  const isOnline = useNetworkStatus();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [byDay, setByDay] = useState<any[]>([]);
  const [cashStatus, setCashStatus] = useState<'open' | 'closed'>('closed');

  useEffect(() => {
    const load = async () => {
      if (isOnline) {
        try {
          const res: any = await formData.handleRequest(
            formData.backend + '/open/getInit'
          );

          // ✅ Estado de caja
          if (res?.status) {
            setCashStatus(res.status);
          }

          // ✅ Productos
          if (res?.menu) {
            await db.products.clear();
            await db.products.bulkAdd(
              res.menu.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: Number(p.price),
                category: p.product_category?.name || '',
                stock: Number(p.stock) ?? 0,
              }))
            );
            setProducts(res.menu);
          }

          // ✅ Categorías
          if (res?.categories) {
            await db.categories.clear();
            await db.categories.bulkAdd(res.categories);
            setCategories(res.categories);
          }

          // ✅ Datos por día
          if (res?.byDay) {
            setByDay(res.byDay);
          }
        } catch (err) {
          console.error('❌ Error cargando desde backend, uso IndexedDB', err);
          setProducts(await db.products.toArray());
          setCategories(await db.categories.toArray());
          setCashStatus('closed'); // fallback
        }
      } else {
        // 🚨 Offline → usar IndexedDB
        setProducts(await db.products.toArray());
        setCategories(await db.categories.toArray());
        setCashStatus('closed'); // sin conexión asumimos caja cerrada
      }
    };

    load();
  }, [isOnline]);

  return { byDay, products, categories, isOnline, cashStatus };
};
