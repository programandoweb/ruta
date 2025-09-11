<?php

/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * Website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Http\Controllers\V1\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UsersController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        try {
            $users = $this->userRepository->getAll($request);
            return response()->success(compact('users'), 'Listado de usuarios');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if (!$request->user()->hasRole('super-admin') && !$request->user()->hasRole('admin')) {
                return response()->error('No tienes permiso para realizar esta acción.', 403);
            }

            $validator = Validator::make($request->all(), [
                'name'              => 'required|string|max:255',
                'email'             => 'required|email|unique:users,email',
                'password'          => 'required|string|min:6',
                'role'              => 'required|exists:roles,name',
                'phone_number'      => 'nullable|string',
                'address'           => 'nullable|string',
                'city'              => 'nullable|string',
                'state'             => 'nullable|string',
                'postal_code'       => 'nullable|string',
                'country'           => 'nullable|string',
                'business_id'       => 'nullable|exists:users,id',
                'company_name'      => 'nullable|string|max:255',
                'customer_group_id' => 'nullable|integer|exists:users,id',
                'image'             => 'nullable|string',
                'cover'             => 'nullable|string',
                'tax_no'            => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            $data       = $validator->validated();
            $clientType = $data['role'];
            $user       = $this->userRepository->create($data, $clientType);

            $users = User::where('business_id', $user->business_id)->get();

            return response()->success(compact('user', 'users'), 'Usuario creado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $user = $this->userRepository->findById($id);
            return response()->success(compact('user'), 'Detalle del usuario');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'              => 'sometimes|required|string|max:255',
                'email'             => 'sometimes|required|email|unique:users,email,' . $id,
                'password'          => 'sometimes|required|string|min:6',
                'role'              => 'sometimes|required|exists:roles,name',
                'phone_number'      => 'nullable|string',
                'address'           => 'nullable|string',
                'city'              => 'nullable|string',
                'state'             => 'nullable|string',
                'postal_code'       => 'nullable|string',
                'country'           => 'nullable|string',
                'business_id'       => 'nullable|exists:users,id',
                'company_name'      => 'nullable|string|max:255',
                'customer_group_id' => 'nullable|integer|exists:users,id',
                'image'             => 'nullable|string',
                'cover'             => 'nullable|string',
                'tax_no'            => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->error($validator->errors()->first(), 422);
            }

            $user = $this->userRepository->update($id, $validator->validated());
            return response()->success(compact('user'), 'Usuario actualizado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->userRepository->delete($id);
            return response()->success([], 'Usuario eliminado correctamente');
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
