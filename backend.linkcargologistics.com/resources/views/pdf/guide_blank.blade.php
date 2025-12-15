<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Guía</title>
    <style>
        /* Mini-Tailwind para PDF */
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
        }
        .page {
            padding: 10px 18px;
            height: 70%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .flex         { display:flex; }
        .items-center { align-items:center; }
        .justify-between { justify-content:space-between; }
        .justify-end  { justify-content:flex-end; }
        .text-right   { text-align:right; }
        .text-center  { text-align:center; }
        .font-bold    { font-weight:bold; }
        .text-xs      { font-size:9px; }
        .text-sm      { font-size:10px; }
        .text-base    { font-size:11px; }
        .mt-1 { margin-top:2px; }
        .mt-2 { margin-top:4px; }
        .mt-3 { margin-top:6px; }
        .mt-4 { margin-top:8px; }
        .border      { border:1px solid #000; }
        .rounded     { border-radius:4px; }
        .px-2 { padding-left:6px; padding-right:6px; }
        .py-1 { padding-top:3px; padding-bottom:3px; }
        .w-full { width:100%; }
        .gap-1 { gap:4px; }
        .gap-2 { gap:8px; }

        .code {
            font-size: 16px;
            letter-spacing: 2px;
        }
        .barcode {
            width: 40%;
        }
        .qr {
            width: 60%;
            height: auto;
        }
        .section {
            border:1px solid #000;
            padding:6px 8px;
            margin-top:4px;
        }
        .label {
            font-size:9px;
            font-weight:bold;
        }
        .value {
            font-size:9px;
        }
        .uppercase { text-transform:uppercase; }
    </style>
</head>
<body>
@php
    /** @var \App\Models\Package $package */
    $package   = $data ?? ($params['datos'] ?? null);
    $total     = $params['totalizar'] ?? null;
    $detalles  = $params['detalles'] ?? '';
    $logo      = $params['logo'] ?? null;
    $qr        = $params['qr'] ?? null;
    $barcode   = $params['barcode'] ?? null;
@endphp

<div class="page">
   {{-- HEADER --}}
    <table class="w-full header-table">
        <tr>
            {{-- Logo + datos remitente --}}
            <td class="align-top">
                <table>
                    <tr>
                        <td class="align-top" style="padding-right:8px;">
                            @if($logo)
                                <img src="{{ $logo }}" alt="Logo" style="height:28px;">
                            @endif
                        </td>
                        <td class="align-top text-xs">
                            
                        </td>
                    </tr>
                </table>
            </td>            
        </tr>
    </table>


    {{-- INFO PRINCIPAL --}}
    <div class="mt-40 flex justify-between gap-2">
        <table style="width:100%; margin-top:10px; ">
            {{-- REMITENTE --}}
            <tr>
                <td>
                    <table  style="width:100%; font-size:9px;">
                        <tr style="font-size:9px;">
                            <td class="label" style="font-size:9px;">DESTINATARIO</td>
                        </tr>
                        <tr>
                            <td class="value uppercase" style="font-size:9px;">
                                {{ $package->name_receives ?? '' }}
                            </td>
                        </tr>
                        <tr>
                            <td class="value" style="font-size:9px;">
                                {{ $package->street ?? '' }}
                                @if($package->cologne), {{ $package->cologne }}@endif
                                @if($package->postcard), {{ $package->postcard }}@endif
                            </td>
                        </tr>
                        <tr>
                            <td class="value" style="font-size:9px;">
                                {{ $package->city ?? '' }},
                                {{ $package->state ?? '' }},
                                MÉXICO
                            </td>
                        </tr>
                        <tr>
                            <td class="value" style="font-size:9px;">
                                TEL: {{ $package->phone_receives ?? '' }}
                            </td>
                        </tr>
                        <tr>
                            <td class="value" style="font-size:9px;">
                                C.P: {{ $package->postcard ?? '' }}
                            </td>
                        </tr>
                    </table>   
                    <div style="margin-top:30px">
                        @if($barcode)
                            <img src="{{ $barcode }}" class="barcode" alt="BARCODE">
                        @endif
                    </div>                 
                </td>
                <td width="150">
                    <div class="flex justify-between items-center mt-3">
                        <div class="code font-bold">
                            {{ $package->guideNumber ?? '' }}
                        </div>
                        @if($qr)
                            <img src="{{ $qr }}" class="qr" alt="QR">
                        @endif                        
                    </div>
                    
                </td>
            </tr>
        </table>
       
    </div>      
    
    
</div>
</body>
</html>
