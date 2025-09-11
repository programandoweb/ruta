<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MasterTable extends Model
{
    use HasFactory;

    public $timestamps = false;

    private $fechaInicioQuincena;
    private $fechaFinQuincena; 

    public function initializeDates()
    {
        $fechaSelect = Carbon::now()->format('d');
        
        if ($fechaSelect > 15) {
            $this->fechaInicioQuincena      =   Carbon::now()->endOfMonth()->subDays(17);
            $this->fechaFinQuincena         =   Carbon::now()->endOfMonth();             
        } else {
            $this->fechaInicioQuincena      =   Carbon::now()->startOfMonth();
            $this->fechaFinQuincena         =   Carbon::now()->endOfMonth()->subDays(16);
        }
    }


    protected $fillable = [
        'label',
        'grupo',
        'value',        
        'medida_id',
        'icon',
        'description',
        'bool_status',
        'conversion',
        'options',
    ];

    public function childrens()
    {
        return $this->hasMany(MasterTable::class, 'medida_id', 'id')->with("itemsSale");
    }

    public function itemsSale($fechaInicio = null, $fechaFin = null)
    {
        // 👉 Si no se pasan fechas, tomamos la de HOY
        $fechaInicio = $fechaInicio ?? Carbon::now()->startOfDay();
        $fechaFin    = $fechaFin ?? Carbon::now()->endOfDay();

        return $this->hasMany(\App\Models\Order::class, 'table_id', 'id')
            ->whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->with('itemsSales');
    }


    public function comments()
    {
        return $this->hasMany(Comment::class,'modulo_token','id')
                    ->where('modulo_token', '=', 'mesa_id_' . $this->id);
    }

    public function inventory()
    {
        return $this->hasOne(InventoryEntries::class,'product_id','id');
    }

    public function medida()
    {
        return $this->hasOne(MasterTable::class,'id','medida_id');
    }

    public function children()
    {
        return $this->hasOne(MasterTable::class,'id','medida_id');
    }

    public function order(){
        return $this->hasOne(StoreOrder::class,'table_id','id')
                    ->where("status","open")
                    ->with("items","client","waiter","table","cashier","cook");
    }

    public function family(){
        return $this->hasMany(MasterTable::class,'value','value')->select("id","label","value","description");
    }

    public function totalizadorQuincena()
    {
        $this->initializeDates();

        return $this->hasMany(ChronometerResults::class , 'platform_id' , 'id')
                    ->selectRaw(    "
                                        '".$this->fechaInicioQuincena->toDateTimeString()."' as desde,
                                        '".$this->fechaFinQuincena->toDateTimeString()."' as hasta,
                                        platform_id,
                                        FORMAT(SUM(acumulado),0) as acumulado,
                                        (SELECT mt2.label 
                                            FROM master_tables mt 
                                            LEFT JOIN master_tables mt2 ON mt.medida_id=mt2.id
                                                WHERE mt.id=platform_id) AS medida,
                                        FORMAT((SELECT value FROM master_tables mt WHERE id=platform_id),2) as conversion,
                                        FORMAT(SUM(acumulado)*(SELECT value FROM master_tables mt WHERE id=platform_id),2) AS total_ventas,
                                        SUM(acumulado)*(SELECT value FROM master_tables mt WHERE id=platform_id) AS total_ventas_sin_formato
                                        
                                    ")
                    ->whereBetween('created_at', [
                        $this->fechaInicioQuincena->toDateTimeString(), 
                        $this->fechaFinQuincena->toDateTimeString()
                    ])->groupBy(  "platform_id" );
        
        /*
        return $this->hasOne(ChronometerResults::class , 'platform_id' , 'id')
                    ->selectRaw("   FORMAT(SUM(acumulado),2) AS total_ventas , platform_id")
                    ->whereBetween('created_at', [
                        $fechaInicioQuincena->toDateTimeString(), 
                        $fechaFinQuincena->toDateTimeString()
                    ])->groupBy(  "platform_id" );*/
    }
}
