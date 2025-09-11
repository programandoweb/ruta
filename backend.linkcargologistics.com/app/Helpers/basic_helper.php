<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

//use DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Request;
use App\Models\Domain;
use App\Models\User;
use App\Models\MasterTable;
use Illuminate\Support\Facades\DB;

if (!function_exists('create_notification')) {
    function create_notification(array $params): ?\App\Models\Notification
    {
        return \App\Models\Notification::firstOrCreate(
            [
                'to_user_id'    => $params['to_user_id'],
                'concepto'      => $params['concepto'],
                'tipo'          => $params['tipo'] ?? null,
                'related_type'  => $params['related_type'] ?? null,
            ],
            [
                'from_user_id'  => $params['from_user_id'] ?? auth()->id(),
                'descripcion'   => $params['descripcion'] ?? null,
                'status'        => $params['status'] ?? 'no leido',
            ]
        );
    }
}



if (!function_exists('generateUniqueCode')) {
    /**
     * Genera un código alfanumérico de 10 caracteres basado en la fecha y hora actual.
     * Verifica que el código no exista en la tabla especificada.
     *
     * @param string $tableName Nombre de la tabla donde verificar la unicidad del código.
     * @param string $columnName Nombre de la columna donde verificar el código.
     * @return string
     */
    function generateUniqueCode(string $tableName, string $columnName): string
    {
        do {
            // Obtén la fecha y hora actual con microsegundos
            $dateTime = now()->format('Y-m-d H:i:s.u');

            // Genera un hash MD5 a partir de la fecha y hora
            $hash = md5($dateTime);

            // Recorta el hash para obtener los primeros 10 caracteres alfanuméricos
            $code = substr($hash, 0, 10);

            // Verifica si el código ya existe en la tabla
            $exists = DB::table($tableName)->where($columnName, $code)->exists();
        } while ($exists);

        return strtoupper($code);
    }
}


if (!function_exists('logoBase64')) {
  function logoBase64() {
    $enterprise         =   master_table_by_in(["enterprise"]);
    $return_enterprice  =   [];

    foreach ($enterprise["enterprise"] as $key => $value) {
        $return_enterprice[$value->label] = $value->description;
    }

    p($return_enterprice);

    $sale->enterprise = $return_enterprice;

    //p($sale->payment_status);

    // Convertir logo a base64 si existe
    $logoBase64     =   '';
    if (!empty($sale->enterprise["Logo"])) {
        $logoPath   =   public_path(parse_url($sale->enterprise["Logo"], PHP_URL_PATH));
        if (file_exists($logoPath)) {
            $logoData = file_get_contents($logoPath);
            $logoBase64 = 'data:image/' . pathinfo($logoPath, PATHINFO_EXTENSION) . ';base64,' . base64_encode($logoData);
        }
    }

    return $logoBase64??null;

  }
}


if (!function_exists('generateRandomString')) {
  function generateRandomString($length = 8) {
    
    $characters         =   '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength   =   strlen($characters);
    $randomString       =   '';
    
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    
    return $randomString;

  }
}

if (!function_exists('getDateWithDay')) {
  function getDateWithDay($date)
  {
      $dateTime = new DateTime($date);
      $daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      $dayOfWeek = $daysOfWeek[$dateTime->format('w')];
      
      return $dateTime->format('Y-m-d') . ' (' . $dayOfWeek . ')';
  }
}

if (!function_exists('generateOrderNumber')) {
  function generateOrderNumber()
  {
      $letters = Str::random(7);
      $numbers = str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);
      $orderNumber = $letters . $numbers;

      // Shuffle the order number to mix letters and numbers
      return str_shuffle($orderNumber);
  }
}


