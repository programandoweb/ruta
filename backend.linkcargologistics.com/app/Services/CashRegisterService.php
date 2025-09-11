<?php

namespace App\Services;

use App\Models\CashRegister;
use App\Models\MasterTable;

class CashRegisterService
{
    
    public function verifyCashRegisterStatus($user_id,$status)
    {
        return MasterTable::selectRaw("label,
                                            id, 
                                            (CASE 
                                                WHEN (SELECT COUNT(*) 
                                                        FROM cash_registers so 
                                                        WHERE so.cash_register_id=master_tables.id
                                                        AND status='".$status."'
                                                        AND user_operator_id='".$user_id."'
                                                    ) = 0 THEN 'Disponible'
                                                ELSE 'No Disponible'
                                            END) as assigned")
                            ->where('grupo', "cash_register")
                            ->orderBy("label")
                            ->get();

    }

}
