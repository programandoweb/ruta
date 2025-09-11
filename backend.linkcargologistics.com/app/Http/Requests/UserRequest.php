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

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:6',
            'role'                  => 'required|exists:roles,name',
            'identification_number' => 'nullable|string',
            'identification_type'   => 'nullable|string',
            'phone_number'          => 'nullable|string',
            'address'               => 'nullable|string',
            'city'                  => 'nullable|string',
            'state'                 => 'nullable|string',
            'postal_code'           => 'nullable|string',
            'country'               => 'nullable|string',
            'business_id'           => 'nullable|exists:businesses,id',
        ];
    }
}