if (!function_exists('calculateTourAndSave')) {
  function calculateTourAndSave($request,$order){

    $precio           =   0;
    $tickets          =   0;
    $services         =   0;
    $accesories       =   0;
    $hotels           =   0;
    $data             =   $request->all();
    $return           =   0;
   
    if(!empty($data["unit_price"])){ 
      $unit_price     =   $data["unit_price"];
      $total_price    =   $data["total_price"];
      $peoples        =   $data["peoples"];
      $is_private     =   $data["is_private"];

      if($is_private==false || $is_private=="Persona"){
          /**
           * Si es por persona o ambos, debo tomar el precio multiplicado por las personas a registrar
           */
          $return             =   $peoples    *   $unit_price;
      }else {
          $return             =   $total_price;
      }

      
      /**
         * Precio Tickets
         */
        if (!empty($data["tickets"])) {
          foreach ($data["tickets"] as $key => $value) {
              if ($value===141) {
                  $tickets+=$data["tickets__values"][$key];
                  $services_ext["tickets"][]  =   [   
                      "value"=>$data["tickets__values"][$key],
                      "label"=>$data["tickets__labels"][$key],
                  ];
              }
              
          }
      }
      

      /**
       * Precio servicios
       */             
        if (!empty($data["services"])) {
          foreach ($data["services"] as $key => $value) {
              if ($value===141) {
                  $services+=$data["services__values"][$key];
                  $services_ext["services"][]  =   [   
                      "value"=>$data["services__values"][$key],
                      "label"=>$data["services__labels"][$key],
                  ];
              }
              
          }
      }

      /**
       * Precio accesorios
       */             
        if (!empty($data["accesories"])) {
          foreach ($data["accesories"] as $key => $value) {
              if ($value===141&&!empty($data["accesories__values"][$key])) {
                  $accesories +=  $data["accesories__values"][$key];
                  $services_ext["accesories"][]  =   [   
                      "value"=>$data["accesories__values"][$key],
                      "label"=>$data["accesories__labels"][$key],
                  ];
              }                    
          }
      }



      /**
       * Precio hoteles
       */             
      if (!empty($data["hotels"])) {
          foreach ($data["hotels"] as $key => $value) {
              if ($value===141&&!empty($data["hotels__values"][$key])) {
                  $hotels     +=  $data["hotels__values"][$key];
                  $services_ext["hotels"][]  =   [   
                      "value"=>$data["hotels__values"][$key],
                      "label"=>$data["hotels__labels"][$key],
                  ];
              }                    
          }
      }

      $total                  =   $hotels+$accesories+$services+$tickets+$precio+$return;
      
      $order->total_amount    =   $total;      

      $order->save();        

      return $order;

    }

    $resume_tours             =   json_decode($order->settings);
    
    if(empty($resume_tours->tour->unit_price)){
      return $order;
    }

    if(!empty($data["tickets"])){

      $base_price             =   0;

      $is_private               =   $data["is_private"];

      /**
       * Si un tour es privado o ambos se calcula por persona
      */
      if($is_private==false || $is_private=="Persona"){
        $base_price            +=   $resume_tours->peoples    *   $resume_tours->tour->unit_price;
      }else {
        $base_price            +=   $resume_tours->tour->total_price;
      }

      if (!empty($data["tickets"])) {
        foreach ($data["tickets"] as $key => $value) {
          if($value==141){
            $base_price          +=   $data["tickets__values"][$key];          
          }        
        } 
      }
      
      if (!empty($data["hotels__values"])) {
        foreach ($data["hotels__values"] as $key => $value) {
          if(!empty($value)){
            $base_price          +=   $value;                    
          }        
        } 
      }
      
      if (!empty($data["accesories__values"])) {
        foreach ($data["accesories__values"] as $key => $value) {
          if(!empty($value)){
            $base_price          +=   $value;                    
          }        
        } 
      }

      if (!empty($data["services__values"])) {
        foreach ($data["services__values"] as $key => $value) {
          if(!empty($value)){
            $base_price          +=   $value;                    
          }        
        } 
      }      

      $order->total_amount    =   $base_price;

    }

    $order->save();        

    return $order;
  }
}

if (!function_exists('sms')) {
  function sms($num,$mensaje){
    
    $apikey 	= "3922-7339-61b787e85811c5.56303721";
		$secret 	= "d54edd584f0cbb51d88f5d163ca48ddac0b550d0";

		$method 	= 	"POST";
		$uri 			= 	'https://aio.sigmamovil.com/api/sms/singlesms';


		//$num			=		"3147487688"; //numero de jimena
		//$num			=		"3046749323";
		//pre($num);

		$data = json_encode(array(
															  "name" => "Campaña ",
															  "notification" => false,
															  "email"=>"",
															  "receiver" => array(
															        "indicative"=>"57",
															        "phone"=>$num,
															        "message"=>$mensaje
															  ),
															  "idSmsCategory"=>"1159", // debe ir aqui la una id de categoria de sms que pertenecezca a la cuenta
															  "datesend"=>"",
															  "datenow"=>true,
															  "timezone"=>"-0500",
															  "morecaracter"=>false // si va a usar mas de 160 caracteres mandar en true, solo se permite hasta 300
															));

		try {
		 	$pwd 		= 	hash_hmac('sha1', $method . "|" . $uri . "|" . $data, $secret);
			$ch 		= 	curl_init($uri);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(

			'Authorization: Hmac '.base64_encode($apikey . ":" . $pwd),
			'Content-Type: application/json',
			'Content-Length: '.strlen ($data)));

			curl_setopt($ch, CURLOPT_TIMEOUT, 5);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

			$result = curl_exec($ch);
			if(curl_errno($ch)){
				throw new Exception(curl_error($ch));
			}
			curl_close($ch);
			return $result;
		} catch (\Exception $ex) {
			return "Error: ".$ex->getMessage();
		}
  }
}

