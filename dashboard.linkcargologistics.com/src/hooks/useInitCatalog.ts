/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

import { useEffect } from 'react';
import { db, Product, Category } from '@/db/indexedDB';
import useFormData from '@/hooks/useFormDataNew';

export const useInitCatalog = () => {
  const formData = useFormData(false, false, false);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        // 🚀 consulta al backend
        const res: any = await formData.handleRequest(
          formData.backend + '/open/getInit'
        );

        if (res?.menu && Array.isArray(res.menu)) {
          // limpiar catálogo viejo
          await db.products.clear();
          // insertar catálogo nuevo
          await db.products.bulkAdd(
            res.menu.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              category: p.product_category?.name || '',
              stock: Number(p.stock) ?? 0,
            })) as Product[]
          );
          console.log('✅ Productos actualizados en IndexedDB');
        }

        if (res?.categories && Array.isArray(res.categories)) {
          await db.categories.clear();
          await db.categories.bulkAdd(res.categories as Category[]);
          console.log('✅ Categorías (mesas/áreas) actualizadas en IndexedDB');
        }
      } catch (e) {
        console.error('❌ Error cargando catálogo offline', e);
      }
    };

    loadCatalog();
  }, []);
};
