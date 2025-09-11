<!DOCTYPE html> 
<html>

<head>
  <title>Confirmación de registro</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      max-width: 600px;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .header {
      margin-bottom: 20px;
    }

    .header img,
    img.header {
      max-width: 200px;
      height: auto;
      display: block;
      margin: 0 auto;
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
      background-color: #4527A0; /* Base color */
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }

    .button:hover {
      background-color: #381F8A; /* Darker shade of #4527A0 for hover */
    }

    .confirmation-code {
      font-size: 60px;
      font-weight: bold;
      color: #4527A0;
      margin: 20px 0;
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
      <p>Hola, {{ $user }}:</p>
      <p>Gracias por registrarte en <b>{{ env('APP_NAME') }}</b>. Tu código de confirmación es:</p>
      <div class="confirmation-code">
        {{ $confirmation_code }}
      </div>
      <p>Por favor, introduce este código en la aplicación para confirmar tu registro.</p>
      <p>Si tienes algún problema, no dudes en contactarnos.</p>
    </div>
  </div>
</body>

</html>