if (!function_exists('master_table_by_in')) {
  function master_table_by_in($keys, $format_select=false) {    
      $return = [];
      
      if($keys=='*'){
        foreach (MasterTable::selectRaw("label, label as Nombre, options, label as name, id as value, id, value as valor, grupo, description, bool_status, medida_id ")->get() as $key => $value) {        
          $group = $value->grupo;
          unset($value->grupo);
          $return[$group][]=$value;
        }  
      }else{
        if ($format_select) {
          foreach (MasterTable::selectRaw("label, label as Nombre, options, label as name, id as value, id, value as valor, grupo, description, bool_status, medida_id ")->whereIn("grupo",$keys)->get() as $key => $value) {        
            $group = $value->grupo;
            unset($value->grupo);
            $return[$group][]=$value;
          }  
        }else {
          foreach (MasterTable::selectRaw("label, label as Nombre, value, options, id, grupo, description, bool_status, medida_id ")->whereIn("grupo",$keys)->get() as $key => $value) {
            $group = $value->grupo;
            unset($value->grupo);
            $return[$group][]=$value;
          }  
        }
      }

      foreach (MasterTable::selectRaw("grupo")->groupBy("grupo")->orderBy("grupo")->get() as $key => $value) {
        $return["groups"][] = ["label" => $value->grupo, "value" => $value->grupo];
      }       
      
      return $return;             
  }
}  


if (!function_exists('master_table')) {
  function master_table($key,$first=true) {
    if ($first) {
      $status = MasterTable::where("grupo","=",$key)->first(); 
      if($status){
        return $status->id;
      }else {
        return NULL;
      }  
    }else{
      $status = MasterTable::selectRaw("* , label as name, id, value")->where("grupo","=",$key)->orderBy("label")->get(); 
      if($status){
        return $status;
      }else {
        return NULL;
      }
    }
    
  }
}  

if (!function_exists('getAncestors')) {
  function getAncestors($userId, $level = 1) {
    if ($level > 5) {
        return collect(); // Retorna una colección vacía si alcanzamos el nivel máximo
    }
    
    $user = User::find($userId);
    
    if (!$user) {
        return collect(); // Retorna una colección vacía si el usuario no se encuentra
    }
    
    $parentId = $user->monitor_id;
    
    if (!$parentId) {        
        return collect(); // Retorna una colección vacía si no hay un ancestro
    }
    
    $ancestors = getAncestors($parentId, $level + 1); // Llamada recursiva para obtener los ancestros del ancestro actual
    
    return $ancestors->prepend($parentId); // Agrega el ID del ancestro actual al principio de la colección
  }
}  

if (!function_exists('extractSlug')) {
  function extractSlug($url)
  {
    // Ignorar el dominio y obtener solo la parte de la URL después del último '/'
    $urlParts = explode('/', $url);
    $slugPart = end($urlParts);

    // Ignorar el dominio y obtener solo la parte de la URL después del último '/'
    $urlParts =   explode('/', $url);
    
    $slugPart =   end($urlParts);

    if(empty($slugPart)){
      $slugPart =   count($urlParts);
      $slugPart =   $urlParts[$slugPart-2];
      return $slugPart;
    }

    // Utilizar expresión regular para extraer el slug de la parte de la URL
    preg_match('/\/([^\/]+)\/?$/', $slugPart, $matches);

    // El slug estará en el primer elemento del array de coincidencias
    if (isset($matches[1])) {
        return $matches[1];
    } else {
        // Si no se encuentra un slug válido, retornar null o lanzar una excepción según el caso
        return null;
        // throw new \Exception("No se pudo extraer el slug de la URL proporcionada.");
    }
  }  
}  

