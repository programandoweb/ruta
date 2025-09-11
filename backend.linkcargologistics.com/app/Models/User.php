<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles; // Assuming the trait is in the Spatie\Permission\Traits namespace
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'customer_group_id',
        'name',
        'company_name',
        'image',
        'cover',
        'email',
        'email_verified_at',
        'password',
        'user_type',
        'identification_number',
        'identification_type',
        'phone_number',
        'address',
        'tax_no',
        'city',
        'state',
        'postal_code',
        'country',
        'business_id', // agregado
    ];


    

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function characteristics()
    {
        return $this->hasMany(UserCharacteristics::class, 'user_id');
    }


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function properties()
    {
        return $this->hasMany(PropertiesRelUser::class, 'properties_id');
    }

    public function credits()
    {
        return $this->hasMany(Credit::class, 'customer_id')->with(["approver","customer"])->orderBy("id","DESC");
    }

    public function credit()
    {
        return $this->hasOne(Credit::class, 'customer_id')
                    ->selectRaw("customer_id, SUM(amount) as amount")
                    ->groupBy('customer_id');
    }

    public function user_credit()
    {
        return $this->hasOne(Credit::class, 'customer_id')
                    ->selectRaw("customer_id, SUM(amount) as amount")
                    ->groupBy('customer_id');
    }

    public function sales()
    {
        return $this->hasMany(Sales::class, 'customer_id')->orderBy("id","DESC");
    }

    public function paids()
    {
        return $this->hasMany(SalesPayments::class, 'customer_id')->orderBy("id","DESC");
    }
    
}