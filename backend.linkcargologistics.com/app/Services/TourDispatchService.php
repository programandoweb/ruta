<?php

namespace App\Services;
use App\Models\ToursService;
use App\Models\AccessoryRental;
use App\Models\Borrower;
use App\Models\Properties;

class TourDispatchService
{

    public function defineMeargeServiceRelationToursNotPropietary($parameters,$tourservices,$borrower){
        
        $merge_array    =   [];
        
        foreach ($tourservices["notNone"] as $key => $value) {
            
            if($value["related_by"]&&!empty($borrower[$value["related_by"]])){
                $data           =   [];
                foreach ($borrower[$value["related_by"]] as $key2 => $value2) {
                    $data[]     =   [
                                        "value"         =>  $value2->id,
                                        "name"          =>  $value2->first_name." ".$value2->last_name,
                                        "cost_price"    =>  $value2->rate,
                                        "sale_price"    =>  $value2->rate
                                    ];
                }
                $merge_array[$key]  =   $data;
            }            
        }
        
        return array_merge($tourservices,$merge_array);

    }
    public function extractParameters(string $input): array
    {
        // Suponiendo que los parámetros están separados por comas
        return explode(',', $input);
    }
    

    public function defineServiceRelationTours(array $array): array
    {
        $return =   [];
        $notNone=   [];
        foreach (ToursService::whereIn("title",$array)->get() as $key => $value) {
            if(!empty($value->related_by)&&$value->related_by!='none'){
                
                $borrower   =   [];
                $data       =   [];

                $properties =   Properties::where("transport_type","=",$value->related_by)->with("owner")->get();

                //p([$properties,$value->related_by],false);

                if(!empty($properties)&&count($properties)>0){
                    foreach ($properties as $key2 => $value2) {
                        $borrower[$value2->borrower_id]     =   [
                                                                    "borrower_id"           =>  $value2->borrower_id,
                                                                    "provider_name"         =>  $value2->owner->first_name." ".$value2->owner->last_name,
                                                                    "provider_cell_phone"   =>  $value2->owner->cell_phone,
                                                                    "provider_cell_email"   =>  $value2->owner->email,
                                                                    "provider_people_type"  =>  $value2->owner->people_type
                        ];
                        $data[$value2->borrower_id][]       =  [
                                                                            "value"         =>  $value2->id,
                                                                            "label"         =>  $value2->title,
                                                                            "cost_price"    =>  $value2->cost_price,
                                                                            "sale_price"    =>  $value2->sale_price
                                                                        ];  
                    
                    } 
                    $return[$value->title]  =   [   
                        "borrower"=>$borrower, 
                        "data"=>$data
                    ];               
                }else{                    
                    $notNone[$value->title] =   [
                                                    "value"         =>  $value->id,
                                                    "label"         =>  $value->title,
                                                    "related_by"    =>  $value->related_by,
                                                    "cost_price"    =>  $value->cost_price,
                                                    "sale_price"    =>  $value->sale_price,
                                                ];
                }                            
                    
            }else{
                $return[$value->title]  =   [
                                                
                                                "label"         =>  $value->title,
                                                "cost_price"    =>  $value->cost_price,
                                                "sale_price"    =>  $value->sale_price
                                            ];
            }

               
            
        }

        $return["notNone"]  =   $notNone;
        return $return;
    }


    public function defineExtraServiceTours(array $array): array{
        $return =   [];
        $notNone=   [];
        foreach (AccessoryRental::whereIn("title",$array)->get() as $key => $value) {
            if(!empty($value->related_by)&&$value->related_by!='none'){
                
                $data       =   [];

                foreach (Borrower::where("people_type","=",$value->related_by)->get() as $key => $value2) {
                    $data[]             =  [
                        "value"         =>  $value2->id,
                        "label"         =>  $value2->first_name." ".$value2->last_name,
                        "name"          =>  $value2->first_name." ".$value2->last_name,
                        "cost_price"    =>  $value2->rate,
                        "sale_price"    =>  $value2->rate
                    ];
                }

                $notNone[$value->title] =  $data ;                                             
                    
            }
            
        }
        $return  =   $notNone;
        return $return;        
    }
}
