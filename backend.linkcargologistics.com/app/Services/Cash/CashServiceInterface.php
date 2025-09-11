<?php
// app/Services/Cash/CashServiceInterface.php
namespace App\Services\Cash;

interface CashServiceInterface
{
    public function openShift(int $openedBy, float $openingAmount = 200000.00): \App\Models\CashShift;
    public function addIncome(int $shiftId, float $amount, ?string $method = 'efectivo', ?string $reference = null, ?string $note = null): \App\Models\CashMovement;
    public function addExpense(int $shiftId, float $amount, ?string $method = 'efectivo', ?string $reference = null, ?string $note = null): \App\Models\CashMovement;
    public function attachOrderPaid(int $shiftId, \App\Models\OrderPaid $paid): \App\Models\CashMovement;
    public function closeShift(int $shiftId, int $closedBy, float $closingAmountReal): \App\Models\CashShift;
    public function currentOpenShiftId(): ?int;
    public function expectedCash(int $shiftId): float;
}
