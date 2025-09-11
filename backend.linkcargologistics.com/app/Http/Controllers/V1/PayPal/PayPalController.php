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

namespace App\Http\Controllers\V1\PayPal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use Illuminate\Support\Facades\Log;
use App\Models\UsersSuscriptions;
use Carbon\Carbon;

class PayPalController extends Controller
{
    /**
     * Set up the PayPal API environment.
     */
    protected function environment()
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $clientSecret = env('PAYPAL_SECRET');

        return new SandboxEnvironment($clientId, $clientSecret);
    }

    /**
     * Returns PayPal HTTP client instance with environment.
     */
    protected function client()
    {
        try {
            return new PayPalHttpClient($this->environment());
        } catch (\Throwable $th) {
            p($th);
        }
    }

    /**
     * Crea una nueva orden de PayPal.
     */
    public function createOrder(Request $request)
    {
        $amount = $request->input('amount', '100.00');
        $currency = $request->input('currency', 'USD');

        $orderRequest = new OrdersCreateRequest();
        $orderRequest->prefer('return=representation');
        $orderRequest->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "reference_id" => "default_ref_id",
                "amount" => [
                    "currency_code" => $currency,
                    "value" => $amount
                ]
            ]],
            "application_context" => [
                "cancel_url" => url('/paypal/cancel'),
                "return_url" => url('/paypal/success')
            ]
        ];

        try {
            $response = $this->client()->execute($orderRequest);
            $orderID = $response->result->id;
            $links = $response->result->links;

            return response()->success(compact("orderID", "links"), 'paypal generado con éxito');
        } catch (\Throwable $e) {
            Log::error('PayPal createOrder error: ' . $e->getMessage(), ['trace' => $e->getTrace()]);
            return response()->json([
                'error' => 'No se pudo crear la orden',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Captura los fondos de una orden de PayPal aprobada.
     */
    public function captureOrder(Request $request)
    {
        $orderId = $request->input('orderID');
        $captureRequest = new OrdersCaptureRequest($orderId);

        try {
            $response = $this->client()->execute($captureRequest);
            $success = true;
            $transaction = $response->result;

            // Fechas de suscripción
            $startDate = Carbon::now();
            $endDate = Carbon::now()->addYear();

            // Crear la suscripción
            UsersSuscriptions::create([
                'user_id'       => auth()->id(), // Asegúrate que el usuario esté autenticado
                'name'          => 'Suscripción Anual',
                'description'   => 'Acceso a todos los servicios premium durante un año',
                'start_date'    => $startDate->format('Y-m-d'),
                'end_date'      => $endDate->format('Y-m-d'),
            ]);

            return response()->success(compact("success", "transaction"), 'OrdersCapture generado con éxito');
        } catch (\Throwable $e) {
            Log::error('PayPal captureOrder error: ' . $e->getMessage(), ['trace' => $e->getTrace()]);
            return response()->json([
                'error' => 'No se pudo capturar la orden',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
