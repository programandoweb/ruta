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

use App\Models\StoreProducts;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    // Obtener la colección de productos
    public function collection()
    {
        return StoreProducts::all(); // Ajusta la consulta si necesitas filtrar productos específicos
    }

    // Definir los encabezados de las columnas
    public function headings(): array
    {
        return [
            'ID',
            'Nombre del Producto',
            'Precio',
            //'Cantidad en Inventario',
            'Fecha de Creación',
        ];
    }

    // Mapear los datos para cada fila
    public function map($product): array
    {
        return [
            $product->id,
            $product->name, // Nombre del producto
            $product->price,
            //$product->quantity, // Cantidad disponible en inventario
            $product->created_at->format('Y-m-d'), // Formato de fecha
        ];
    }
}
