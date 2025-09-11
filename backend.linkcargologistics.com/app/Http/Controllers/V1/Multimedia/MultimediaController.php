<?php

namespace App\Http\Controllers\V1\Multimedia;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Multimedia;
use App\Models\Comment;
use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use App\Models\User;

class MultimediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function upload_excel(Request $request)
    {
        try {
            
            // Definir reglas de validación para los archivos
            $rules = [
                'doc' => 'required|file|max:2048', // ajusta el tamaño máximo según tus necesidades
            ];

            // Mensajes personalizados para las reglas de validación
            $messages = [
                'doc.required' => 'El archivo es obligatorio.',
                'doc.file' => 'El archivo debe ser válido.',
                'doc.max' => 'El tamaño máximo del archivo es 2048 KB.',
            ];

            // Realizar la validación
            $validatedData = $request->validate($rules, $messages);

            // Obtener el tipo MIME del archivo
            $mimeType = $request->file('doc')->getMimeType();

            $ruta_base      =   "images/uploads/multimedia/";

            $ruta_original  =   public_path($ruta_base);
            if (!file_exists($ruta_original)) {
                mkdir($ruta_original, 0755, true);
            }

            $archivo        =   $request->file('doc');

            // Genera un nombre único para el archivo
            $nombreArchivo  =   Str::slug(md5($archivo->getClientOriginalName())) . '_programandoweb_3115000926.' . $archivo->getClientOriginalExtension();

            // Mueve el archivo a la nueva ubicación en 'public/images'
            $archivo->move($ruta_original, $nombreArchivo);

            // Ruta de la imagen original
            $rutaImagenBase = $ruta_base . $nombreArchivo;

            return  response()->success(["doc" => $rutaImagenBase , "action" => true], 'Archivo guardado con éxito');            

        } catch (\Throwable $th) {
            // Manejo de errores
            return  response()->error($th->getMessage(), $th->getCode());
        }
    }


    public function uploadOpen(Request $request)
    {
        $dataset    =   [];
        $user       =   User::find(1);

        // Definir reglas de validación para los archivos
        $rules = [
            'doc' => 'required|file|max:2048', // ajusta el tamaño máximo según tus necesidades
        ];

        // Mensajes personalizados para las reglas de validación
        $messages = [
            'doc.required' => 'El archivo es obligatorio.',
            'doc.file' => 'El archivo debe ser válido.',
            'doc.max' => 'El tamaño máximo del archivo es 2048 KB.',
        ];

        // Realizar la validación
        $validatedData = $request->validate($rules, $messages);

        // Obtener el tipo MIME del archivo
        $mimeType = $request->file('doc')->getMimeType();
        

        // Verificar el tipo de archivo y ejecutar la lógica correspondiente
        if (strpos($mimeType, 'image') !== false) {
            // Si es una imagen, ejecutar la lógica para imágenes                
            $archivo        =   $this->resizeAndOptimize($request);                
            $dataset        =   [
                "group"     =>  'image',
                "pathname"  =>  $archivo["original"],
                "nombreArchivo"=>$archivo["nombreArchivo"],
            ];
            $multimedia     =   $this->createMultimedia($dataset,$user);            
        }

        return response()->success(["doc" => $multimedia , "action" => true], 'Imagen guardada con éxito');
        
    }
    

    public function resizeAndOptimize(Request $request)
    {
        try {
            // Validar la solicitud
            $request->validate([
                'doc' => 'required|image|mimes:webp,jpeg,png,jpg,gif|max:2048', // ajusta las reglas según tus necesidades
            ]);

            $ruta_base = "images/uploads/multimedia/";

            $ruta_original = public_path($ruta_base);
            if (!file_exists($ruta_original)) {
                mkdir($ruta_original, 0755, true);
            }

            $ruta_md = public_path($ruta_base . 'md/');
            if (!file_exists($ruta_md)) {
                mkdir($ruta_md, 0755, true);
            }

            $ruta_xs = public_path($ruta_base . 'xs/');
            if (!file_exists($ruta_xs)) {
                mkdir($ruta_xs, 0755, true);
            }

            $ruta_xxs = public_path($ruta_base . 'xxs/');
            if (!file_exists($ruta_xxs)) {
                mkdir($ruta_xxs, 0755, true);
            }

            // Obtén el archivo del formulario
            $archivo = $request->file('doc');

            // Genera un nombre único para el archivo
            $nombreArchivo  = Str::slug(md5($archivo->getClientOriginalName())) . '_programandoweb_3115000926.' . $archivo->getClientOriginalExtension();

            // Mueve el archivo a la nueva ubicación en 'public/images'
            $archivo->move($ruta_original, $nombreArchivo);

            // Ruta de la imagen original
            $rutaImagenBase = $ruta_original . $nombreArchivo;

            // Redimensionar y guardar la imagen para tamaño md (para tabletas)
            $imagen = imagecreatefromstring(file_get_contents($rutaImagenBase));

            // Redimensionar proporcionalmente
            $nuevoAnchoMD = 768;
            $nuevoAltoMD = (int) (($nuevoAnchoMD / imagesx($imagen)) * imagesy($imagen));
            $mdImage = imagescale($imagen, $nuevoAnchoMD, $nuevoAltoMD);
            imagewebp($mdImage, $ruta_md . $nombreArchivo . '.webp');

            // Redimensionar y guardar la imagen para tamaño xs (para móviles)
            $nuevoAnchoXS = 375;
            $nuevoAltoXS = (int) (($nuevoAnchoXS / imagesx($imagen)) * imagesy($imagen));
            $xsImage = imagescale($imagen, $nuevoAnchoXS, $nuevoAltoXS);
            imagewebp($xsImage, $ruta_xs . $nombreArchivo . '.webp');

            // Redimensionar y guardar la imagen para tamaño xxs (para móviles pequeños)
            $nuevoAnchoXXS = 192;
            $nuevoAltoXXS = (int) (($nuevoAnchoXXS / imagesx($imagen)) * imagesy($imagen));
            $xxsImage = imagescale($imagen, $nuevoAnchoXXS, $nuevoAltoXXS);
            imagewebp($xxsImage, $ruta_xxs . $nombreArchivo . '.webp');

            // Guardar la imagen original
            imagewebp($imagen, $ruta_original . $nombreArchivo . '.webp');

            return [
                "nombreArchivo" =>  $nombreArchivo . '.webp',
                "original" =>  $ruta_base . $nombreArchivo . '.webp',
                "md"       =>  $ruta_base . 'md/' . $nombreArchivo . '.webp',
                "xs"       =>  $ruta_base . 'xs/' . $nombreArchivo . '.webp',
                "xxs"      =>  $ruta_base . 'xxs/' . $nombreArchivo . '.webp',
            ];
        } catch (\Throwable $th) {
            // Manejo de errores
            return response()->error($th->getMessage(), $th->getCode());
        }
    }


    private function createMultimedia($dataset,$user){
        // Crea una nueva instancia del modelo Multimedia

        $multimedia                 =   new Multimedia();
        $multimedia->name           =   $dataset["group"].'_'.$user->id;
        $multimedia->description    =   "Archivo subido por: " . $user->name . " " . $user->email." ID:".$user->id;
        $multimedia->tags           =   $dataset["group"]; // Divide por puntos y agrega #tags
        $multimedia->slug           =   $dataset["pathname"];
        $multimedia->href           =   "";
        
        // Actualiza la ruta del archivo en la base de datos para reflejar la nueva ubicación
        $multimedia->path   =   "images/uploads/multimedia/{$dataset["nombreArchivo"]}"; // Ruta en 'public/images'
        $multimedia->group  =   "documentos_usuarios";
        // Guarda el modelo en la base de datos
        $multimedia->save();

        return $multimedia;
    }

    private function handlePdfUpload($request){
        // Obtén el archivo del formulario
        $archivo    = $request->file('doc');

        // Genera un nombre único para el archivo
        $nombreArchivo  =   Str::slug(uniqid() . '_' . $archivo->getClientOriginalName()) . '.' . $archivo->getClientOriginalExtension();
        $ruta_base      =   'images/uploads/multimedia';
        // Asegúrate de que la carpeta 'public/images' exista
        $rutaDestino    =   public_path($ruta_base);

        if (!file_exists($rutaDestino)) {
            mkdir($rutaDestino, 0755, true);
        }

        // Mueve el archivo a la nueva ubicación en 'public/images'
        $archivo->move($rutaDestino, $nombreArchivo);

        return  [
                    "nombreArchivo" =>  $nombreArchivo,
                    "original" =>  $ruta_base."/".$nombreArchivo                    
                ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $dataset    =   [];
            $user       =   $request->user();

            // Definir reglas de validación para los archivos
            $rules = [
                'doc' => 'required|file|max:2048', // ajusta el tamaño máximo según tus necesidades
            ];

            // Mensajes personalizados para las reglas de validación
            $messages = [
                'doc.required' => 'El archivo es obligatorio.',
                'doc.file' => 'El archivo debe ser válido.',
                'doc.max' => 'El tamaño máximo del archivo es 2048 KB.',
            ];

            // Realizar la validación
            $validatedData = $request->validate($rules, $messages);

            // Obtener el tipo MIME del archivo
            $mimeType = $request->file('doc')->getMimeType();
           

            // Verificar el tipo de archivo y ejecutar la lógica correspondiente
            if (strpos($mimeType, 'image') !== false) {
                // Si es una imagen, ejecutar la lógica para imágenes                
                $archivo        =   $this->resizeAndOptimize($request);                
                $dataset        =   [
                    "group"     =>  'image',
                    "pathname"  =>  $archivo["original"],
                    "nombreArchivo"=>$archivo["nombreArchivo"],
                ];
                
                $multimedia     =   $this->createMultimedia($dataset,$user);                

            } elseif ($mimeType === 'application/pdf') {            
                // Si es un PDF, ejecutar la lógica para PDFs
                $archivo        =   $this->handlePdfUpload($request);
                $dataset        =   [
                    "group"     =>  'document',
                    "pathname"  =>  $archivo["original"],
                    "nombreArchivo"=>$archivo["nombreArchivo"],
                ];

                $multimedia     =   $this->createMultimedia($dataset,$user);

            } else {
                // Si el tipo de archivo no es compatible, retornar un error
                return response()->error('Tipo de archivo no compatible.', 400);
            }

            $doc_return =   Multimedia::where("path","like","%".$archivo["nombreArchivo"]."%")->first();

            $this->save_in_other_table($request,$doc_return);

            if($request->has("save")){
                $save   =   json_decode($request->save);
                DB::table('users')->where('id', $save->id)
                                  ->update([
                                        $save->column => $doc_return->{$save->src}
                                  ]);
                //p($save);
            }
            
            return response()->success(["doc" => $doc_return , "action" => true], 'Imagen guardada con éxito');

        } catch (\Exception $e) {
            return response()->error($e->getMessage(), $e->getCode());
        }
    }

    private function save_in_other_table($request, $doc_return)
    {
        if ($request->has("repository")&&!empty($doc_return->path)) {
            $tableName = $request->input("repository");
            $result = DB::table($tableName)->where("id", '=', $request->input("id"))->first();
            if ($result) {
                DB::table($tableName)->where("id", '=', $request->input("id"))->update(["src" => $doc_return->path]);
            }
        }
    }
    
}
