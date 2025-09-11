<!-- resources/views/sale_pdf.blade.php -->

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo de Venta</title>
    <style>
        /* Incluir la fuente Poppins */
        @font-face {
            font-family: 'Poppins';
            src: url("{{ public_path('fonts/Poppins-Regular.ttf') }}") format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Poppins';
            src: url("{{ public_path('fonts/Poppins-Bold.ttf') }}") format('truetype');
            font-weight: bold;
            font-style: normal;
        }

        /* Usar la fuente en el documento */
        body { font-family: 'Poppins', Arial, sans-serif; font-size: 12px; color: #333; }
        .container { width: 90%; margin: 0 auto; }
        .header, .footer { text-align: center; margin-bottom: 20px; }
        .header h2 { margin: 0; font-size: 18px; }
        .header p { margin: 0; font-size: 9px; }
        
        .receipt-info { display: flex; justify-content: space-between; margin-top: 10px; }
        .left-info, .right-info { width: 48%; }
        .right-info { text-align: right; }
        .section-title { font-weight: bold; text-decoration: underline; }

        .customer-info, .details-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .customer-info td, .details-table td, .details-table th { padding: 5px; border: 1px solid #ddd; }
        .customer-info td { border: none; }

        .details-table th { background-color: #f2f2f2; text-align: left; }
        .totals { text-align: right; padding-right: 20px; font-weight: bold; }

        .observations, .value-text { margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Encabezado -->
        <div class="header">
            @if(!empty($logoBase64))
                <img height="50" src="{{ $logoBase64 }}" alt="Logo de la empresa"/>
            @else
                <h2>{{ $order->enterprise['Empresa'] ?? 'Programandoweb' }}</h2>
            @endif            
            <p>NIT: {{ $order->enterprise['Nit'] ?? '3115000926' }}</p>
            <p>{{ $order->enterprise['Dirección'] ?? 'Av Carlos Sanda - El Viñedo' }}</p>
            <p>{{ $order->enterprise['Ciudad'] . '- COLOMBIA' ?? 'Valencia - Venezuela' }} </p>
        </div>
        
        <div class="receipt-info">
            <div class="left-info">
                <p class="section-title">Pedido Cliente</p>
                <div><b>Orden ID</b> {{ $order->order_number }}</div>                
            </div>
            <div>
                <div><strong>Fecha de Orden:</strong> {{ \Carbon\Carbon::parse($order->created_at)->format('Y-m-d') }}</div>
            </div>
        </div>

        <!-- Información del cliente -->
        <table class="customer-info">
            <tr>
                <td><strong>Cliente:</strong> {{ $order->client['name'] }}</td>
                <td><strong>Teléfono:</strong> {{ $order->client['phone_number'] }}</td>
                <td><strong>Email:</strong> {{ $order->client['email'] }}</td>                
            </tr>
            <tr>
                <td><strong>Dirección:</strong> {{ $order->client['address'] ?? 'N/A' }}</td>
                <td><strong>Ciudad:</strong> {{ $order->client['city'] ?? 'N/A' }}</td>
                <td><strong>País:</strong> {{ $order->client['country'] ?? 'N/A' }}</td>
            </tr>
        </table>

        <!-- Detalle de los productos de la orden -->
        <table class="details-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Variante</th>
                    <th>Cantidad</th>
                    <th>Monto</th>                    
                </tr>
            </thead>
            <tbody>
                @php
                    $totalAmount = 0;
                @endphp
                @foreach ($order->items as $item)
                    <tr>
                        <td>{{ $item->product['name'] }}</td>
                        <td>{{ $item->variant_name }}</td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right;">${{ number_format($item->amount, 2) }}</td>                        
                    </tr>
                    @php
                        $totalAmount += $item->amount;
                    @endphp
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="totals">Total de la Orden</td>
                    <td colspan="1" style="text-align: right;">${{ number_format($totalAmount, 2) }}</td>
                </tr>
            </tfoot>
        </table>

        <div class="observations">
            <p><strong>OBSERVACIONES:</strong> {{ $order->observations ?? 'Sin observaciones adicionales' }}</p>
        </div>
    </div>
</body>
</html>
