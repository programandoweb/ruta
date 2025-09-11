<?php

namespace App\Services;

use App\Models\MasterTable;

class Ingredients
{
    /**
     * Consulta la tabla MasterTable basado en el grupo.
     *
     * @param string $key
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getIngredientsByGroup(string $key)
    {
        return MasterTable::selectRaw("*, (SELECT label FROM master_tables mt WHERE mt.id=master_tables.medida_id) as medida")
                            ->where('grupo', $key)
                            ->orderBy("label")
                            ->get();
    }

    public function getUnitsOfMeasurement()
    {
        return MasterTable::selectRaw("*, (SELECT label FROM master_tables mt WHERE mt.id=master_tables.medida_id) as medida")
                            ->where('grupo', "units_of_measurement")
                            ->orderBy("label")
                            ->get();
    }

    public function getPackageType()
    {
        return MasterTable::selectRaw("*, (SELECT label FROM master_tables mt WHERE mt.id=master_tables.medida_id) as medida")
                            ->where('grupo', "packaging_type_id")
                            ->orderBy("label")
                            ->get();
    }

}
