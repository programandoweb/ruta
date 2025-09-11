<?php

/**
 * ---------------------------------------------------
 *  Developed by: Jorge Méndez - Programandoweb
 *  Email: lic.jorgemendez@gmail.com
 *  Phone: 3115000926
 *  Website: Programandoweb.net
 *  Project: Ivoovle Inventory
 * ---------------------------------------------------
 */

namespace App\Exports;

use App\Models\Sales;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AccountsReceivableExport implements FromCollection, WithHeadings, WithMapping
{
    // Método para obtener la colección de datos
    public function collection()
    {
        // Filtrar las ventas pendientes de pago
        return Sales::where('payment_status', '!=', 'Pagado')
            ->with('customer') // Asegúrate de que la relación con el cliente esté definida en Sales
            ->get();
    }

    // Definir los encabezados de las columnas
    public function headings(): array
    {
        return [
            'ID de Venta',
            'Cliente',
            'Monto Total',
            'Monto Pagado',
            'Monto Pendiente',
            'Estado de Pago',
            'Fecha de Venta',
        ];
    }

    // Mapear los datos para cada fila
    public function map($sale): array
    {
        $pendingAmount = $sale->grand_total - $sale->paid_amount; // Calcula el monto pendiente

        return [
            $sale->id,
            optional($sale->customer)->name, // Nombre del cliente
            $sale->grand_total,
            $sale->paid_amount,
            $pendingAmount,
            $sale->payment_status,
            $sale->created_at->format('Y-m-d'), // Formato de fecha
        ];
    }
}