if (!function_exists('orderMasterTable')) {
  function orderMasterTable($data)
  {
    $return=[];
    if(!empty($data)){
      
      foreach ($data as $key => $value) {
        if(!empty($value["description"])){
          $return[$value["description"]]  = $value["id"];          
        }
      }
    }
    

    return $return;
  }
}


if (!function_exists('seo')) {
  function seo()
  {
    return ;
  }
}

if (!function_exists('obtenerDominio')) {
  function obtenerDominio($url) {
      // Eliminar http:// o https://
      $patron = '/^(?:https?:\/\/)?(?:www\.)?([^:\/\s]+)/';
      preg_match($patron, $url, $coincidencias);
    
      // Si se encontró el dominio
      if (isset($coincidencias[1])) {
          // Realizar explode para obtener partes del dominio
          $dominio = $coincidencias[1];
          $partes = explode('.', $dominio);

          $dominiosEncontrados  =   Domain::whereIn('tenant_id', $partes)->first();

          if($dominiosEncontrados){
            return $dominiosEncontrados;
          }else{
            return "DEFINIR";  
          }
          return $dominiosEncontrados;
      } else {
          return null;
      }
  }
}


if (!function_exists('convertirMontoACentavos')) {
  function convertirMontoACentavos($monto) {
    // Remover cualquier carácter que no sea dígito o un punto decimal
    $monto = preg_replace('/[^0-9.]/', '', $monto);
  
    // Convertir el monto a centavos y asegurarse de que sea un número entero
    return intval(round(floatval($monto) * 100));
  }
}

if (!function_exists('compare')) {
  function compare($diff, $extra = false)
  {
    $return = "";
    foreach ($diff as $key => $value) {
      if ($key!="updated_at") {
        $return .=  "<div>".$key.": <b>".$value."</b></div> ";
      }      
    }    
    return $return . $extra;
  }
}


if (!function_exists('getLetterFromNumber')) {
  function getLetterFromNumber($number) {
    $baseCharCode = ord('A');
    $numberOfLetters = 26;

    // Asegurarse de que el número esté en el rango 1-26
    $normalizedNumber = ($number - 1) % $numberOfLetters + 1;

    // Obtener el código ASCII de la letra correspondiente y convertirlo a carácter
    $charCode = $baseCharCode + $normalizedNumber - 1;
    $letter = chr($charCode);

    return $letter;
  }
}


if (!function_exists('getCommentByModule')) {
  function getCommentByModule($module)
  {
      // Valida que el módulo no esté vacío
      if (empty($module)) {
          throw new \InvalidArgumentException("El módulo no puede estar vacío.");
      }

      // Consulta los comentarios relacionados con el módulo proporcionado
      $comments = \App\Models\Comments::where('module', $module)
          ->orderBy('created_at', 'desc')
          ->get();

      return $comments;
  }
}



if (!function_exists('generaComentario')) {
  function generaComentario($mensaje, $userId = false, $modulo_token = false, $replace = false, $json=false)
  {
      // Obtiene el usuario autenticado
      $user = request()->user();

      // Define el prefijo del mensaje con el nombre del usuario autenticado
      $mensajeConPrefijo = !empty($user->name) ? $user->name . ":" . $mensaje : $mensaje;

      // Define el módulo de la URL o usa el path actual
      $module = $modulo_token ? $modulo_token : request()->path();

      // Obtiene el ID del usuario autenticado o usa el proporcionado
      $userId = $userId ? $userId : auth()->id();

      // Define el valor de `pathname` basado en las reglas
      $pathname = request()->input("pathname") != '' ? 
          (!$replace ? request()->input("pathname") : str_replace("new", $replace, request()->input("pathname"))) 
          : request()->path();

      // Buscar si existe un comentario en el último minuto
      $recentComment = \App\Models\Comments::where('mensaje', $mensajeConPrefijo)
          ->where('module', $module)
          ->where('user_id', $userId)
          ->where('pathname', !empty($pathname) ? $pathname : $module)
          ->where('created_at', '>=', now()->subMinute())
          ->first();

      if (!$recentComment) {
          // Crear un nuevo comentario si no existe uno reciente
          $comment = \App\Models\Comments::create([
              'mensaje' => $mensajeConPrefijo,
              'module' => $module,
              'user_id' => $userId,
              'json' =>   json_encode($json?$json:request()->all()),
              'pathname' => !empty($pathname) ? $pathname : $module,
              'created_at' => now(),
              'updated_at' => now(),
          ]);
      } else {
          // Actualizar el campo updated_at si ya existe un comentario reciente
          $recentComment->update([
              'updated_at' => now(),
          ]);

          // Retornar el comentario existente
          $comment = $recentComment;
      }

      return $comment;
  }
}



