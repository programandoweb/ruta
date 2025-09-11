<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orden de Salida Tours</title>
    <style>
        body {
            font-size: 12px;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 10px;
        }
        .header img {
            width: 100px;
        }
        .content {
            margin-top: 20px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .border-bottom {
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .border{
            border-style:dotted;
            padding: 20px;            
        }
        .red {
            color: red;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 16px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            border: 1px solid #000;
            padding: 5px;
            font-size: 12px;
        }
        .form-group .inline {
            display: inline-block;
            width: 48%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content border">
            <table width="100%" style="border:0">
                <tr>
                    <td>
                        <div class="header">                        
                            <img src="https://ivoolve-tours.programandoweb.net/images/empresa-programandoweb-logo.png" alt="Logo">                            
                            <div ><span class="red">Nº {{$data->id}}</span></div>
                        </div>
                    </td>
                    <td width="55%">
                        <table width="100%" style="border:0">
                            <tr>
                                <td width="60%">
                                    <label for="prestario">Prestario</label>                
                                    <div><b>{{$data->Prestatario}}</b></div>
                                </td>
                                <td >
                                    <label for="prestario">Placa</label>    
                                    <div><b>{{$data->Placa}}</b></div>            
                                </td>                                
                            </tr>
                            <tr>
                                <td >
                                    <label for="prestario">Circuito</label>                
                                    <div><b>{{$data->Tour}}</b></div>
                                </td>
                                <td >
                                    <label for="prestario">Gasolina</label>    
                                    <div><b>{{$data->quantity}}</b></div>            
                                </td>                                
                            </tr>                            
                        </table>
                    </td>
                    <td width="22%">
                        <div class="footer">
                            <p>Sello Autorización</p>
                            <p><b>Fabiola Mitru / Representante Legal</b></p>
                        </div>
                    </td>
                </tr>
            </table>            
        </div>                
    </div>
</body>
</html>
