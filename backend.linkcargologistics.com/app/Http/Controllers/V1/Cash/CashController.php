<?php

namespace App\Http\Controllers\V1\Cash;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Services\Cash\CashServiceInterface;
use App\Models\CashShift;
use App\Models\CashMovement;

class CashController extends Controller
{
    public function __construct(
        protected CashServiceInterface $cash
    ) {}

    /**
     * POST /dashboard/cash/open
     * Abre turno de caja (evita doble apertura).
     */
    public function open(Request $request)
    {
        try {
            $validated = $request->validate([
                'opening_amount' => 'nullable|numeric|min:0',
            ]);

            // Evitar doble apertura
            if ($this->cash->currentOpenShiftId()) {
                $shift = CashShift::find($this->cash->currentOpenShiftId());
                return response()->success(compact('shift'), 'Ya hay una caja abierta.');
            }

            $amount = $validated['opening_amount'] ?? (float) config('cash.opening_amount', 200000);
            $shift  = $this->cash->openShift(Auth::id(), $amount);

            return response()->success(compact('shift'), 'Caja abierta correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/cash/status
     * Estado actual de caja (si está abierta incluye resumen y últimos movimientos).
     */
    public function status(Request $request)
    {
        try {
            $shiftId = $this->cash->currentOpenShiftId();
            if (!$shiftId) {
                return response()->success([
                    'status' => 'closed',
                    'shift'  => null,
                ], 'No hay caja abierta.');
            }

            // Puedes eager load si tienes relaciones openedBy/closedBy
            $shift = CashShift::find($shiftId);

            $ingresos = CashMovement::where('cash_shift_id', $shiftId)->where('type', 'ingreso')->sum('amount');
            $egresos  = CashMovement::where('cash_shift_id', $shiftId)->where('type', 'egreso')->sum('amount');
            $esperado = $this->cash->expectedCash($shiftId);

            $movements = CashMovement::where('cash_shift_id', $shiftId)
                ->latest('id')
                ->take(15)
                ->get();

            return response()->success([
                'status'     => 'open',
                'shift'      => $shift,
                'summary'    => [
                    'opening_amount' => (float) $shift->opening_amount,
                    'ingresos'       => (float) $ingresos,
                    'egresos'        => (float) $egresos,
                    'saldo_esperado' => (float) $esperado,
                ],
                'movements'  => $movements,
            ], 'Estado de caja.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/cash/summary
     * Resumen ligero (sin movimientos) para cards del dashboard.
     */
    public function summary(Request $request)
    {
        try {
            $shiftId = $this->cash->currentOpenShiftId();
            if (!$shiftId) {
                return response()->success([
                    'status'  => 'closed',
                    'summary' => null,
                ], 'No hay caja abierta.');
            }

            $shift    = CashShift::find($shiftId);
            $ingresos = CashMovement::where('cash_shift_id', $shiftId)->where('type','ingreso')->sum('amount');
            $egresos  = CashMovement::where('cash_shift_id', $shiftId)->where('type','egreso')->sum('amount');
            $esperado = $this->cash->expectedCash($shiftId);

            return response()->success([
                'status'  => 'open',
                'summary' => [
                    'opening_amount' => (float) $shift->opening_amount,
                    'ingresos'       => (float) $ingresos,
                    'egresos'        => (float) $egresos,
                    'saldo_esperado' => (float) $esperado,
                ],
            ], 'Resumen de caja.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/cash/movements
     * Movimientos del turno (paginado/filtrable).
     * Query: shift_id?, type?, method?, q?, per_page?
     */
    public function movements(Request $request)
    {
        try {
            $perPage  = (int) $request->input('per_page', (int) config('constants.RESULT_X_PAGE', 15));
            $shiftId  = $request->input('shift_id') ?: $this->cash->currentOpenShiftId();
            $type     = $request->input('type');   // apertura|ingreso|egreso|cierre
            $method   = $request->input('method'); // efectivo|tarjeta|...
            $q        = $request->input('q');

            if (!$shiftId) {
                return response()->success([
                    'movements' => [],
                    'pagination'=> null,
                ], 'No hay caja abierta.');
            }

            $query = CashMovement::where('cash_shift_id', $shiftId)
                ->when($type, fn($qq) => $qq->where('type', $type))
                ->when($method, fn($qq) => $qq->where('method', $method))
                ->when($q, function ($qq) use ($q) {
                    $qq->where(function ($w) use ($q) {
                        $w->where('reference', 'like', "%$q%")
                          ->orWhere('note', 'like', "%$q%");
                    });
                })
                ->latest('id');

            $movements = $query->paginate($perPage);

            return response()->success(compact('movements'), 'Movimientos de caja.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /dashboard/cash/income
     * Registrar ingreso manual.
     */
    public function income(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount'    => 'required|numeric|min:0.01',
                'method'    => 'nullable|string|max:50',
                'reference' => 'nullable|string|max:100',
                'note'      => 'nullable|string|max:255',
            ]);

            $shiftId  = $this->ensureOpenShift();
            $movement = $this->cash->addIncome(
                $shiftId,
                (float) $validated['amount'],
                $validated['method']    ?? 'efectivo',
                $validated['reference'] ?? null,
                $validated['note']      ?? null,
            );

            return response()->success(compact('movement'), 'Ingreso registrado.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /dashboard/cash/expense
     * Registrar egreso manual.
     */
    public function expense(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount'    => 'required|numeric|min:0.01',
                'method'    => 'nullable|string|max:50',
                'reference' => 'nullable|string|max:100',
                'note'      => 'nullable|string|max:255',
            ]);

            $shiftId  = $this->ensureOpenShift();
            $movement = $this->cash->addExpense(
                $shiftId,
                (float) $validated['amount'],
                $validated['method']    ?? 'efectivo',
                $validated['reference'] ?? null,
                $validated['note']      ?? null,
            );

            return response()->success(compact('movement'), 'Egreso registrado.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /dashboard/cash/safe-drop
     * Descarga de efectivo a bóveda (safe drop) como egreso con reference fijo.
     */
    public function safeDrop(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'note'   => 'nullable|string|max:255',
            ]);

            $shiftId  = $this->ensureOpenShift();
            $movement = $this->cash->addExpense(
                $shiftId,
                (float) $validated['amount'],
                'efectivo',
                'safe_drop',
                $validated['note'] ?? 'Descarga de caja a bóveda'
            );

            return response()->success(compact('movement'), 'Descarga a bóveda registrada.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /dashboard/cash/close
     * Cerrar turno de caja.
     */
    public function close(Request $request)
    {
        try {
            $validated = $request->validate([
                'closing_amount_real' => 'required|numeric|min:0',
            ]);

            $shiftId = $this->cash->currentOpenShiftId();
            if (!$shiftId) {
                return response()->error('No existe una caja abierta para cerrar.', 400);
            }

            $shift = $this->cash->closeShift(
                $shiftId,
                Auth::id(),
                (float) $validated['closing_amount_real']
            );

            // Resumen al cierre
            $ingresos = CashMovement::where('cash_shift_id', $shiftId)->where('type','ingreso')->sum('amount');
            $egresos  = CashMovement::where('cash_shift_id', $shiftId)->where('type','egreso')->sum('amount');
            $esperado = (float) $shift->closing_amount_expected;

            return response()->success([
                'shift'   => $shift,
                'summary' => [
                    'opening_amount' => (float) $shift->opening_amount,
                    'ingresos'       => (float) $ingresos,
                    'egresos'        => (float) $egresos,
                    'saldo_esperado' => (float) $esperado,
                    'saldo_real'     => (float) $shift->closing_amount_real,
                    'diferencia'     => (float) $shift->closing_amount_real - $esperado,
                ],
            ], 'Caja cerrada correctamente.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * GET /dashboard/cash/report-z
     * Reporte Z por turno o por fecha.
     * Params: shift_id | date=YYYY-MM-DD
     */
    public function reportZ(Request $request)
    {
        try {
            $shiftId = $request->input('shift_id');
            $date    = $request->input('date');

            if ($shiftId) {
                $shift = CashShift::find($shiftId);
                if (!$shift) {
                    return response()->error('Turno no encontrado.', 404);
                }
                $rangeStart = $shift->opened_at ?: $shift->created_at;
                $rangeEnd   = $shift->closed_at ?: now();
            } elseif ($date) {
                $rangeStart = \Carbon\Carbon::parse($date)->startOfDay();
                $rangeEnd   = \Carbon\Carbon::parse($date)->endOfDay();
                $shift = null;
            } else {
                $sid = $this->cash->currentOpenShiftId();
                if (!$sid) {
                    return response()->error('Especifique shift_id o date. No hay caja abierta.', 400);
                }
                $shift = CashShift::find($sid);
                $rangeStart = $shift->opened_at ?: $shift->created_at;
                $rangeEnd   = now();
            }

            $movs = CashMovement::when($shift, fn($q) => $q->where('cash_shift_id', $shift->id))
                ->when(!$shift, fn($q) => $q->whereBetween('created_at', [$rangeStart, $rangeEnd]))
                ->get();

            $ingresos = (float) $movs->where('type','ingreso')->sum('amount');
            $egresos  = (float) $movs->where('type','egreso')->sum('amount');

            $byMethod = $movs->groupBy('method')->map(function ($g) {
                return [
                    'ingresos' => (float) $g->where('type','ingreso')->sum('amount'),
                    'egresos'  => (float) $g->where('type','egreso')->sum('amount'),
                ];
            });

            $data = [
                'range' => [
                    'from' => (string) $rangeStart,
                    'to'   => (string) $rangeEnd,
                ],
                'totals' => [
                    'ingresos' => $ingresos,
                    'egresos'  => $egresos,
                    'neto'     => $ingresos - $egresos,
                ],
                'by_method' => $byMethod,
            ];

            if ($shift) {
                $data['shift'] = $shift;
                $data['totals']['opening_amount']       = (float) $shift->opening_amount;
                $data['totals']['saldo_esperado']       = (float) $this->cash->expectedCash($shift->id);
                $data['totals']['closing_amount_real']  = (float) ($shift->closing_amount_real ?? 0);
                $data['totals']['diferencia']           = (float) (($shift->closing_amount_real ?? 0) - $data['totals']['saldo_esperado']);
            }

            return response()->success($data, 'Reporte Z.');
        } catch (\Throwable $e) {
            return response()->error($e->getMessage(), 500);
        }
    }

    /**
     * Garantiza un turno abierto; si no, lo abre con fondo fijo.
     */
    private function ensureOpenShift(): int
    {
        $shiftId = $this->cash->currentOpenShiftId();
        if ($shiftId) return (int) $shiftId;

        $opening = (float) config('cash.opening_amount', 200000);
        $shift   = $this->cash->openShift(Auth::id(), $opening);

        return (int) $shift->id;
    }
}
