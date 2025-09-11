<?php

namespace App\Services;

use App\Repositories\PropertiesRepository;
use App\Repositories\ParkingRepository;
use App\Repositories\VehiclesRepository; // Asegúrate de tener este repositorio


class PropertiesService
{   

    private $propertiesRepository;
    private $vehiclesRepository;
    private $parkingRepository;

    public function __construct(  
        ParkingRepository   $parkingRepository,
        VehiclesRepository $vehiclesRepository,
        PropertiesRepository $propertiesRepository
    ){
        $this->propertiesRepository         =   $propertiesRepository;        
        $this->vehiclesRepository           =   $vehiclesRepository;    
        $this->parkingRepository            =   $parkingRepository;    
    }

    public function getByUserID($user_id){
        $vehicles       =   $this->vehiclesRepository->getAllById($user_id);
        $properties     =   $this->propertiesRepository->getAllById($user_id);
        $parking        =   $this->parkingRepository->getAllById($user_id);        
        return compact("vehicles","properties","parking");        
    }
    
}
