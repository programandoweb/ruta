<?php

namespace App\Enums;

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoovle *  
 * ---------------------------------------------------
 */
 
enum ProductionStatus: string
{
    // Group 1: Production
    case Cut = 'Cortado';
    case Assembled = 'Armado';

    // Group 2: Preparation
    case Prepared = 'Alistado';
    case Lacquered = 'Laqueado';

    // Group 3: Assembly
    case Assembly = 'Ensamble';

    // Group 4: Finalization
    case Finalized = 'Finalizado';

    // Other states for additional tables (store_orders, store_order_items, etc.)
    case Open = 'open';
    case Close = 'close';
    case Trash = 'trash';

    // Group of accounting transactions
    case Sale = 'sale';
    case Purchase = 'purchase';
    case Payment = 'payment';
    case Receipt = 'receipt';
    case Tax = 'tax';

    // Sales status (sales)
    case SalePending = 'Venta en Espera';
    case SaleFinalized = 'Venta Finalizada';
    case SaleCancelled = 'Anulado';

    // Payment status (sales)
    case PaymentPending = 'Pago en Espera';
    case PaymentDebit = 'Débito';
    case PaymentPartial = 'Parcial';
    case PaymentCompleted = 'Pagado';

    // Payment methods (sales_payments)
    case Cash = 'Efectivo';
    case Transfer = 'Transferencia';
    case Credit = 'Crédito';

    // Method to retrieve groups
    public static function groups(): array
    {
        return [
            'Production' => [self::Cut, self::Assembled, self::Prepared, self::Lacquered, self::Assembly, self::Finalized],
            'Orders' => [self::Open, self::Close, self::Trash],
            'Transactions' => [self::Sale, self::Purchase, self::Payment, self::Receipt, self::Tax],
            'Sales' => [self::SalePending, self::SaleFinalized, self::SaleCancelled],
            'Payments' => [self::PaymentPending, self::PaymentDebit, self::PaymentPartial, self::PaymentCompleted],
            'Payment Methods' => [self::Cash, self::Transfer, self::Credit],
        ];
    }
}
