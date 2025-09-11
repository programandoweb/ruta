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

class SalesExport implements FromCollection, WithHeadings, WithMapping
{
    // Obtener todos los datos de ventas, incluyendo la relación con el cliente
    public function collection()
    {
        return Sales::with('customer')->get();
    }

    // Definir los encabezados de las columnas
    public function headings(): array
    {
        return [
            'ID',
            'Referencia',
            'Nombre del Cliente',
            'Cantidad Total',
            'Descuento Total',
            'Impuesto Total',
            'Precio Total',
            'Gran Total',
            'Estado de Venta',
            'Estado de Pago',
            'Fecha de Creación',
        ];
    }

    // Mapear cada fila con los datos necesarios
    public function map($sale): array
    {
        return [
            $sale->id,
            $sale->reference_no,
            optional($sale->customer)->name, // Obtener el nombre del cliente (puede ser null)
            $sale->total_quantity,
            $sale->total_discount,
            $sale->total_tax,
            $sale->total_price,
            $sale->grand_total,
            $sale->sale_status,
            $sale->payment_status,
            $sale->created_at->format('Y-m-d'), // Formato de fecha
        ];
    }
}
