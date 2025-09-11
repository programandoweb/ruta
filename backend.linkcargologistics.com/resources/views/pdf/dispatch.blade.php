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
            margin: 0 0px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
        }
        table.main {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.main th, 
        table.main td {
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
        .w-100{
            width: 100%;            
        }
        .w-50{
            width: 50%;
        }
        .border-none{
            border:none;
        }
        .title{
            font-size:40px;
        }
        .subtitle{
            font-size:20px;
        }
        .p-2{
            padding: 20px;
        }
        .red{
            color:red;
        }
        .text-right{
            text-align:right;
        }
    </style>
</head>
<body>
    <div>
        <table class="w-100 border-none">
            <tr class="border-none">
                <td>
                    <img width="150" src="https://ivoolve-tours.programandoweb.net/images/empresa-programandoweb-logo.png" alt="Programandoweb"/>            
                </td>
                <td>
                    <div>
                        Av. Chicahas N° 187
                    </div>
                    <div>
                        Telf.: 00591-2-6943001 -6943003
                    </div>
                    <div>
                        Fax: 00591-2-6944816
                    </div>
                    <div>
                        Email: tpztours@entelnet.bo
                    </div>
                    <div>
                        Web: tupizatours.com
                    </div>
                    <div>
                        Tupiza - Bolivia
                    </div>
                </td>
                <td class="w-50">
                    <div class="title">
                        Hoja de Salida
                    </div>
                </td>
                <td>
                    <div class="subtitle red">
                        N° {{$id}}
                    </div>
                </td>
            </tr>
        </table>
        <div class="text-right">
            Tupiza,________ de _____________________________ de 20__
        </div>
    </div>
    <div class="content">
        <table class="main">
            <thead>
                <tr>
                    <th>Nº</th>
                    <th>NOMBRE COMPLETO</th>
                    <th>PASAPORTE</th>
                    <th>NACIONALIDAD</th>
                    <th>ALERGIAS</th>
                    <th>ALIMENTACIÓN</th>
                    <th>TICKETS</th>
                    <th>HOTEL</th>
                    <th>SERVICIOS</th>
                    <th>ALQUILERES</th>
                    <th>OBSERVACIONES</th>
                </tr>
            </thead>
            <tbody>
                @if (!empty($tourists))
                    @foreach ($tourists as $key => $row)
                        <tr>
                            <td>{{ $row["id"] }}</td>
                            <td>{{ $row["name"] }}</td>
                            <td>{{ $row["identification"] }}</td>
                            <td>{{ $row["nationality"] }}</td>
                            <td>{{ $row["allergis"] }}</td>
                            <td>{{ $row["food"] }}</td>
                            <td>{{ $row["tickets"] }}</td>
                            <td>{{ $row["hotels"] }}</td>
                            <td>{{ $row["services"] }}</td>
                            <td>{{ $row["accessories"] }}</td>
                            <td>{{ $row["extra"] }}</td>                    
                        </tr>    
                    @endforeach
                @endif                
            </tbody>
        </table>
        <div class="p-2 w-100">

        </div>
        <table class="w-100">
            <tbody>
                <tr>
                    <td >VEHÍCULO: <b>{{ $vehicle }}</b></td>
                    <td >PLACA: <b>{{ $plate }}</b></td>
                    <td >COLOR: <b>{{ $color }}</b></td>                    
                </tr>
                <tr>
                    <td >BICICLETA: <b>{{ $cycle }}</b></td>
                    <td >CABALLO: <b>{{ $horse }}</b></td>
                    <td >SEVICIOS: <b>{{ $services_none }}</b></td>                    
                </tr>
                <tr>
                    <td >PROPIETARIO: <b>{{$driver}}</b></td>
                    <td colspan="2">BREVET N° <b>{{$driving_license}}</b></td>                    
                </tr>
                <tr>
                    <td >CONDUCTOR:</td>
                    <td colspan="2">BREVET N° <b>{{$driving_license}}</b></td>                    
                </tr>
                <tr>
                    <td >GUIA:</td>
                    <td >COCINERA: <b> {{$cooks}} </b></td>
                </tr>
                <tr>
                    <td >OBSERVACIONES:</td>
                    <td> <b> {{$extra}} </b> </td>
                </tr>
            </tbody>
        </table>
        
    </div>    
</body>
</html>
