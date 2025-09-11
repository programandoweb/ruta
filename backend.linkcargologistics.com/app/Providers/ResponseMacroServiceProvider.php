<?php

namespace App\Providers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\File;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Facades\Storage;


class DataExport implements FromCollection
{
    var $collection;

    public function collection()
    {
        return $this->collection;
    }

    public function setCollection($data)
    {
        if (!empty($data)) {    
            //return $this->collection=User::all();
            $this->collection=collect($data);    
        }else {
            $this->collection=collect([]);    
        }          
    }   
}

class ResponseMacroServiceProvider extends ServiceProvider
{
    

    public function boot()
    {

        Response::macro('welcome', function ($status = 200) {
            return Response::json(
                $response = [
                    "dev"=>[
                        "name"=>"Jorge Méndez",
                        "country"=>"Caracas - Venezuela",
                        "email"=>"lic.jorgemendez@gmail.com",
                        "web"=>"programandoweb.net",
                        "phone"=>"+57(311)5000926"
                    ],
                    "code" => 'SUCCESS',
                    "status" => $status,
                ], $status);
        });

        

        Response::macro('success', function ($data, $message = "Proceso realizado con exito", $status = 200) {

            if (request()->has('download')) {
                
                $items      =   [];
                foreach ($data->all() as $model) {
                    
                    $return =   [];
                    
                    
                    foreach ($model->getAttributes() as $key => $value) {
                        $return[$key]=$value;
                    }                    
                    
                    foreach ($model->getRelations() as $key => $value) {
                        if (is_object($value)&& !empty($value->getAttributes())) {
                            foreach ($value->getAttributes() as $key2 => $value2) {
                                $return[$key."_".$key2] =   $value2;
                            }
                        }
                    }

                    $items[]    =   $return;                    

                }
                
                $header=[];

                foreach ($items[0] as $key => $value) {
                    $header[$key]=$key;
                }
                
                $url                =   'documents/excel.xlsx';
                $result             =   array_merge([$header],$items);                
                $data_export        =   new DataExport;
                $data_export->setCollection($result);
                $path               =   public_path($url);
                File::put($path, '');
                Excel::store($data_export, $path);   
                
                $backendDomain      =   config('app.url');

                return Response::json(
                    $response = [
                        "dev"=>[
                            "name"=>"Jorge Méndez",
                            "country"=>"Caracas - Venezuela",
                            "email"=>"lic.jorgemendez@gmail.com",
                            "web"=>"programandoweb.net",
                            "phone"=>"+57(311)5000926"
                        ],
                        "code" => 'SUCCESS',
                        "status" => $status,
                        "message" => (!empty($data->original)&&!empty($data->original["error"]))?$data->original["error"]:$message,
                        "data" => $backendDomain.$url
                    ], $status);

            }else{
                return Response::json(
                    $response = [
                        "dev"=>[
                            "name"=>"Jorge Méndez",
                            "country"=>"Caracas - Venezuela",
                            "email"=>"lic.jorgemendez@gmail.com",
                            "web"=>"programandoweb.net",
                            "phone"=>"+57(311)5000926"
                        ],
                        "code" => 'SUCCESS',
                        "status" => $status,
                        "message" => (!empty($data->original)&&!empty($data->original["error"]))?$data->original["error"]:$message,
                        "data" => $data
                    ], $status);
            }
        });

        Response::macro('error', function ($message, $status = 500, $data = '') {

            $http_codes = array(
                100 => 'Continue',
                101 => 'Switching Protocols',
                102 => 'Processing',
                103 => 'Checkpoint',
                200 => 'OK',
                201 => 'Created',
                202 => 'Accepted',
                203 => 'Non-Authoritative Information',
                204 => 'No Content',
                205 => 'Reset Content',
                206 => 'Partial Content',
                207 => 'Multi-Status',
                300 => 'Multiple Choices',
                301 => 'Moved Permanently',
                302 => 'Found',
                303 => 'See Other',
                304 => 'Not Modified',
                305 => 'Use Proxy',
                306 => 'Switch Proxy',
                307 => 'Temporary Redirect',
                400 => 'Bad Request',
                401 => 'Unauthorized',
                402 => 'Payment Required',
                403 => 'Forbidden',
                404 => 'Not Found',
                405 => 'Method Not Allowed',
                406 => 'Not Acceptable',
                407 => 'Proxy Authentication Required',
                408 => 'Request Timeout',
                409 => 'Conflict',
                410 => 'Gone',
                411 => 'Length Required',
                412 => 'Precondition Failed',
                413 => 'Request Entity Too Large',
                414 => 'Request-URI Too Long',
                415 => 'Unsupported Media Type',
                416 => 'Requested Range Not Satisfiable',
                417 => 'Expectation Failed',
                418 => 'Im a teapot',
                422 => 'Unprocessable Entity',
                423 => 'Locked',
                424 => 'Failed Dependency',
                425 => 'Unordered Collection',
                426 => 'Upgrade Required',
                449 => 'Retry With',
                450 => 'Blocked by Windows Parental Controls',
                500 => 'Internal Server Error',
                501 => 'Not Implemented',
                502 => 'Bad Gateway',
                503 => 'Service Unavailable',
                504 => 'Gateway Timeout',
                505 => 'HTTP Version Not Supported',
                506 => 'Variant Also Negotiates',
                507 => 'Insufficient Storage',
                509 => 'Bandwidth Limit Exceeded',
                510 => 'Not Extended'
            );

            $isHttpError = array_key_exists($status, $http_codes);

            if (!$isHttpError) {
                $status = 500;
                // $message = 'El proceso no se puede realizar en este momento, comuníquese con el administrador del sistema';
            }

            return Response::json([
                "dev"=>[
                    "name"=>"Jorge Méndez",
                    "country"=>"Caracas - Venezuela",
                    "email"=>"lic.jorgemendez@gmail.com",
                    "web"=>"programandoweb.net",
                    "phone"=>"+57(311)5000926"
                ],
                "status" => $status,
                'code' => 'ERROR',
                'message' => $message,
                "data" => $data
            ], $status);
        });
    }
}
