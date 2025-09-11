<!DOCTYPE html>
<html>

<head>
    <style>
        /* Aquí va el estilo CSS */
        .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .btn-primary {
            color: #fff;
            background-color: #28a745; /* Cambia el color del botón a verde */
            border-color: #28a745; /* Cambia el color del borde del botón a verde */
        }

        .btn-primary:hover {
            color: #fff;
            background-color: #218838; /* Cambia el color de hover a un tono más oscuro de verde */
            border-color: #1e7e34; /* Cambia el color del borde en hover */
        }

        .btn-primary:focus,
        .btn-primary.focus {
            color: #fff;
            background-color: #218838; /* Cambia el color de foco a un tono más oscuro de verde */
            border-color: #1e7e34; /* Cambia el color del borde en foco */
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5); /* Cambia el color de la sombra en foco */
        }

        .btn-primary.disabled,
        .btn-primary:disabled {
            color: #fff;
            background-color: #28a745; /* Cambia el color del botón deshabilitado a verde */
            border-color: #28a745; /* Cambia el color del borde del botón deshabilitado a verde */
            opacity: 0.65;
        }

        .btn-primary:not(:disabled):not(.disabled):active,
        .btn-primary:not(:disabled):not(.disabled).active,
        .show>.btn-primary.dropdown-toggle {
            color: #fff;
            background-color: #1e7e34; /* Cambia el color del botón activo a un tono más oscuro de verde */
            border-color: #1c7430; /* Cambia el color del borde del botón activo */
        }

        .card {
            max-width: 600px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
            font-family: Arial, sans-serif;
        }

        /* Estilo del título del card */
        .card-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        /* Estilo del contenido del card */
        .card-content {
            font-size: 16px;
            line-height: 1.5;
        }

        /* Estilo del enlace dentro del card */
        .card-link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }

        /* Estilo del botón dentro del card */
        .card-button,
        .card-button:link,
        .card-button:visited,
        .card-button:focus {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
        }

        .card-button:hover {
            background-color: #007bff;
        }
    </style>
    <title>COTIZACIÓN</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>

<body>
    <div class="card">
        <img style="max-width: 100%; height: auto;" src="{{ $variables['banner'] }}" alt="" />
        <p class="card-content">
            Hola, <br>
            {!! $variables['message'] !!}
        </p>        
    </div>
</body>

</html>
