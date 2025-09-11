<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Services;

use Illuminate\Support\Facades\Response;

class DownloadService
{
    /**
     * Genera una descarga inmediata de un archivo JSON.
     *
     * @param  array|string  $data
     * @param  string  $filename
     * @return \Illuminate\Http\Response
     */
    public function downloadJson(array|string $data, string $filename = 'data.json')
    {
        $json = is_array($data) ? json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : $data;

        return Response::make($json, 200, [
            'Content-Type'        => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
