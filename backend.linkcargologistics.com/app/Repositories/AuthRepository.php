<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: +57 3115000926
 *  Website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */

namespace App\Repositories;

use App\Contracts\AuthRepositoryInterface;
use App\Models\User;
use App\Models\UsersSuscriptions;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthRepository implements AuthRepositoryInterface
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function generateTokenLogin($user){
        // Invalida todos los tokens previos del usuario
        JWTAuth::setToken(JWTAuth::fromUser($user))->invalidate(true);
        // Genera nuevo token
        $token = JWTAuth::fromUser($user);

        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        $role        = $user->getRoleNames()->first(); // rol principal

        if ($user->confirmation_code != '') {
            return [
                'user' => [
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $role,
                ],
                'permissions' => [],
                'is_admin'    => false,
                'redirect'    => "ConfirmScreen"
            ];
        }

        $usersSuscriptions = UsersSuscriptions::where("user_id", $user->id)
                                ->orderBy("id", "DESC")->first();

        return [
            'token' => $token,
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email'=> $user->email,
                'image'=> $user->image,
                'role' => $role,
            ],
            'usersSuscription' => $usersSuscriptions ?? false,
            'permissions'      => $permissions,
            'is_admin'         => $user->hasRole('super-admin') || $user->hasRole('admin'),
        ];
    }

    public function login(array $credentials)
    {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Invalida todos los tokens previos del usuario
            JWTAuth::setToken(JWTAuth::fromUser($user))->invalidate(true);

            // Genera nuevo token
            $token = JWTAuth::fromUser($user);

            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $role        = $user->getRoleNames()->first(); // rol principal

            if ($user->confirmation_code != '') {
                return [
                    'user' => [
                        'name'  => $user->name,
                        'email' => $user->email,
                        'role'  => $role,
                    ],
                    'permissions' => [],
                    'is_admin'    => false,
                    'redirect'    => "ConfirmScreen"
                ];
            }

            $usersSuscriptions = UsersSuscriptions::where("user_id", $user->id)
                                    ->orderBy("id", "DESC")->first();

            return [
                'token' => $token,
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email'=> $user->email,
                    'image'=> $user->image,
                    'role' => $role,
                ],
                'usersSuscription' => $usersSuscriptions ?? false,
                'permissions'      => $permissions,
                'is_admin'         => $user->hasRole('super-admin') || $user->hasRole('admin'),
            ];
        }

        return null;
    }

}
