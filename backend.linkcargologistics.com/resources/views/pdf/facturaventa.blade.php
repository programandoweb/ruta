{{$total=0}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura Fiscal</title>
    <style>
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        body {
            font-size: 10px;
            text-transform: uppercase;
            font-family: Arial, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        .content {
            margin: 0;
        }
        .footer {
            text-align: center;
            margin-top:;
        }
        table {
            width: 100%;            
            margin-top: 10px;
            border: none;
        }
        th, td {
            padding: 3px;
            text-align: left;
            border: none;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="header">
        <center>
            <img width="40%" src="images/default/logo.png" alt="Programandoweb"/>            
        </center>
        <div style="margin: 20px 0">
            <div style="">Restaurante Ejemplo</div>
            <div>Dirección del Restaurante</div>
            <div>Tel: 123-456-789</div>
        </div>        
    </div>
    
    <div class="content">
        <div><strong>Orden #:</strong> {{ $orderItems->order_number }}</div>
        <div><strong>Mesa:</strong> {{ $orderItems->Mesa }}</div>
        <div><strong>Fecha:</strong> {{ now()->format('d/m/Y H:i') }}</div>
        
        <table>
            <tbody>
                <tr>
                    <th>Producto</th>
                    <th class="text-right">Total</th>
                </tr>
                @foreach($orderItems->items as $item)
                    {
                        {{$total+=$item->product->price*$item->quantity}}
                    }
                    <tr>
                        <td>{{ $item->product->name }}({{ $item->quantity }})</td>
                        <td class="text-right">
                            <b>
                                {{ number_format($item->product->price*$item->quantity, 2) }}
                            </b>
                        </td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td class="text-right">
                        Antes de impuesto:
                    </td>
                    <td class="text-right">
                        <strong>{{ number_format($total-(env("APP_IVA")/100)*$total, 2) }}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="text-right">
                        IVA:
                    </td>
                    <td class="text-right">
                        <strong>{{ number_format((env("APP_IVA")/100)*$total, 2) }}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="text-right">
                        Monto Total:
                    </td>
                    <td class="text-right">
                        <strong>{{ number_format($total, 2) }}</strong>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
    
    <div class="footer">
        <p><b>Gracias por su visita!</b><br/><b>Vuelva pronto</b></p>
    </div>
</body>
</html>
