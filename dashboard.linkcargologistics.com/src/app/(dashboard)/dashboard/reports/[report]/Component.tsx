'use client';

import useFormData from '@/hooks/useFormDataNew';
import BtnBack from '@/components/buttom/BtnBack';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import InventoryStatusTable from './InventoryStatusTable';
import InventoryMovementsTable from './InventoryMovementsTable';
import KardexTableGrouped from './KardexTableGrouped';
import ProviderPurchasesTable from './ProviderPurchasesTable'; // Ajusta ruta
import ProductProfitTable from './ProductProfitTable';

const CSRReportComponent: React.FC = () => {
  const formData = useFormData(false, false, false);
  const pathname = usePathname();

  const [inventorySummary, setInventorySummary] = useState<any[]>([]);
  const [kardexData, setKardexData] = useState<any[]>([]);
  const [providerPurchases, setProviderPurchases] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  const getInit = () => {
    formData
      .handleRequest(formData.backend + pathname)
      .then((res: any) => {
        if (res?.raws) setInventorySummary(res.raws);
        if (res?.movements) setInventorySummary(res.movements);
        if (res?.kardex) setKardexData(res.kardex);
        if (res?.purchases) setProviderPurchases(res.purchases);
        if (res?.rows) setRows(res.rows);
      });
  };

  useEffect(getInit, []);

  return (
    <form>
      <div className="h-12 mb-4">
        <BtnBack back />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        {pathname === '/dashboard/reports/inventory-status' && (
          <InventoryStatusTable data={inventorySummary} />
        )}
        {pathname === '/dashboard/reports/inventory-movements' && (
          <InventoryMovementsTable data={inventorySummary} />
        )}
        {pathname === '/dashboard/reports/kardex' && (
          <KardexTableGrouped data={kardexData} />
        )}
        {pathname === '/dashboard/reports/provider-purchases' && (
          <ProviderPurchasesTable data={providerPurchases} />
        )}
        {pathname === '/dashboard/reports/ganance-purchases' && (
          <ProductProfitTable data={rows} />
        )}
      </div>
    </form>
  );
};

export default CSRReportComponent;
