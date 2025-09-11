<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Detalle de Ítems - Orden #{{ $order->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header img {
            max-height: 80px;
            margin-bottom: 5px;
        }
        .enterprise {
            font-size: 11px;
            color: #555;
        }
        .order-info {
            margin-bottom: 20px;
        }
        .order-info h2 {
            margin: 0;
            font-size: 16px;
        }
        .order-info p {
            margin: 2px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table, th, td {
            border: 1px solid #bbb;
        }
        th, td {
            padding: 6px;
            text-align: left;
        }
        th {
            background: #f2f2f2;
        }
        .total {
            text-align: right;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        @if($logoBase64)
            <img src="data:image/png;base64,{{ $logoBase64 }}" alt="Logo">
        @endif
        <h1>Detalle de Ítems</h1>
        <div class="enterprise">
            @if(isset($order->enterprise) && is_array($order->enterprise))
                @foreach($order->enterprise as $key => $value)
                    <p><strong>{{ $key }}:</strong> {{ $value }}</p>
                @endforeach
            @endif
        </div>
    </div>

    <div class="order-info">
        <h2>Orden #{{ $order->id }}</h2>
        <p><strong>Cliente:</strong> {{ $order->customer_name ?? 'N/A' }}</p>
        <p><strong>Mesa:</strong> {{ $order->table_id ?? 'N/A' }}</p>
        <p><strong>Fecha:</strong> {{ $order->created_at ? $order->created_at->format('d/m/Y H:i') : '' }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @php $total = 0; @endphp
            @foreach($items as $item)
                <tr>
                    <td>{{ $item->name }} @if($item->description) ({{ $item->description }}) @endif</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price, 2, ',', '.') }}</td>
                    <td>${{ number_format($item->subtotal, 2, ',', '.') }}</td>
                    <td>{{ $item->status }}</td>
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
        Total a pagar: ${{ number_format($total, 2, ',', '.') }}
    </div>

    <div class="footer">
        <p>Documento generado automáticamente - {{ date('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
