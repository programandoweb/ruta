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
                <h2>{{ $sale->enterprise['Empresa'] ?? 'Programandoweb' }}</h2>
            @endif            
            <p>NIT: {{ $sale->enterprise['Nit'] ?? '3115000926' }}</p>
            <p>{{ $sale->enterprise['Dirección'] ?? 'Av Carlos Sanda - El Viñedo' }}</p>
            <p>{{ $sale->enterprise['Ciudad'] . '- COLOMBIA'?? 'Valencia - Venezuela' }} </p>
        </div>
        
        
        

        <div class="receipt-info">
            <div class="left-info">
                <p class="section-title">RECIBO DE CAJA</p>
                <div>Ref - {{ $sale->reference_no }}</div>                
            </div>
            <div >
                <div><strong>Fecha Comprobante:</strong> {{ $sale->created_at->format('Y-m-d') }}</div>
            </div>
        </div>

        <!-- Información del cliente -->
        <table class="customer-info">
            <tr>
                <td><strong>Señores:</strong> {{ $sale->customer->name }}</td>
                <td><strong>Teléfono:</strong> {{ $sale->customer->phone_number }}</td>
                <td><strong>NIT:</strong> {{ $sale->customer->identification_number }}</td>                
            </tr>
            <tr>
                <td><strong>Dirección:</strong> {{ $sale->customer->address }}</td>
                <td><strong>Ciudad:</strong> {{ $sale->customer->city }}</td>
                <td><strong>País:</strong> {{ $sale->customer->country }}</td>
            </tr>
        </table>

        <!-- Detalle de la venta -->
        <table class="details-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>
                        <div style="text-align: center">
                            Cantidad
                        </div>
                    </th>
                    <th>
                        <div style="text-align: center">
                            Precio U
                        </div>
                    </th>
                    <th>
                        <div style="text-align: center">
                            Valor
                        </div>    
                    </th>
                </tr>
            </thead>
            <tbody>
                @php
                    $totalItems = 0;
                @endphp
                @foreach ($sale->items as $item)
                    <tr>
                        <td>{{ $item->product->name ?? 'N/A' }}</td>
                        <td>
                            <div style="text-align: center">
                                {{ $item->quantity }}
                            </div>
                        </td>
                        <td>
                            <div style="text-align: right">
                                ${{ number_format($item->total / $item->quantity, 2) }}
                            </div>
                        </td>
                        <td>
                            <div style="text-align: right">
                                ${{ number_format($item->total, 2) }}
                            </div>
                        </td>
                    </tr>
                    @php
                        $totalItems += $item->total;
                    @endphp
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="totals">Subtotal</td>
                    <td>
                        <div style="text-align: right">
                            ${{ number_format($totalItems, 2) }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="totals">Descuento</td>
                    <td>
                        <div style="text-align: right">
                            ${{ number_format( $sale->total_discount, 2) }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="totals">Transporte</td>
                    <td>
                        <div style="text-align: right">
                            ${{ number_format( $sale->shipping_cost??0, 2) }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="totals">Total a pagar</td>
                    <td>
                        <div style="text-align: right">
                            ${{ number_format($totalItems - $sale->total_discount + ($sale->shipping_cost??0), 2) }}
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>

        <div class="observations">
            <p><strong>OBSERVACIONES:</strong> {{ $sale->sale_note }}</p>
        </div>
    </div>
</body>
</html>
