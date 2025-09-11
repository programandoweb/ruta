<!DOCTYPE html>
<html>
<head>
  <!-- HTML Codes by Quackit.com -->
  <meta charset="UTF-8">
  <title>Programandoweb | Soporte técnico 3115000926 | Colombia - Venezuela</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gasoek+One&family=Oswald:wght@400;600&family=Roboto:wght@100&display=swap" rel="stylesheet">

  <style>
    html, body {
      margin: 0;
      height: 100%;
      font-family: 'Roboto', sans-serif;
    }
    h1{
      font-family: 'Oswald', sans-serif;
      margin: 0;
    }
    h3{
      font-family: 'Roboto', sans-serif;
      margin: 0;
      font-size: 16px;
      margin-bottom: 6px;
    }
    h5{
      font-family: 'Roboto', sans-serif;
      margin: 0;
    }
    h6{
      font-family: 'Roboto', sans-serif;
      margin: 0;
    }
    body {
      /* Ubicación de la imagen */
      background-image: url(index_programandoweb.png);

      /* Para dejar la imagen de fondo centrada, vertical y horizontalmente */
      background-position: center center;

      /* Para que la imagen de fondo no se repita */
      background-repeat: no-repeat;

      /* La imagen se fija en la ventana de visualización para que la altura de la imagen no supere a la del contenido */
      background-attachment: fixed;

      /* La imagen de fondo se reescala automáticamente con el cambio del ancho de ventana del navegador */
      background-size: cover;

      /* Se muestra un color de fondo mientras se está cargando la imagen de fondo o si hay problemas para cargarla */
      background-color: #66999;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100vh;
      background: url(./background.svg) center/cover no-repeat;
    }

    .content {
      text-align: center;
      width: 80%;
      max-width: 400px;
      padding: 20px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>Por favor espere...</h1>  
      <form id="wompi-payment-form" action="https://checkout.wompi.co/p/" method="GET" style="opacity:0">
            <input type="hidden" name="public-key" value="{!! $publicKey !!}" />
            <input type="hidden" name="currency" value="{!! $currency !!}" />
            <input type="hidden" name="amount-in-cents" value="{!! convertirMontoACentavos($amount) !!}" />
            <input type="hidden" name="reference" value="{!! $wompi_id !!}" />
            <input type="hidden" name="signature:integrity" value="{!! $signatureIntegrity !!}" />
            <input type="hidden" name="redirect-url" value="{!! $redirect !!}" />
            <button type="submit">Pagar con Wompi</button>
        </form>    
    </div>
  </div>

  <script>
    window.onload = function() {
      document.getElementById('wompi-payment-form').submit();
    };
  </script>
</body>
</html>
