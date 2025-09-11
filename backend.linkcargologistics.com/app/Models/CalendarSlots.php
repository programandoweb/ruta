<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class CalendarSlots extends Model
{
    use HasFactory;

    protected $table = 'calendar_slots';

    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'status',
        'provider_id',
        'client_id',
        'employee_id',
    ];

    protected $casts = [
        'date'       => 'date',
        'start_time' => 'string',
        'end_time'   => 'string',
    ];

    public function provider(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function employee(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function event_orders()
    {
        return $this->hasMany(EventOrder::class, 'calendar_slot_id', 'id')->with("servicio");
    }


}
