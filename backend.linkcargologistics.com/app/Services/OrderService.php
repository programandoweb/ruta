<?php

namespace App\Services;

use App\Models\MasterTable;

class OrderService
{
    
    public function table($id)
    {
        return MasterTable::selectRaw("
            *,
            label,
            id, 
            (   SELECT order_number 
                FROM store_orders so 
                WHERE so.table_id=master_tables.id
                AND so.status='open') as cuenta
        ")
        ->with('order', function ($query) use ($id) {
            $query->where('table_id', $id);
            $query->where('status', 'open');
        })
        ->whereHas('order', function ($query) use ($id) {
            $query->where('table_id', $id);
            $query->where('status', 'open');
        })
        ->where('grupo', "tables")
        ->orderBy("label")
        ->first();
    }

    public function tables()
    {
        return MasterTable::selectRaw(" label,
                                        id, 
                                        (   SELECT order_number 
                                                FROM store_orders so 
                                                    WHERE so.table_id=master_tables.id
                                                        AND so.status='open') as cuenta")
                            ->with("order")
                            ->where('grupo', "tables")
                            ->orderBy("label")
                            ->get();
    }

    public function taxes()
    {
        return MasterTable::selectRaw(" label,
                                        id,
                                        value")
                            ->with("order")
                            ->where('grupo', "tax")
                            ->where('value',">", "0")
                            ->orderBy("label")
                            ->get();
    }

}
