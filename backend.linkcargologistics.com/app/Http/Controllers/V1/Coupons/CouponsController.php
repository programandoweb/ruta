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

namespace App\Http\Controllers\V1\Coupons;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\CouponsRepository;
use SimpleSoftwareIO\QrCode\Generator;
use Illuminate\Support\Str;
use App\Repositories\UserBusinessRepository;


class CouponsController extends Controller
{
    protected $couponsRepository;
    protected $userBusinessRepository;

    public function __construct(CouponsRepository $couponsRepository,UserBusinessRepository $userBusinessRepository)
    {
        $this->couponsRepository = $couponsRepository;
        $this->userBusinessRepository = $userBusinessRepository;
    }

    public function coupons_search(Request $request){
        try {
            $coupon     =   $this->couponsRepository->openFindById($request->code);
            return response()->success(compact('coupon'), "Cupón generador");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function use_coupons(Request $request){
        try {
            $coupon    =   $this->couponsRepository->use_coupons($request);
            return response()->success(compact('coupon'), "Cupón generador");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function new_generate(Request $request)
    {
        try {
            //p($request->all());
            // Generate QR code with text "Hello, Laravel 11!"
            $qrCode = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://ivoolve.cloud/cupones/123";
            return response()->success(compact('qrCode'), "Cupón generador");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function generate(Request $request)
    {
         try {
            // Generate QR code with text "Hello, Laravel 11!"
            $qrCode = "s";
            return response()->success(compact('qrCode'), "Cupón generador");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function get_generate(Request $request)
    {
         try {
            // Generate QR code with text "Hello, Laravel 11!"
            $qrCode = "s";
            return response()->success(compact('qrCode'), "Cupón generador");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $coupons = $this->couponsRepository->getAll($request);
            return response()->success(compact('coupons'), "Listado de cupones");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $userId     = $request->user()->id;

            $business   =   $this->userBusinessRepository->findById($userId);

            $validated  = $request->validate([
                'description' => 'nullable',
                'title'       => 'required|string|max:255',
                'type'        => 'required|in:percentage,fixed',
                'value'       => 'required|numeric|min:0',
                'expires_at'  => 'nullable|date',
                'is_active'   => 'boolean',
            ]);

            // Generar código único alfanumérico de 8 caracteres
            $validated['code'] = strtoupper(Str::random(8));

            if (!empty($business->id)) {
                $validated['business_id'] = $business->id;
            }

            $coupon = $this->couponsRepository->create($validated);

            return response()->success(compact('coupon'), "Cupón creado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function openShow(string $id)
    {
        try {
            $coupon = $this->couponsRepository->openFindById($id);
            if (!$coupon) {
                return response()->error("Open Cupón no encontrado", 404);
            }

            return response()->success(compact('coupon'), "Open Cupón encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }


    public function show(string $id)
    {
        try {
            $coupon = $this->couponsRepository->findById($id);
            if (!$coupon) {
                return response()->error("Cupón no encontrado", 404);
            }

            return response()->success(compact('coupon'), "Cupón encontrado");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'description' => 'nullable',
                'title'        => 'sometimes|required|string|max:255',
                'code'         => "sometimes|required|string|max:50|unique:coupons,code,{$id}",
                'type'         => 'sometimes|required|in:percentage,fixed',
                'value'        => 'sometimes|required|numeric|min:0',
                'expires_at'   => 'nullable|date',
                'is_active'    => 'boolean',
            ]);

            $coupon = $this->couponsRepository->update($id, $validated);
            if (!$coupon) {
                return response()->error("Cupón no encontrado", 404);
            }

            return response()->success(compact('coupon'), "Cupón actualizado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->couponsRepository->delete($id);
            if (!$deleted) {
                return response()->error("Cupón no encontrado", 404);
            }

            return response()->success([], "Cupón eliminado exitosamente");
        } catch (\Exception $e) {
            return response()->error($e->getMessage(), 500);
        }
    }
}
