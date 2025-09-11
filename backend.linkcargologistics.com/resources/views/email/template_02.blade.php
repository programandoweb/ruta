<!DOCTYPE html>
<html>
<head>
    <title>Correo de Confirmación</title>
</head>
<body>
    <h2>Correo de Confirmación</h2>
    <p>Documento de identidad: {{ $data['documento_representante_legal'] }}</p>
    <p>Nombre: {{ $data['name'] }}</p>
    <p>Apellido: {{ $data['surname'] }}</p>
    <p>Celular: {{ $data['celular'] }}</p>
    <p>Correo electrónico: {{ $data['email'] }}</p>    
    <p>Código de confirmación: {{ $data['register_code'] }}</p>
</body>
</html>
