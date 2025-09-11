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

use App\Models\InventoryEntries;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InventoryEntriesExport implements FromCollection, WithHeadings, WithMapping
{
    // Método para obtener la colección de datos
    public function collection()
    {
        return InventoryEntries::with('product', 'unitOfMeasurement', 'raw', 'paids', 'suppliers')->where("quantity",">",0)->get();
    }

    // Encabezados de las columnas
    public function headings(): array
    {
        return [
            'ID',
            'Producto',
            'Cantidad',
            //'Unidad de Medida',
            //'Tipo de Entrada',
            'Proveedor',
            'Costo',
            //'ID Orden de Producción',
            //'Pagos Asociados',
        ];
    }

    // Mapear los datos para cada fila
    public function map($entry): array
    {
        if($entry->quantity>0){
            return [
                $entry->id,
                optional($entry->product)->label, // Nombre del producto
                $entry->quantity,
                //optional($entry->unitOfMeasurement)->name, // Unidad de medida
                //$entry->entry_type,
                optional($entry->suppliers)->name, // Proveedor (de la tabla master_tables)
                $entry->cost,
                //$entry->production_orders_id,
                //$entry->paids->pluck('amount')->implode(', '), // Pagos asociados, concatenados
            ];
        }        
    }
}
