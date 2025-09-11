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

use App\Models\SalesPayments;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PaymentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return SalesPayments::with('customer', 'sale')->get();
    }

    public function headings(): array
    {
        return [
            'ID Pago',
            'Cliente',
            'Referencia de Pago',
            'Monto Pagado',
            'Método de Pago',
            'Fecha de Pago',
        ];
    }

    public function map($payment): array
    {
        return [
            $payment->id,
            optional($payment->customer)->name, // Nombre del cliente
            $payment->payment_reference, // Referencia del pago
            $payment->amount, // Monto pagado
            $payment->paying_method, // Método de pago
            $payment->created_at->format('Y-m-d'), // Fecha de pago
        ];
    }
}
