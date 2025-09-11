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

namespace App\Http\Controllers\V1\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\BusinessRepository;

class BusinessController extends Controller
{
    protected $businessRepository;

    public function __construct(BusinessRepository $businessRepository)
    {
        $this->businessRepository = $businessRepository;
    }

    public function index(Request $request)
    {
        try {
            $businesses = $this->businessRepository->getAll($request);
            return response()->success(compact('businesses'), 'Listado de empresas');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'            => 'required|string|max:255',
                'description'     => 'nullable|string',
                'contact_phone'   => 'nullable|string|max:20',
                'contact_email'   => 'nullable|email|max:255',
                'whatsapp_link'   => 'nullable|url|max:255',
                'location'        => 'nullable|string|max:255',
                'price'           => 'nullable|numeric|min:0',
                'unit'            => 'nullable|in:unitario,mensual,anual',
                'category_id'     => 'nullable|exists:services,id',
                'allow_comments'  => 'boolean',
                'allow_location'  => 'boolean',
                'user_id'         => 'nullable|exists:users,id',
            ]);

            $business = $this->businessRepository->create($validated);

            return response()->success(compact('business'), 'Empresa registrada exitosamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $users          =       $business   =     [];
            
            if($id!='new'){
                $business   =       $this->businessRepository->findById($id);    
                $users = \App\Models\User::where('business_id', $business->id)->get();
            }
            $roles = \Spatie\Permission\Models\Role::select('id', 'name')->whereIn('name', ['employees', 'managers', 'admin','providers'])->get();
            
            return response()->success(compact('business','roles','users'), 'Empresa encontrada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name'            => 'required|string|max:255',
                'description'     => 'nullable|string',
                'contact_phone'   => 'nullable|string|max:20',
                'contact_email'   => 'nullable|email|max:255',
                'whatsapp_link'   => 'nullable|url|max:255',
                'location'        => 'nullable|string|max:255',
                'price'           => 'nullable|numeric|min:0',
                'unit'            => 'nullable|in:unitario,mensual,anual',
                'category_id'     => 'nullable|exists:services,id',
                'allow_comments'  => 'boolean',
                'allow_location'  => 'boolean',
            ]);

            $business = $this->businessRepository->update($id, $validated);

            return response()->success(compact('business'), 'Empresa actualizada correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->businessRepository->delete($id);
            if (! $deleted) {
                return response()->error('Empresa no encontrada', 404);
            }

            return response()->success([], 'Empresa eliminada');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