if (! function_exists('crearDirectorioSiNoExiste')) {
  function crearDirectorioSiNoExiste($directorio)
  {
      $directorio   = public_path($directorio);
      if (!File::exists($directorio)&&File::makeDirectory($directorio, 0755, true)) {
        return true;
      }else {
        return false;
      }
  }
}

if (! function_exists('uByArray')) {
  function uByArray($data)
  {
    //$docs     =  
    $byGroup  = [];
    if(!empty($data)) {
      foreach ($data as $key => $value) {
        $value->fullpath = env("APP_URL").$value->path;
        //$docs[]=$value;
        $byGroup[$value->group][] = $value;
      }
    }

    return  $byGroup;
  }
}

if (! function_exists('moverArchivo')) {
  function moverArchivo($rutaArchivoOrigen, $rutaArchivoDestino)
  {
    if (Storage::move($rutaArchivoOrigen, $rutaArchivoDestino)) {
        return true;
    }
    return false;
  }
}

if (! function_exists('format')) {
  function format($fecha,$formato="d/m/Y")
  {
    $date	=	date_create($fecha);
		return date_format($date,$formato);
  }
}

/*if (! function_exists('convertirImagenBase64')) {
  function convertirImagenBase64($base64Image,$fileNameNew=false,$dir="")
  {
      // Obtener la extensión de la imagen
      $extension = explode('/', mime_content_type($base64Image))[1];

      // Generar un nombre de archivo único
      $fileName = uniqid() . '.' . $extension;
      if ($fileNameNew) {
        $fileName = $fileNameNew . '.' . $extension;
      }

      // Decodificar la imagen base64
      $imageData  = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

      $path_dest  = 'uploads/usuarios/'.$dir ;
      crearDirectorioSiNoExiste($path_dest);

      // Ruta donde se guardará el archivo
      $filePath   = public_path($path_dest.'/'. $fileName);

      // Guardar la imagen en el archivo
      File::put($filePath, $imageData);

      // Retornar la ruta del archivo guardado
      return $path_dest.'/'. $fileName;
  }
}*/



if (!function_exists('convertirImagenBase64')) {
  function convertirImagenBase64($base64Image, $fileNameNew = false, $dir = "", $maxWidth = 1200, $maxHeight = 1200, $quality = 80)
  {
      // Generar un nombre de archivo único
      $fileName = uniqid() . '.webp';
      if ($fileNameNew) {
          $fileName = $fileNameNew . '.webp';
      }

      // Decodificar la imagen base64
      $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

      $path_dest = 'images';
      crearDirectorioSiNoExiste($path_dest);

      // Ruta donde se guardará el archivo
      $filePath = public_path($path_dest . '/' . $fileName);

      // Crear una instancia de Intervention Image
      $image = Image::make($imageData);

      // Redimensionar la imagen
      /*
      $image->resize($maxWidth, $maxHeight, function ($constraint) {
          $constraint->aspectRatio();
          $constraint->upsize();
      });
      */

      // Guardar la imagen en formato WebP
      $image->save($filePath, $quality);

      // Retornar la ruta del archivo guardado
      return $path_dest . '/' . $fileName;
  }
}

if (!function_exists('convertirBlobArchivo')) {
    function convertirBlobArchivo($blobData, $fileNameNew = false, $extension = "")
    {
        if ($extension=='') {
          $extension = 'bin';
        }

        $fileName = uniqid() . '.' . $extension;
        if ($fileNameNew) {
            $fileName = $fileNameNew . '.' . $extension;
        }

        // Crear el directorio si no existe
        crearDirectorioSiNoExiste('attachment');

        // Ruta donde se guardará el archivo
        $filePath = public_path('attachment/' . $fileName);

        // Guardar el blob en el archivo
        file_put_contents($filePath, $blobData);

        // Retornar la ruta del archivo guardado
        return 'attachment/' . $fileName;
    }
}



