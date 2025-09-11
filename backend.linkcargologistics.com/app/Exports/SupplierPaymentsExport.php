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

use App\Models\RawMaterialPaid;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SupplierPaymentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return RawMaterialPaid::with('supplier', 'inventoryEntry.rawMaterial', 'inventoryEntry.paidAmounts')->get();
    }

    public function headings(): array
    {
        return [
            'ID Pago',
            'Proveedor',
            'Nombre Materia Prima',
            'Monto Factura',
            'Monto Pagado',
            'Monto Restante',
            'Fecha de Pago',
        ];
    }

    public function map($payment): array
    {
        // Calcula el monto total de la factura
        $invoiceAmount = optional($payment->inventoryEntry)->cost * optional($payment->inventoryEntry)->quantity;
        
        // Suma todos los pagos realizados para esta entrada de inventario
        $totalPaid = $payment->inventoryEntry->paidAmounts->sum('amount_paid');

        // Calcula el monto restante
        $remainingAmount = $invoiceAmount - $totalPaid;

        return [
            $payment->id,
            optional($payment->supplier)->name, // Nombre del proveedor
            optional($payment->inventoryEntry->rawMaterial)->label, // Nombre de la materia prima
            $invoiceAmount, // Monto de la factura (cost * quantity)
            $payment->amount_paid, // Monto pagado en este pago
            $remainingAmount, // Monto restante
            $payment->created_at->format('Y-m-d'), // Fecha de pago
        ];
    }
}
