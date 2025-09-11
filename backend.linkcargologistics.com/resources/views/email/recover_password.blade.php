<!DOCTYPE html>
<html>

<head>
  <title>Bienvenido a [Nombre de tu aplicación]</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
    }

    .header img ,img.header {
      max-width: 200px;
      height: auto;
      display: block;
      margin-bottom: 10px;
    }

    .content {
      line-height: 1.5;
    }

    .content p {
      margin-bottom: 15px;
    }

    .content a {
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4527A0;  /* Base color */
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }

    .button:hover {
      background-color: #381F8A;  /* Darker shade of #4527A0 for hover */
    }

  </style>
</head>

<body>
  <div class="container">
    <header>      
      <img class="header" src="{{ env('LOGO_URL') }}" alt="{{ env('APP_NAME') }}" />      
    </header>
    <div class="content">
      <h3>{{ $subject }}</h3>
      <p>Hola, {{ $user }} solicitaste recuperar tu contraseña con tu correo electrónico de tu tienda <b>{{ env('APP_NAME') }}</b>.</p>      
      <p>Para confirmar la recuperación haz clic en el siguiente botón</p>
      <a href="{{ $verification_link }}">
        <button class="button">Recuperar tu contraseña</button>
      </a>
    </div>
  </div>
</body>

</html>
