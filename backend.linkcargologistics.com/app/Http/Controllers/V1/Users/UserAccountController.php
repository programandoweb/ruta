<?php

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\UserAccountRepository;
use App\Repositories\UserBusinessRepository;
use Illuminate\Support\Facades\Validator;
use App\Repositories\ServiciosRepository;

class UserAccountController extends Controller
{
    protected $userAccountRepository;
    protected $userBusinessRepository;
    protected $serviciosRepository;

    public function __construct(    ServiciosRepository $serviciosRepository,
                                    UserAccountRepository $userAccountRepository,
                                    UserBusinessRepository $userBusinessRepository)
    {
        $this->serviciosRepository      = $serviciosRepository;
        $this->userAccountRepository    = $userAccountRepository;
        $this->userBusinessRepository   = $userBusinessRepository;
    }

    public function index(Request $request)
    {
        try {
            $servicios = $this->userAccountRepository ->getAll($request);
            return response()->success(compact('servicios'), "Listado de servicios");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id'      => 'nullable|exists:users,id',
                'name'         => 'required|string|max:255',
                'description'  => 'nullable|string',
                'rating'       => 'nullable|integer|min:0|max:5',
                'location'     => 'nullable|string|max:255',
                'gallery'      => 'nullable|array',
                'contact_phone'=> 'nullable',
                'gallery.*'    => 'string'
            ]);

            $servicio = $this->userAccountRepository ->create($validated);
            return response()->success(compact('servicio'), "Servicio registrado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(Request $request)
    {
        $id = $request->user()->id;
        try {
            $account = $this->userAccountRepository ->findById($id,$request);

            //if (!$account) {
            //    return response()->error("account no encontrado", 404);
            //}
            $services       =   $this->serviciosRepository->get();

            return response()->success(compact('account','services'), "account encontrado show");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function business(Request $request)
    {
        $id     =   $request->user()->id;
        try {
            $account = $this->userBusinessRepository->findById($id)??false;
            if($account){
                $account->gallery = $this->userBusinessRepository->getGallery($account->id);
            }           
            return response()->success(compact('account'), "account encontrado business ");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update_business(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $validated = $request->validate([
                'name'          => 'required|string|max:255',
                'location'      => 'nullable|string|max:255',
                'contact_phone'  => 'nullable|string|max:20',
                'contact_email' => 'nullable|email|max:255', // Add if you need to update email
                'whatsapp_link' => 'nullable|url|max:255', // Add if you need to update whatsapp link
                'price'         => 'nullable|numeric|min:0', // Add if you need to update price
                'unit'          => 'nullable|in:unitario,mensual,anual', // Add if you need to update unit
                'description'   => 'nullable|string',
                'category_id'   => 'nullable',
                'allow_comments' => 'boolean',
                'allow_location' => 'boolean',
            ]);

            $account = $this->userBusinessRepository->updateOrCreate($userId, $validated);

            if($request->has("gallery")){
                $account->gallery = $this->userBusinessRepository->updateOrCreateGallery($account->id, $request->gallery);
            }

            return response()->success(compact('account'), 'Negocio actualizado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function account_show(Request $request){
        try {
            $userId     =   $request->user()->id;
            $account    =   $this->userAccountRepository->findById($userId);
            $business   =   $this->userBusinessRepository->findById($userId);

            return response()->success(compact('userId','account','business'), "Cuenta de usuario actualizada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function update(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $validated          =   $request->validate([
                'user_id'       => 'sometimes|nullable|exists:users,id',
                'name'          => 'sometimes|required|string|max:255',
                'description'   => 'nullable|string',
                'image'         => 'nullable|string',
                'rating'        => 'nullable|integer|min:0|max:5',
                'location'      => 'nullable|string|max:255',
                'gallery'       => 'nullable|array',
                'gallery.*'     => 'string',
                'contact_phone' => 'nullable',
            ]);
            
            if($request->has("category_id")){
               $validated["category_id"] = $request->category_id;
            }

            $account = $this->userAccountRepository->update($userId, $validated, $request);

            if (!$account) {
                return response()->error("Cuenta de usuario no encontrada", 404);
            }

            return response()->success(compact('account'), "Cuenta de usuario actualizada");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }    

    public function destroy(string $id)
    {
        try {
            $deleted = $this->userAccountRepository ->delete($id);
            if (! $deleted) {
                return response()->error("Servicio no encontrado", 404);
            }

            return response()->success([], "Servicio eliminado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
