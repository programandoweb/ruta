<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Str;

class OrderObserver
{
    /**
     * Handle the Order "creating" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function creating(Order $order)
    {
        $order->order_number = strtoupper($this->generateUniqueOrderNumber());
    }

    /**
     * Generate a unique order number containing at least 7 letters and 3 numbers.
     *
     * @return string
     */
    protected function generateUniqueOrderNumber()
    {
        do {
            $orderNumber = $this->generateOrderNumber();
        } while (Order::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    /**
     * Generate an order number containing at least 7 letters and 3 numbers.
     *
     * @return string
     */
    protected function generateOrderNumber()
    {
        $letters = Str::random(7);
        $numbers = str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);
        $orderNumber = $letters . $numbers;

        // Shuffle the order number to mix letters and numbers
        return str_shuffle($orderNumber);
    }
}