if (! function_exists('permissions')) {
  function permissions($user,$set=false){
      $permissions  = [];
      $roleNames    = $user->roles->pluck('name')->toArray();

      foreach ($roleNames as $key => $value) {
        $role                   =   Spatie\Permission\Models\Role::where('name', $value)->first();
        $role                   =   $role->permissions->pluck('name')->toArray();
        if (!$set) {
          $permissions[$value]  =   $role;
        }else {

          foreach ($set as $key2 => $value2) {
            $explode                      =   explode("_",$value2);
            if (in_array($value2, $role)) {
              $permissions[end($explode)]   =   true;
            }else {
              $permissions[end($explode)]   =   false;
            }
          }
        }
      }
      return  $permissions;
  }
}

if (! function_exists('tabs')) {
    function tabs($data,$user){
      if (!empty($data)) {
        $return     =   [];

        if ($user->can('condominio_index_condominios_parent')) {
          $return[] =   [
            "label"=>"Condominios",
            "permission"=>"condominio_index_condominios_parent",
          ];
        }

        if ($user->can('condominio_index_inmuebles_parent')) {
          $return[] =   [
            "label"=>"Inmuebles",
            "permission"=>"condominio_index_inmuebles_parent",
          ];
        }

        if ($user->can('condominio_index_parqueaderos_parent')) {
          $return[] =   [
            "label"=>"Parqueaderos",
            "permission"=>"condominio_index_parqueaderos_parent",
          ];
        }

        if ($user->can('condominio_index_areas_comunes_parent')) {
          $return[] =   [
            "label"=>"Áreas comunes",
            "permission"=>"condominio_index_areas_comunes_parent",
          ];
        }

        if ($user->can('condominio_index_locales_comerciales_parent')) {
          $return[] =   [
            "label"=>"Locales Comerciales",
            "permission"=>"condominio_index_locales_comerciales_parent",
          ];
        }
        $data->tabs=$return;
      }
      return $data;
    }
}
if (! function_exists('json_validator')) {
  function json_validator($data) {
      if (!empty($data)) {
          return is_string($data) &&
            is_array(json_decode($data, true)) ? true : false;
      }
      return false;
  }
}

if (! function_exists('btn_edit')) {
    function btn_edit($data,$bool){
      if (!empty($data) && $bool) {
        list($api,$path)          =   explode("api/v1",url()->current());
        $data->edit = $path.'/edit';
      }// code...

      return $data;
    }
}
if (! function_exists('btn_add')) {
    function btn_add($data,$bool){
      if (!empty($data) && $bool) {
        list($api,$path)          =   explode("api/v1",url()->current());
        $data->add = $path.'/add';
      }// code...

      return $data;
    }
}
if (! function_exists('btn_save')) {
    function btn_save($data,$bool){
      if (!empty($data) && $bool) {
        list($api,$path)          =   explode("api/v1",url()->current());
        $data->save               =   str_replace("/edit","",$path);
      }// code...

      return $data;
    }
}

if (! function_exists('sms')) {
    function sms($num,$mensaje)
    {
      if (empty($mensaje) || empty($mensaje)) {
        return false;
      }
      $apikey 	=  env('SMS_API_KEY');
  		$secret 	=  env('SMS_SECRET');
      $method 	=  "POST";
  		$uri 			=   env('SMS_URI');


      $data = json_encode(array(
  															  "name" => "Campaña",
  															  "notification" => false,
  															  "email"=>"",
  															  "receiver" => array(
  															        "indicative"=>"57",
  															        "phone"=>"$num",
  															        "message"=>$mensaje
  															  ),
  															  "idSmsCategory"=>"1159", // debe ir aqui la una id de categoria de sms que pertenecezca a la cuenta
  															  "datesend"=>"",
  															  "datenow"=>true,
  															  "timezone"=>"-0500",
  															  "morecaracter"=>false // si va a usar mas de 160 caracteres mandar en true, solo se permite hasta 300
  															));

      try {
  		 	$pwd 		= 	hash_hmac('sha1', $method . "|" . $uri . "|" . $data, $secret);
  			$ch 		= 	curl_init($uri);
  			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
  			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  			curl_setopt($ch, CURLOPT_HTTPHEADER, array(

  			'Authorization: Hmac '.base64_encode($apikey . ":" . $pwd),
  			'Content-Type: application/json',
  			'Content-Length: '.strlen ($data)));

  			curl_setopt($ch, CURLOPT_TIMEOUT, 5);
  			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

  			$result = curl_exec($ch);
  			if(curl_errno($ch)){
  				throw new Exception(curl_error($ch));
  			}
  			curl_close($ch);
  			return $result;
  		} catch (\Exception $ex) {
  			return "Error: ".$ex->getMessage();
  		}

    }
}

