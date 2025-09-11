<?php

namespace App\Services;

use App\Models\MasterTable;
use App\Models\StoreProductsIngredient;
use App\Models\StoreProducts;
use Illuminate\Support\Facades\DB;


class ProductService
{
    
    public function recalculation($id)
    {
        $storeProductsIngredient = StoreProductsIngredient::with(['inventory' => function($query) {
            // Ajustamos la consulta para que use los campos correctos
            $query->select('product_id', "cost")->orderBy('id',"desc");  // Asegúrate de agrupar por el campo correcto
        }])
        ->where('store_product_id', '=', $id)
        ->where('type', '=', 'raw')
        ->get();

        //dd($storeProductsIngredient[0]);
        $cost   =   0;

        foreach ($storeProductsIngredient as $key => $value) {
            // Aquí accedes a la suma de quantity de la relación inventory
            $totalQuantity  =   $value->inventory->cost ?? 0;
            $cost           +=  ($totalQuantity * $value->quantity);
            // Haces lo que necesites con la cantidad total            
        }

        $product            =   StoreProducts::find($id);
        $product->cost      =   $cost;
        $product->save();

        return $cost;        
    }

    
}
