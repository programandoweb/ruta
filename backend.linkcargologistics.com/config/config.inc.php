<?php
/*
 * This is needed for cookie based authentication to encrypt password in
 * cookie
 */
$cfg['blowfish_secret'] = 'xampp'; /* YOU SHOULD CHANGE THIS FOR A MORE SECURE COOKIE AUTH! */

/*
 * Servers configuration
 */
$i = 0;

/*
 * First server
 */
$i++;

/* Authentication type and info */
$cfg['Servers'][$i]['auth_type'] = 'cookie'; // Cambiado a "cookie" para solicitar contraseña
$cfg['Servers'][$i]['user'] = ''; // Usuario vacío para forzar la autenticación manual
$cfg['Servers'][$i]['password'] = ''; // Contraseña vacía para forzar la autenticación manual
$cfg['Servers'][$i]['extension'] = 'mysqli';
$cfg['Servers'][$i]['AllowNoPassword'] = false; // No permite conexiones sin contraseña
$cfg['Lang'] = '';

/* Host remoto */
$cfg['Servers'][$i]['host'] = 'us-east4-001.proxy.kinsta.app'; // Host proporcionado
$cfg['Servers'][$i]['port'] = 30492; // Puerto proporcionado
$cfg['Servers'][$i]['connect_type'] = 'tcp'; // Tipo de conexión

/* User for advanced features */
$cfg['Servers'][$i]['controluser'] = ''; // Opcional: usuario para funciones avanzadas
$cfg['Servers'][$i]['controlpass'] = ''; // Contraseña opcional para controluser

/* Advanced phpMyAdmin features */
$cfg['Servers'][$i]['pmadb'] = ''; // Dejar en blanco si no se necesita
$cfg['Servers'][$i]['bookmarktable'] = '';
$cfg['Servers'][$i]['relation'] = '';
$cfg['Servers'][$i]['table_info'] = '';
$cfg['Servers'][$i]['table_coords'] = '';
$cfg['Servers'][$i]['pdf_pages'] = '';
$cfg['Servers'][$i]['column_info'] = '';
$cfg['Servers'][$i]['history'] = '';
$cfg['Servers'][$i]['designer_coords'] = '';
$cfg['Servers'][$i]['tracking'] = '';
$cfg['Servers'][$i]['userconfig'] = '';
$cfg['Servers'][$i]['recent'] = '';
$cfg['Servers'][$i]['table_uiprefs'] = '';
$cfg['Servers'][$i]['users'] = '';
$cfg['Servers'][$i]['usergroups'] = '';
$cfg['Servers'][$i]['navigationhiding'] = '';
$cfg['Servers'][$i]['savedsearches'] = '';
$cfg['Servers'][$i]['central_columns'] = '';
$cfg['Servers'][$i]['designer_settings'] = '';
$cfg['Servers'][$i]['export_templates'] = '';
$cfg['Servers'][$i]['favorite'] = '';

/*
 * End of servers configuration
 */

?>
