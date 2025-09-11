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

namespace App\Services\Cash;

use App\Models\CashShift;
use App\Models\CashMovement;
use App\Models\OrderPaid;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CashService implements CashServiceInterface
{
    public function openShift(int $openedBy, float $openingAmount = 200000.00): CashShift
    {
        return DB::transaction(function () use ($openedBy, $openingAmount) {
            // Evitar 2 turnos abiertos
            $exists = CashShift::where('status', 'open')->lockForUpdate()->exists();
            if ($exists) {
                throw new \RuntimeException('Ya existe una caja abierta.');
            }

            $shift = CashShift::create([
                'opened_by'      => $openedBy,
                'opening_amount' => $openingAmount,
                'opened_at'      => now(),
                'status'         => 'open',
            ]);

            CashMovement::create([
                'cash_shift_id' => $shift->id,
                'type'          => 'apertura',
                'amount'        => $openingAmount,
                'method'        => 'efectivo',
                'reference'     => 'fondo_fijo',
                'note'          => 'Fondo fijo de caja',
            ]);

            return $shift;
        });
    }

    public function addIncome(
        int $shiftId,
        float $amount,
        ?string $method = 'efectivo',
        ?string $reference = null,
        ?string $note = null
    ): CashMovement {
        return $this->addMovement($shiftId, 'ingreso', $amount, $method, $reference, $note);
    }

    public function addExpense(
        int $shiftId,
        float $amount,
        ?string $method = 'efectivo',
        ?string $reference = null,
        ?string $note = null
    ): CashMovement {
        return $this->addMovement($shiftId, 'egreso', $amount, $method, $reference, $note);
    }

    public function attachOrderPaid(int $shiftId, OrderPaid $paid): CashMovement
    {
        return DB::transaction(function () use ($shiftId, $paid) {
            $movement = $this->addIncome(
                shiftId:   $shiftId,
                amount:    (float) $paid->amount,
                method:    $paid->method ?? 'efectivo',
                reference: 'order_paid:' . $paid->id,
                note:      'Cobro mesa ' . $paid->table_id
            );

            // Si la tabla order_paids tiene la columna cash_shift_id
            if (Schema::hasColumn($paid->getTable(), 'cash_shift_id')) {
                $paid->cash_shift_id = $shiftId;
                $paid->save();
            }

            return $movement;
        });
    }

    public function closeShift(int $shiftId, int $closedBy, float $closingAmountReal): CashShift
    {
        return DB::transaction(function () use ($shiftId, $closedBy, $closingAmountReal) {
            /** @var CashShift $shift */
            $shift = CashShift::where('id', $shiftId)->lockForUpdate()->first();
            if (!$shift || $shift->status !== 'open') {
                throw new ModelNotFoundException('Turno no encontrado o ya cerrado.');
            }

            $expected = $this->expectedCash($shiftId);

            $shift->update([
                'closed_by'               => $closedBy,
                'closing_amount_expected' => $expected,
                'closing_amount_real'     => $closingAmountReal,
                'closed_at'               => now(),
                'status'                  => 'closed',
            ]);

            CashMovement::create([
                'cash_shift_id' => $shiftId,
                'type'          => 'cierre',
                'amount'        => $closingAmountReal,
                'method'        => 'efectivo',
                'reference'     => 'cierre',
                'note'          => 'Cierre de caja',
            ]);

            return $shift;
        });
    }

    public function currentOpenShiftId(): ?int
    {
        return CashShift::where('status', 'open')->latest('opened_at')->value('id');
    }

    public function expectedCash(int $shiftId): float
    {
        $shift = CashShift::findOrFail($shiftId);

        $ingresos = CashMovement::where('cash_shift_id', $shiftId)
            ->where('type', 'ingreso')
            ->sum('amount');

        $egresos = CashMovement::where('cash_shift_id', $shiftId)
            ->where('type', 'egreso')
            ->sum('amount');

        return (float) $shift->opening_amount + (float) $ingresos - (float) $egresos;
    }

    private function addMovement(
        int $shiftId,
        string $type,
        float $amount,
        ?string $method,
        ?string $reference,
        ?string $note
    ): CashMovement {
        if (!in_array($type, ['apertura', 'ingreso', 'egreso', 'cierre'], true)) {
            throw new \InvalidArgumentException('Tipo de movimiento inválido.');
        }
        if ($amount < 0) {
            throw new \InvalidArgumentException('El monto debe ser positivo.');
        }

        // Verificar que la caja esté abierta
        $shift = CashShift::where('id', $shiftId)->where('status', 'open')->first();
        if (!$shift) {
            throw new \RuntimeException('Caja no abierta o inexistente.');
        }

        return CashMovement::create([
            'cash_shift_id' => $shiftId,
            'type'          => $type,
            'amount'        => $amount,
            'method'        => $method,
            'reference'     => $reference,
            'note'          => $note,
        ]);
    }
}