if (! function_exists('sum')) {
    function sum($key,$as)
    {
      return  " SUM(". $key .") as ".$as.", FORMAT(SUM(". $key ."),2) as ".$as."_string";
    }
}

if (! function_exists('decode_pay')) {
  function decode_pay($data)
  {
    $explode  = explode("/",$data);
    if (count($explode)) {
      list($table,$column,$value) = $explode;
      $result=DB::table($table)->where($column,'=',$value)->first();
      if (!empty($result->prices_id) &&  str_contains($data, "courses/id/") ) {
        $prices             =   DB::table("prices")->where("id",'=',$result->prices_id)->first();
        $result->saldo      =   ($prices->offer>0)?$prices->offer:$prices->price;
        $result->concepto   =   $result->label;
        $result->courses_id =   (!empty($result->id))?$result->id:false;
      }
      return $result;
    }else{
      return false;
    }

  }
}

if (! function_exists('fullpath')) {
    function fullpath( $column="path",$alias="fullpath" ){
      $uri  = env('APP_URL');
      return "CONCAT('". $uri ."',".$column.") as ".$alias;
    }
}

if (! function_exists('products_slug')) {
    function products_slug(){
      return "CONCAT(products_categories.slug,'/',products.label) as products_slug";
    }
}

if (! function_exists('url_image')) {
    function url_image( $data, $column="image" ){
      if (is_object($data) && !empty($data->{$column})) {
        $data->{$column}  =   URL::asset($data->{$column});
      }
      if (is_array($data) && !empty($data[$column])) {
        $data[$column]    =   URL::asset($data[$column]);
      }
      return $data;
    }
}

if (! function_exists('selectRawSlug')) {
    function selectRawSlug(){
      $uri  = "cms_programandoweb";
      return "CONCAT('". $uri ."','/',slug) as slug";
    }
}


if (! function_exists('response_concat_url')) {
    function response_concat_url($column,$alias)
    {
      $uri  = env('APP_URL');
      return "CONCAT('". $uri ."','',".$column.") as ".$alias;
    }
}

if (! function_exists('format_php')) {
    function format_php($num,$decimal=true)
    {
      if($decimal){
    		return number_format($num, 2, ',', '.');
    	}else{
    		return number_format($num,0, '', '.');
    	}
    }
}

if (! function_exists('format')) {
    function format($key,$as)
    {
      return  " FORMAT(". $key .",2) as ".$as;
    }
}

if (! function_exists('url_generator_chats')) {
    function url_generator_chats()
    {
      return "modulo_token as edit, attachment";
    }
}

if (! function_exists('url_generator')) {
    function url_generator($key="id",$columns="*",$is_erasable=false)
    {

      if (str_contains (url()->current(),"scraping")) {
        $explode1[]          =   explode("api",url()->current());
        $explode1[]          =   "/dashboard/scraping/categorias/list";
      }else {
        $explode1           =   explode("api",url()->current());
      }


      $explode2           =   explode("?",url()->full());
      $return             =   $columns;

      if (!empty($explode1) && count($explode1)>1) {
        list($none,$uri)    =   $explode1;
        $return.=",CONCAT('". $uri ."','/',".$key.") as edit";
      }

      if (!empty($explode2) && count($explode2)>1) {
        list($none,$uri2)   =   $explode2;
        $return.=",CONCAT('". $uri ."','/',".$key.") as destroy";
      }

      if ($is_erasable) {
        $return.=", IF(is_erasable>0,CONCAT('". $uri ."','/Delete/',".$is_erasable."),'')  as del";
      }

      return $return;

    }
}

if (! function_exists('punctuation_marks')) {
    function punctuation_marks()
    {
      return [
                ",",
                ";",
                ".",
                "¿",
                "?",
                "¡",
                "!",
                "*",
                "@",
                "_",
                "-",
                "#",
              ];
    }
}

if (! function_exists('set_lowercase')) {
    function set_lowercase($fields)
    {
      return $fields;
      $fields_lowercase=[];
      foreach ($fields as $key => $value) {
        $fields_lowercase[$key] = strtolower($value);
      }
      return $fields_lowercase;
    }
}

