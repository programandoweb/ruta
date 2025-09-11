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

namespace App\Contracts;

interface AuthRepositoryInterface
{
    /**
     * Autenticar usuario con las credenciales proporcionadas.
     *
     * @param array $credentials
     * @return array|null
     */
    public function login(array $credentials);
}
