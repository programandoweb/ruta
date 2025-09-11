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
use App\Repositories\EmployeesRepository;

class EmployeesController extends Controller
{
    protected $employeesRepository;

    public function __construct(EmployeesRepository $employeesRepository)
    {
        $this->employeesRepository = $employeesRepository;
    }

    public function index(Request $request)
    {
        try {
            $employees = $this->employeesRepository->getAll($request);
            return response()->success(compact('employees'), "Listado de empleados");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $creator = $request->user();

            // Verificar si el usuario autenticado tiene permiso
            if (! $creator->hasRole(['super-admin', 'admin', 'providers'])) {
                return response()->error("No tiene permisos para crear empleados", 403);
            }

            $validated = $request->validate([
                'name'                  => 'required|string|max:255',
                'company_name'          => 'nullable|string|max:255',
                'email'                 => 'required|email|unique:users,email',
                'phone_number'          => 'nullable|string|max:20',
                'identification_number' => 'nullable|string|max:50',
                'password'              => 'nullable|string|min:6',
            ]);

            // Asignar customer_group_id si el creador es un proveedor
            if ($creator->hasRole('providers')) {
                $validated['customer_group_id'] = $creator->id;
                //p($validated);
            }

            // Asignar password predeterminado si no se envía
            if (!isset($validated['password'])) {
                $validated['password'] = \Hash::make('password');
            } else {
                $validated['password'] = \Hash::make($validated['password']);
            }

            $employee = $this->employeesRepository->create($validated,$request);

            // Asegurar que se le asigna el rol 'employees'
            //$employee->assignRole('employees');

            return response()->success(compact('employee'), "Empleado registrado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function show(string $id)
    {
        try {
            $employee = $this->employeesRepository->findById($id);
            //p($employee);
            if (! $employee && $id!='new') {
                return response()->error("Empleado no encontrado", 404);
            }

            // Traer todos los roles disponibles
            $roles = \Spatie\Permission\Models\Role::select('id', 'name')
                    ->whereIn('name', ['employees', 'managers'])
                    ->get();

            return response()->success(compact('employee', 'roles'), "Empleado encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name'                  => 'sometimes|required|string|max:255',
                'company_name'          => 'nullable|string|max:255',
                'email'                 => 'sometimes|required|email|unique:users,email,'.$id,
                'phone_number'          => 'nullable|string|max:20',
                'identification_number' => 'nullable|string|max:50',
                'password'              => 'nullable|string|min:6',
                'role'                  => 'required|string|exists:roles,name',
            ]);

            $employee = $this->employeesRepository->findById($id);
            if (! $employee) {
                return response()->error("Empleado no encontrado", 404);
            }

            // Solo actualizar password si viene y no es vacío
            if (array_key_exists('password', $validated)) {
                if (trim($validated['password']) !== '') {
                    $validated['password'] = \Hash::make($validated['password']);
                } else {
                    unset($validated['password']); // Evitar actualizarlo con vacío
                }
            }

            $employee->update($validated);

            $employee->syncRoles([]);
            $employee->assignRole($validated['role']);

            return response()->success(compact('employee'), "Empleado actualizado correctamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }



    public function destroy(string $id)
    {
        try {
            $deleted = $this->employeesRepository->delete($id);
            if (! $deleted) {
                return response()->error("Empleado no encontrado", 404);
            }

            return response()->success([], "Empleado eliminado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
