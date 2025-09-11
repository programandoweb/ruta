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

namespace App\Repositories;

use App\Models\Coupons;
use Illuminate\Http\Request;

class CouponsRepository
{

    public function use_coupons(Request $request){
        $coupon             =   Coupons::find($request->id);
        $coupon->used_count =   $coupon->used_count+1;
        $coupon->save();
        return $coupon;
    }

    public function getAll(Request $request)
    {
        $perPage    = $request->input('per_page', config('constants.RESULT_X_PAGE', 15));
        $search     = $request->input('search');
        $user       = $request->user();

        $query      = Coupons::with('business:id,name');

        if (!$user->hasRole(['super-admin', 'admin'])) {
            $query->whereHas('business', function ($bq) use ($user) {
                $bq->where('user_id', $user->id);
            });
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhereHas('business', function ($bq) use ($search) {
                      $bq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $result     =   $query->latest()->paginate($perPage);
        
        // Agregar campo 'qr' dinámicamente a cada item
        $result->getCollection()->transform(function ($item) {
            $frontUrl   =   env('APP_FRONT_URL');
            $item->qr   =   "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" . urlencode($frontUrl."/coupons?id={$item->code}");
            $item->url  =   $frontUrl."/coupons?id={$item->code}";
            return $item;
        });

        return $result;
    }

    public function create(array $data): Coupons
    {
        return Coupons::create($data);
    }

    public function findById(string $id): ?Coupons
    {
        return Coupons::with('business:id,name')->first($id);
    }

    public function openFindById(string $id): ?Coupons
    {
        $return     =   Coupons::with('business:id,name')
            ->where('is_active', 1)
            ->where('code', $id)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now());
            })
            ->first();
        if($return){
            $frontUrl   =   env('APP_FRONT_URL');
            $return->qr   =   "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" . urlencode($frontUrl."/coupons?id={$return->code}");
        }
        return $return;
    }

    public function update(string $id, array $data, Request $request = null): ?Coupons
    {
        $coupon = Coupons::find($id);

        if ($coupon) {
            $coupon->update($data);
        } else {
            $coupon = Coupons::create($data);
        }

        return $coupon;
    }

    public function delete(string $id): bool
    {
        $coupon = Coupons::find($id);
        return $coupon ? (bool) $coupon->delete() : false;
    }
}
