<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ticket - Orden #{{ $order->id }}</title>
    <style>
        body {
            font-size: 9px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            margin: 0;
            padding: 0;
            width: 58mm; /* típico ancho de rollo impresora */
        }
        .header {
            text-align: center;
            margin-bottom: 5px;
        }
        .enterprise {
            font-size: 8px;
            margin-bottom: 5px;
        }
        .order-info {
            margin: 5px 0;
            font-size: 9px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 3px;
        }
        th, td {
            font-size: 9px;
            padding: 2px;
            border-bottom: 1px dashed #999;
        }
        th {
            background: #f2f2f2;
        }
        .total {
            margin-top: 6px;
            font-weight: bold;
            text-align: right;
            border-top: 1px dashed #000;
            padding-top: 4px;
            font-size: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 8px;
            border-top: 1px dashed #aaa;
            padding-top: 4px;
        }
        .cancelada {
            color: red;
            font-weight: bold;
            font-size: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="enterprise">
            @if(isset($order->enterprise) && is_array($order->enterprise))
                @foreach($order->enterprise as $key => $value)
                    <div><b>{{ $key }}</b>: {{ $value }}</div>
                @endforeach
            @endif
        </div>
    </div>

    <div class="order-info">
        ORDEN #{{ $order->id }} <br>
        CLIENTE: {{ $order->customer_name ?? 'N/A' }} <br>
        MESA: {{ $order->table_id ?? 'N/A' }} <br>
        FECHA: {{ $order->created_at ? $order->created_at->format('d/m/Y H:i') : '' }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cant</th>
                <th>Vlr</th>
                <th>Sub</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $item)
                <tr>
                    <td>
                        {{ $item->name }} 
                        @if($item->description) ({{ $item->description }}) @endif
                        @if($item->status === 'Cancelada')
                            <br><span class="cancelada">❌ Cancelada</span>
                        @endif
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price,0,',','.') }}</td>
                    <td>${{ number_format($item->subtotal,0,',','.') }}</td>
                </tr>
                @php 
                    if($item->status !== 'Cancelada') {
                        $total += $item->subtotal; 
                    }
                @endphp
            @endforeach
        </tbody>
    </table>

    <div class="total">
        TOTAL: ${{ number_format($total, 0, ',', '.') }}
    </div>

    <div class="footer">
        GRACIAS POR SU COMPRA <br>
        Documento generado el {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>