if (! function_exists('array_clients_columns')) {
    function array_clients_columns($vars)
    {
        $array=[
          "name"=>"Nombres",
          "surnames"=>"Apellidos",
          "gender"=>"Género",
          "marital_status"=>"Estado Civil",
          "document_type"=>"Tipo de documento",
          "identification"=>"Documento",
          "identification_expedition_place"=>"Fecha de expedición del documento",
          "nationality"=>"Nacionalidad",
          "place_birth"=>"Lugar de nacimiento",
          "date_birth"=>"Fecha de nacimiento",
          "dependents"=>"Personas a cargo",
          "direction"=>"Dirección",
          "neighborhood"=>"Barrio",
          "city"=>"Ciudad",
          "department"=>"Departamento",
          "phone"=>"Teléfono fijo",
          "cellphone"=>"Celular",
          "stratum"=>"Estrato",
          "email"=>"Correo electrónico",
          "education_level"=>"Nivel educativo",
          "date_into_employment"=>"Tiempo en el empleo",
          "business"=>"Empresa",
          "position"=>"Cargo",
          "salary"=>"Salario",
          "business_dependence"=>"Negocio o dependencia",
          "discount_amount"=>"Autoriza descontar del sueldo",
          "discount_amount_extra"=>"Porcentaje descuento del sueldo",
          "savings_program"=>"Programa de ahorros",
          "open_account"=>"Abrir cuenta",
          "open_account_amount"=>"Monto de apertura",
          "interest_cinema"=>"Interés en el cine",
          "interest_theater"=>"Interés en el teatro",
          "interest_concerts_shows"=>"Interés en el conciertos",
          "interest_subscriptions"=>"Interés en suscripciones",
          "interest_gym"=>"Interés en el gimnasio",
          "own_home"=>"Vivienda propia",
          "financed_home"=>"Vivienda financiada",
          "financed_home_bank"=>"El banco financiador de la vivienda",
          "own_vehicle"=>"Tiene vehiculo propio",
          "financed_vehicle"=>"Vehículo financiado",
          "financed_vehicle_bank"=>"Banco financiador del vehículo",
          "life_insurance"=>"Tiene seguros de vida",
          "life_insurance_bank"=>"Entidad seguro de vida",
          "funeral_insurance"=>"Desea tomar seguro exequial",
          "have_credit"=>"Tiene créditos",
          "have_credit_amount"=>"Si la respuesta es si en que rango (Millones)",
          "own_business"=>"Tiene algún tipo de negocio propio",
          "would_you_like_business"=>"Le gustaría tenerlo",
          "business_idea"=>"¿Cual es su idea de negocio?",
          "birth_spouse"=>"Fecha de nacimiento del cónyugue",
          "education_level_spouse"=>"Nivel educativo del cónyugue",
          "surnames_spouse"=>"Apellido del cónyugue",
          "spouse_names"=>"Nombres del cónyugue",
          "identification_expedition_date"=>"",
        ];



        $return = [] ;

        foreach ($array as $key => $value) {
          if (!empty($vars[$key]) && $vars[$key]!="null") {
            $return[$value]   =   $vars[$key];
          }
        }
        //p($return);

        return $return;

    }
}

if (! function_exists('p')) {
    function p($var,$exit=true)
    {
        echo '<pre>';
          print_r($var);
        echo '</pre>';
        if ($exit) {
          exit;
        }
    }
}

if (! function_exists('abstractionPost')) {
    function abstractionPost($request){
      $exceptions =   [ "pathname"=>true,
                        "created_at"=>true,
                        "updated_at"=>true,
                        "csrf_token"=>true,
                        "access_token"=>true];
      $return     =   [];
      foreach ($request->input() as $key => $value) {
        if (empty($exceptions[$key])) {
          $return[$key]=$value;
        }
      }
      return $return;
    }
}

if (! function_exists('dateFormatMysql')) {
    function dateFormatMysql($column,$format='%d/%m/%Y %H:%i %p',$alias=false){
      if ($alias) {
        return "DATE_FORMAT(".$column.",'".$format."') as ".$alias;
      }else {
        return "DATE_FORMAT(".$column.",'".$format."') as ".$column."_string";
      }

    }
}

if (! function_exists('selectRawStatus')) {
    function selectRawStatus($object,$column,$group="basic"){
      $object->leftjoin('ma_statuses', $column , '=', 'ma_statuses.value')->where("ma_statuses.group","=",$group);
      $object->selectRaw("ma_statuses.label AS ".str_replace(".","_",$column)."_string");
      return $object;
    }
}
