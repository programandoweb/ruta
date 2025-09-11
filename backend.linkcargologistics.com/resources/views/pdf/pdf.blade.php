{{  $total_pagado=0; }}
{{  $total_services_ext=0; }}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Report</title>
    <style>
        .dark{
            background:#333;
            color:white;            
        }
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
            margin: 0 50px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .grid {
            display: grid;
            gap: 1rem;
        }
        .grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
        }
        .md\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        .col-span-2 {
            grid-column: span 2 / span 2;
        }
        .text-3xl {
            font-size: 1.875rem; /* Equivalent to 3xl */
        }
        .text-lg {
            font-size: 1.125rem; /* Equivalent to lg */
        }
        .text-navy-700 {
            color: #3b5998; /* Adjust as needed */
        }
        .text-base {
            font-size: 1rem; /* Equivalent to base */
        }
        .font-bold {
            font-weight: bold;
        }
        .mt-2 {
            margin-top: 2.5rem;
        }
        .rounded-xl {
            border-radius: 1rem;
        }
        .bg-white {
            background-color: #ffffff;
        }
        .bg-brand-500 {
            background-color: #007bff; /* Adjust as needed */
        }
        .hover\:bg-brand-600:hover {
            background-color: #0056b3; /* Adjust as needed */
        }
        .active\:bg-brand-700:active {
            background-color: #004085; /* Adjust as needed */
        }
        .dark\:bg-brand-400 {
            background-color: #375a7f; /* Adjust as needed */
        }
        .dark\:text-white {
            color: #ffffff;
        }
        .dark\:hover\:bg-brand-300:hover {
            background-color: #4e73df; /* Adjust as needed */
        }
        .dark\:active\:bg-brand-200:active {
            background-color: #6c757d; /* Adjust as needed */
        }
    </style>
</head>
<body>
    <div>
        <center>
            <img width="20%" src="https://ivoolve-tours.programandoweb.net/images/empresa-programandoweb-logo.png" alt="Programandoweb"/>
        </center>
    </div>
    <div class="content">
        <h3>Confiramción de su reserva #{{ $slug }}</h3>
        <p>Información del tour <b>{{ $tour["title"] }}</b> / <b>{{ $date }}</b></p>                
        <p>Precio del tour Bs.<b>{{ $price }}</b></p>
        <p>
            Turista <b>{{ $data->first_name_1 }} {{ $data->first_name_2 }}</b> Email <b>{{ $data->email }}</b>
        </p>
        <p>
            Nacionalidad <b>{{ @$data->nationality }} </b> Identificación <b>{{ @$data->id_number_1 }}</b>
        </p>
        <p>
            Celular <b>{{ @$data->celular }} </b> Alimentación <b>{{ @$data->tipo_alimentacion }}</b>
        </p>
        <p>
            Alergias
        </p>
        
        @if (!empty($services_ext))
            @foreach ($services_ext as $key => $serv)
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>{{$key}}</th>
                                <th width="70"> <div class="text-center"></div></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($serv as $key2 => $text)
                                <tr>
                                    <td>{{ $text["label"] }}</td>
                                    <td width="70" ><div class="text-right"> <b>{{ format_php($text["value"]) }}</b> </div></td>
                                    {{ $total_services_ext   +=   $text["value"] }}
                                </tr>
                            @endforeach
                        </tbody>
                    </table>    
                </div>
            @endforeach
        @endif
        <div>
            <div>                
                <table>
                    <thead>
                        <tr>
                            <th>Fecha de pago</th>
                            <th>Método</th>
                            <th> <div class="text-center">Monto</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($order->paids as $key => $serv)  
                            {{$total_pagado += $serv["amount"];}}
                            <tr>
                                <td>{{ format($serv->created_at) }}</td>
                                <td>{{ $serv["method"] }}</td>
                                <td width="70" ><div class="text-right"> <b>{{ format_php($serv["amount"]) }}</b> </div></td>                                
                            </tr>
                        @endforeach                        
                    </tbody>
                </table>    
            </div>            

        </div>
        <div>
            <div>                
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th> <div class="text-center">Monto</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-right">
                                Monto total tour
                            </td>
                            <td width="70" >
                                <div class="text-right"> <b>{{format_php($total)}}</b> </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-right">
                                Monto restante
                            </td>
                            <td width="70" >
                                <div class="text-right"> <b>{{format_php(($total+$total_services_ext)-$total_pagado)}}</b> </div>
                                
                            </td>
                        </tr>
                        <tr class="dark">
                            <td class="text-right">
                                Total pagado
                            </td>
                            <td width="70" >
                                <div class="text-right"> <b>{{ format_php($total_pagado) }}</b> </div>
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </div>            

        </div>
        
    </div>    
</body>
</html>
