<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;


class UserRepository
{

    public function get($request)
    {
        // Obtiene el valor de búsqueda, si existe
        $search = $request->input('search');

        // Inicia la consulta en el modelo User
        $query = User::query();

        // Selecciona los campos específicos que quieres obtener
        $query->selectRaw("id, name, email, user_type");

        // Si hay un término de búsqueda, agrega la condición de búsqueda
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%')
                ->orWhere('identification_number', 'like', '%' . $search . '%')
                ->orWhere('phone_number', 'like', '%' . $search . '%')
                ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        // Retorna los resultados paginados
       // Limitar los resultados a 20
        return $query->take(20)->get(); // O puedes usar $query->limit(20)->get();
    }


    public function getAll($request)
    {
        // Define el número de resultados por página, usando un valor predeterminado si no se proporciona
        $perPage = $request->input('per_page', config('constants.RESULT_X_PAGE'));
    
        // Obtiene el valor de búsqueda, si existe
        $search = $request->input('search');
    
        // Inicia la consulta en el modelo User
        $query = User::whereDoesntHave('roles', function ($q) {
            $q->where('name', 'super-admin'); // Excluye usuarios con el rol "super-admin"
        });
    
        // Selecciona los campos específicos que quieres obtener
        $query->selectRaw("id, name as Nombre, email")
            ->with(['roles' => function ($q) {
                $q->select('name'); // Obtiene solo el nombre del rol
            }]);
    
        // Si hay un término de búsqueda, agrega la condición de búsqueda
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('identification_number', 'like', '%' . $search . '%')
                    ->orWhere('phone_number', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            });
        }
    
        // Retorna los resultados paginados con los roles concatenados y elimina el campo "roles"
        return $query->paginate($perPage)->through(function ($user) {
            // Agrega los roles concatenados en la columna "Rol"
            $user->Rol = $user->roles->pluck('name')->implode(', ');
            unset($user->roles); // Elimina el campo "roles" del resultado
            return $user;
        });
    }
    




    public function create(array $data, $clientType): ?User
    {
        // Generar una contraseña aleatoria si no viene en los datos
        if (empty($data['password'])) {
            $data['password'] = bcrypt(Str::random(10));
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        // Crear el usuario
        $user = User::create($data);

        // Asignar el rol
        $user->assignRole($clientType);

        return $user;
    }



    public function update($request,$id): ?User{
        $user       =       User::find($id);
        $user->update($request->all());
        return $user;
    }

    public function updateIdentification($request): ?User{
        $user   =   User::find($request->input("id"));
        $user->update($request->all());
        return $user;
    }

    /*
    public function login(array $credentials): ?User
    {
        if (Auth::attempt($credentials)) {
            return Auth::user();
        }

        return null;
    }
        */
    public function searchIdentification($identification): ?User
    {
        $user   =   User::where("identification_number", "=", $identification->input("identification_number"))->first();
        
        if (!$user) {
            $user = User::firstOrCreate([
                "email"                     =>  "clientenuevo_".rand(1,600)."@ivoolve.cloud",
                "name"                      =>  "Cliente nuevo",
                "identification_number"     =>  $identification->input("identification_number"),
                "identification_type"       =>  (!empty($identification->input("identification_type")))?$identification->input("identification_type"):null,
                "password"                  =>  '$2y$12$M2uSppKnA.mpN63sgRC6du.43tF0BmMJLvsfvez56uOcg672li.SK',
            ]);
            $role   =   Role::findByName('clients');
            $user->assignRole($role);            
        }
        return $user;
    } 

    public function findByEmailVar($obj): ?User
    {
        $user   =   User::where("email", "=", $obj->email)->first();

        if (!$user) {
            $user = User::create([
                "email"             =>  $obj->email,
                "name"              =>  $obj->first_name_1 ,
                "surname"           =>  $obj->first_name_2,
                "identification"    =>  $obj->id_number_1 ,
                "photo"             =>  "images/uploads/fakes/avatar.webp",
                "password"          =>  '$2y$12$M2uSppKnA.mpN63sgRC6du.43tF0BmMJLvsfvez56uOcg672li.SK',
            ]);

            // Asignar el rol "Client" al nuevo usuario
            $user->assignRole('clients');
        }

        return $user;
    }    

    public function findByEmail($request): ?User
    {
        $email = $request->input("email");

        if (empty($email)) {
            return null; // Asegúrate de devolver null si el email no se proporciona
        }

        $user = User::where("email", $email)->first();

        if (!$user) {
            $user = User::create([
                "email" => $email,
                "name" => $request->input("first_name_1"),
                "surname" => $request->input("first_name_2"),
                "photo" => "images/uploads/fakes/avatar.webp",
                "password" => '$2y$12$M2uSppKnA.mpN63sgRC6du.43tF0BmMJLvsfvez56uOcg672li.SK',
            ]);

            // Asignar el rol "Client" al nuevo usuario
            $user->assignRole('clients');
        }

        return $user;
    }


    public function findById($id): ?User
    {
        // Asegúrate de que $id sea un entero o un valor adecuado para buscar un único usuario
        if (!is_numeric($id)) {
            return null;
        }

        // Encuentra el usuario por ID, o devuelve null si no se encuentra
        return User::with(["credits","credit","sales","paids"])->find($id);
    }


    public function getUsersByRole(string $roleName)
    {
        return User::role($roleName)->selectRaw("name, name as label, id as value, id")->with("credit")->get();
    }
}
