<?php

namespace App\Enums;

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

enum PaymentEnumStatus: string
{
    // Payment status (sales)
    case PaymentPending     =   'En Espera';
    case PaymentDebit       =   'Débito';
    case PaymentPartial     =   'Parcial';
    case PaymentCompleted   =   'Pagado';

    // Sale status (sales)
    case SalePending = 'En Espera';
    case SaleFinalized = 'Finalizado';
    case SaleCancelled = 'Anulado';

    // Method to retrieve groups
    public static function groups(): array
    {
        return [
            'Payments' => [
                self::PaymentPending,
                self::PaymentDebit,
                self::PaymentPartial,
                self::PaymentCompleted,
            ],
            'Sales' => [
                self::SalePending,
                self::SaleFinalized,
                self::SaleCancelled,
            ],
        ];
    }
}
