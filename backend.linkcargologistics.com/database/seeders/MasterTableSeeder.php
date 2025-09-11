<?php
/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class MasterTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $profesiones = array(
            [
                'label' => 'Ubicación',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Ubicación en Mapa', 'grupo' => 'features', "description" => "googlemap"],
                    ['label' => 'Dirección', 'grupo' => 'features', "description" => "text"],
                    //['label' => 'Departamento', 'grupo' => 'features', "description" => "select", "options" => "demographic_departments"],
                    //['label' => 'Ciudad', 'grupo' => 'features', "description" => "dynamic_dropdown", "options" => "demographic_cities"],                    
                    //['label' => 'Barrio', 'grupo' => 'features', "description" => "dynamic_dropdown", "options" => "demographic_warrior"],
                    //['label' => 'Ciudad', 'grupo' => 'features', "description" => "select", "options" => "demographic_cities"],                    
                ]
            ],
            /*
            [
                'label' => 'Datos Principales',
                'grupo' => 'group_features',
                'items' => [
                    //['label' => 'Tipo de Inmueble', 'grupo' => 'features', "description" => "select", "options" => "property"],
                    //['label' => 'Última Actualización', 'grupo' => 'features', "description" => "input_data", "options" => "updated_at"],
                    //['label' => 'Operación', 'grupo' => 'features', "description" => "multi-select-2", "options" => "type_of_operation"],
                    ['label' => 'Dirección', 'grupo' => 'features', "description" => "text"],                    
                ]
            ],
            */
            [
                'label' => 'Ficha',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Garajes', 'grupo' => 'features', "description" => "select", "options" => "count"],
                    ['label' => 'Cocheras', 'grupo' => 'features', "description" => "select", "options" => "count"],
                    ['label' => 'Dormitorios', 'grupo' => 'features', "description" => "select", "options" => "count_bedrooms"],
                    ['label' => 'Dormitorios en suite', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Dormitorio de Servicio', 'grupo' => 'features', "description" => "boolean", "options" => "count"],
                    ['label' => 'Baños', 'grupo' => 'features', "description" => "select", "options" => "count"],
                    ['label' => 'Baño Social', 'grupo' => 'features', "description" => "boolean", "options" => "count"],
                    ['label' => 'Baño de Servicio', 'grupo' => 'features', "description" => "boolean", "options" => "count"],
                    ['label' => 'Piscina', 'grupo' => 'features', "description" => "boolean", "options" => "count"],
                    ['label' => 'Año de Construcción', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Condición', 'grupo' => 'features', "description" => "select", "options" => "conditions"],
                    ['label' => 'Ubicación', 'grupo' => 'features', "description" => "select", "options" => "locations"],
                    ['label' => 'Vista', 'grupo' => 'features', "description" => "select", "options" => "views"],
                    ['label' => 'Piso', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Proyecto', 'grupo' => 'features', "description" => "select", "options" => "projects"],
                ]
            ],
            [
                'label' => 'Área',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Área Total Edificada', 'grupo' => 'features', "description" => "totalizer"],
                    ['label' => 'Área Edificada', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Área Terraza', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Área Patio', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Área Común', 'grupo' => 'features', "description" => "number"],
                    ['label' => 'Área de Terreno', 'grupo' => 'features', "description" => "number"],
                ]
            ],
            /*
            [
                'label' => 'Descripción',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Descripción', 'grupo' => 'features', "description" => "long text"],
                    ['label' => 'Otros Datos', 'grupo' => 'features', "description" => "long text"],
                ]
            ],
            */
            [
                'label' => 'Características',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Características Generales', 'grupo' => 'features', "description" => "multi-select", "options" => "general_features"],
                ]
            ],
            [
                'label' => 'Precios',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Precio de Venta', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Precio de Alquiler', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Precio de Garaje', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Precio de Cochera', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Conexiones', 'grupo' => 'features', "description" => "number", "options" => "currency_system"],
                ]
            ],
            [
                'label' => 'Impuestos',
                'grupo' => 'group_features',
                'items' => [
                    ['label' => 'Gastos Comunes', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Contribución Inmobiliaria', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Impuesto Primaria', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                    ['label' => 'Impuesto Puerta', 'grupo' => 'features', "description" => "amount", "options" => "currency_system"],
                ]
            ],
            
            ['label' => 'Dirección', 'grupo' => 'enterprise','description'=>"Dirección CRA 34 No. 4-51Barrio rosablanca oriental",'value'=>"0"],
            ['label' => 'Teléfono', 'grupo' => 'enterprise','description'=>"31333368590",'value'=>"0"],
            ['label' => 'Logo', 'grupo' => 'enterprise','description'=>"",'value'=>"0"],
            ['label' => 'Nit', 'grupo' => 'enterprise','description'=>"3112920536",'value'=>"0"],
            ['label' => 'Ciudad', 'grupo' => 'enterprise','description'=>"Villavicencio",'value'=>"0"],
            ['label' => 'Empresa', 'grupo' => 'enterprise','description'=>"Mueble hogar Villavicencio",'value'=>"0"],



            [
                'label' => 'Artigas',
                'grupo' => 'demographic_departments',
                'items' => [
                    [
                        'label' => 'Artigas',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Centro', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Norte', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Sur', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Bella Unión',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Frontera', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Las Lomas', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Nueva Esperanza', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Tomás Gomensoro',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Principal', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio La Colina', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El Prado', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                ],
            ],
            [
                'label' => 'Canelones',
                'grupo' => 'demographic_departments',
                'items' => [
                    [
                        'label' => 'Canelones',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Centro', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Industrial', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Los Aromos', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Ciudad de la Costa',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Shangrilá', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Solymar', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El Pinar', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Las Piedras',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Bella Vista', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Olímpico', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio San Isidro', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                ],
            ],
            [
                'label' => 'Cerro Largo',
                'grupo' => 'demographic_departments',
                'items' => [
                    [
                        'label' => 'Melo',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Centro', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Las Canteras', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Los Arrayanes', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Río Branco',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Frontera', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Progreso', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio La Esperanza', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Fraile Muerto',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Central', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Norte', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Sur', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                ],
            ],
            [
                'label' => 'Colonia',
                'grupo' => 'demographic_departments',
                'items' => [
                    [
                        'label' => 'Colonia del Sacramento',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Histórico', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Real de San Carlos', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El General', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Nueva Helvecia',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Jardín', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El Prado', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Los Pinos', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Juan Lacaze',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Industrial', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Pueblo Nuevo', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio La Estación', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Carmelo',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Centro', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Lomas', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El Prado', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                ],
            ],
            [
                'label' => 'Durazno',
                'grupo' => 'demographic_departments',
                'items' => [
                    [
                        'label' => 'Durazno',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Centro', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Santa Bernardina', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio El Cementerio', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                    [
                        'label' => 'Sarandí del Yi',
                        'grupo' => 'demographic_cities',
                        'items' => [
                            ['label' => 'Barrio Pueblo Nuevo', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio Las Acacias', 'grupo' => 'demographic_warrior'],
                            ['label' => 'Barrio La Estación', 'grupo' => 'demographic_warrior'],
                        ],
                    ],
                ],
            ],
            [
                'label' => 'Flores',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Trinidad', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Florida',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Florida', 'grupo' => 'demographic_cities'],
                    ['label' => 'Sarandí Grande', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Lavalleja',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Minas', 'grupo' => 'demographic_cities'],
                    ['label' => 'José Pedro Varela', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Maldonado',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Maldonado', 'grupo' => 'demographic_cities'],
                    ['label' => 'Punta del Este', 'grupo' => 'demographic_cities'],
                    ['label' => 'San Carlos', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Montevideo',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Montevideo', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Paysandú',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Paysandú', 'grupo' => 'demographic_cities'],
                    ['label' => 'Guichón', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Río Negro',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Fray Bentos', 'grupo' => 'demographic_cities'],
                    ['label' => 'Young', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Rivera',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Rivera', 'grupo' => 'demographic_cities'],
                    ['label' => 'Tranqueras', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Rocha',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Rocha', 'grupo' => 'demographic_cities'],
                    ['label' => 'Chuy', 'grupo' => 'demographic_cities'],
                    ['label' => 'La Paloma', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Salto',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Salto', 'grupo' => 'demographic_cities'],
                    ['label' => 'Daymán', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'San José',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'San José de Mayo', 'grupo' => 'demographic_cities'],
                    ['label' => 'Libertad', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Soriano',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Mercedes', 'grupo' => 'demographic_cities'],
                    ['label' => 'Dolores', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Tacuarembó',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Tacuarembó', 'grupo' => 'demographic_cities'],
                    ['label' => 'Paso de los Toros', 'grupo' => 'demographic_cities'],
                ]
            ],
            [
                'label' => 'Treinta y Tres',
                'grupo' => 'demographic_departments',
                'items' => [
                    ['label' => 'Treinta y Tres', 'grupo' => 'demographic_cities'],
                    ['label' => 'Vergara', 'grupo' => 'demographic_cities'],
                ]
            ],

            ['label' => 'Apartamento', 'grupo' => 'property', 'description' => "Unidad habitacional dentro de un edificio, diseñada para uso residencial."],
            ['label' => 'Bodega', 'grupo' => 'property', 'description' => "Espacio diseñado para almacenamiento de productos, generalmente en condiciones controladas."],
            ['label' => 'Cabaña', 'grupo' => 'property', 'description' => "Construcción rústica utilizada principalmente para fines recreativos o vacacionales."],
            ['label' => 'Casa', 'grupo' => 'property', 'description' => "Propiedad independiente, generalmente utilizada como vivienda familiar."],
            ['label' => 'Chacra', 'grupo' => 'property', 'description' => "Propiedad rural con extensiones de tierra, adecuada para actividades agrícolas o recreativas."],
            ['label' => 'Duplex', 'grupo' => 'property', 'description' => "Propiedad dividida en dos unidades habitacionales independientes, ideal para familias grandes o inversión."],
            ['label' => 'Edificio', 'grupo' => 'property', 'description' => "Estructura con múltiples unidades habitacionales o comerciales, ideal para inversiones."],
            ['label' => 'Estudio', 'grupo' => 'property', 'description' => "Propiedad pequeña diseñada para un uso funcional, como vivienda o lugar de trabajo."],
            ['label' => 'Galpón', 'grupo' => 'property', 'description' => "Estructura amplia utilizada para almacenamiento o actividades industriales."],
            ['label' => 'Granja', 'grupo' => 'property', 'description' => "Propiedad rural utilizada para actividades agrícolas y ganaderas, con instalaciones básicas."],
            ['label' => 'Hotel', 'grupo' => 'property', 'description' => "Propiedad destinada a servicios de hospedaje, equipada con habitaciones y servicios adicionales."],
            ['label' => 'Local Comercial', 'grupo' => 'property', 'description' => "Espacio diseñado para actividades comerciales, como tiendas o oficinas."],
            ['label' => 'Monoambiente', 'grupo' => 'property', 'description' => "Unidad habitacional compacta, con todos los ambientes en un solo espacio, ideal para una o dos personas."],
            ['label' => 'Oficina', 'grupo' => 'property', 'description' => "Propiedad destinada a actividades administrativas o laborales."],
            ['label' => 'Penthouse', 'grupo' => 'property', 'description' => "Unidad habitacional de lujo, ubicada en el último piso de un edificio, con vistas panorámicas y acabados exclusivos."],
            ['label' => 'Quinta', 'grupo' => 'property', 'description' => "Propiedad con terreno extenso, ideal para actividades recreativas o productivas."],
            ['label' => 'Residencia', 'grupo' => 'property', 'description' => "Propiedad destinada a uso habitacional, con diseño y acabados superiores a los estándares promedio."],
            ['label' => 'Terreno', 'grupo' => 'property', 'description' => "Propiedad sin construcción, ideal para proyectos futuros o inversión inmobiliaria."],
            ['label' => 'Villa', 'grupo' => 'property', 'description' => "Propiedad de lujo, usualmente ubicada en zonas exclusivas, con diseño sofisticado y amplias áreas exteriores."],


            ['label' => 'Alquiler', 'grupo' => 'type_of_operation', 'description' => "Cesión temporal del uso de un inmueble a cambio del pago de una renta periódica, según lo pactado en contrato."],
            ['label' => 'Anticresis', 'grupo' => 'type_of_operation', 'description' => "Modalidad en la que el propietario cede el inmueble como garantía de una deuda, permitiendo al acreedor usarlo o alquilarlo."],
            ['label' => 'Arrendamiento', 'grupo' => 'type_of_operation', 'description' => "Contrato mediante el cual una parte cede el uso y disfrute de un inmueble por un tiempo determinado y a cambio de una renta."],
            ['label' => 'Cesión de Derechos', 'grupo' => 'type_of_operation', 'description' => "Transferencia de derechos sobre un inmueble, sin que necesariamente se efectúe una venta total del bien."],
            ['label' => 'Leaseback', 'grupo' => 'type_of_operation', 'description' => "Operación donde el propietario vende el inmueble y posteriormente lo arrienda para continuar utilizándolo."],
            ['label' => 'Permuta', 'grupo' => 'type_of_operation', 'description' => "Intercambio de un inmueble por otro, generalmente sin mediar dinero o con una compensación adicional."],
            ['label' => 'Venta', 'grupo' => 'type_of_operation', 'description' => "Transacción en la que se transfiere la propiedad de un inmueble a cambio de un precio acordado entre las partes."],


            ['label' => 'Monoambiente', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => 'Loft', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '1 Dormitorio', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '2 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '3 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '4 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '5 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '6 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '7 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '8 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '9 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],
            ['label' => '10 Dormitorios', 'grupo' => 'count_bedrooms', 'description' => "Para llenar select numéricos de dormitorios"],

            ['label' => '0', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],
            ['label' => '1', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],
            ['label' => '2', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],
            ['label' => '3', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],
            ['label' => '4', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],
            ['label' => '5', 'grupo' => 'count', 'description' => "Para llenar select numéricos"],            
            

            ['label' => 'A Estrenar', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'Buen Estado', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'Para Refaccionar', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'Para Reciclar', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'Para Demoler', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'En Construcción', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
            ['label' => 'En Pozo', 'grupo' => 'conditions', 'description' => "Para llenar select condición en el inmueble"],
        


            ['label' => 'Frente', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],
            ['label' => 'Contra-Frente', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],
            ['label' => 'Lateral', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],
            ['label' => 'Penthouse', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],
            ['label' => 'Interior', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],
            ['label' => 'Planta Baja', 'grupo' => 'locations', 'description' => "Para llenar select Ubicación en el inmueble"],

            ['label' => 'Vista Despejada', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Mar', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista a la Calle', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Parque', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista a la Ciudad', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Jardín', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Bosque', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Golf', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Río', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista al Lago', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],
            ['label' => 'Vista Interna', 'grupo' => 'views', 'description' => "Para llenar select Vista en el inmueble"],


            
            ['label' => 'AED', 'grupo' => 'currency_system', 'description' => "Dirham de los Emiratos Árabes Unidos"],
            ['label' => 'ARS', 'grupo' => 'currency_system', 'description' => "Peso Argentino"],
            ['label' => 'AUD', 'grupo' => 'currency_system', 'description' => "Dólar Australiano"],
            ['label' => 'BRL', 'grupo' => 'currency_system', 'description' => "Real Brasileño"],
            ['label' => 'CAD', 'grupo' => 'currency_system', 'description' => "Dólar Canadiense"],
            ['label' => 'CHF', 'grupo' => 'currency_system', 'description' => "Franco Suizo"],
            ['label' => 'CLP', 'grupo' => 'currency_system', 'description' => "Peso Chileno"],
            ['label' => 'CNY', 'grupo' => 'currency_system', 'description' => "Yuan Renminbi"],
            ['label' => 'COP', 'grupo' => 'currency_system', 'description' => "Peso Colombiano"],
            ['label' => 'EUR', 'grupo' => 'currency_system', 'description' => "Euro"],
            ['label' => 'GBP', 'grupo' => 'currency_system', 'description' => "Libra Esterlina"],
            ['label' => 'INR', 'grupo' => 'currency_system', 'description' => "Rupia India"],
            ['label' => 'JPY', 'grupo' => 'currency_system', 'description' => "Yen Japonés"],
            ['label' => 'KRW', 'grupo' => 'currency_system', 'description' => "Won Surcoreano"],
            ['label' => 'MXN', 'grupo' => 'currency_system', 'description' => "Peso Mexicano"],
            ['label' => 'NZD', 'grupo' => 'currency_system', 'description' => "Dólar Neozelandés"],
            ['label' => 'RUB', 'grupo' => 'currency_system', 'description' => "Rublo Ruso"],
            ['label' => 'SAR', 'grupo' => 'currency_system', 'description' => "Riyal Saudí"],
            ['label' => 'SEK', 'grupo' => 'currency_system', 'description' => "Corona Sueca"],
            ['label' => 'USD', 'grupo' => 'currency_system', 'description' => "Dólar Estadounidense"],
            ['label' => 'UYU', 'grupo' => 'currency_system', 'description' => "Peso Uruguayo"],            

            ['label' => 'Accesibilidad', 'grupo' => 'general_features', 'description' => "Facilidades de acceso para personas con movilidad reducida"],
            ['label' => 'Aire acondicionado', 'grupo' => 'general_features', 'description' => "Disponibilidad de sistema de climatización"],
            ['label' => 'Alarma', 'grupo' => 'general_features', 'description' => "Sistema de seguridad instalado"],
            ['label' => 'Ascensor', 'grupo' => 'general_features', 'description' => "Disponibilidad de elevador en el edificio"],
            ['label' => 'Balcón', 'grupo' => 'general_features', 'description' => "Espacio exterior adjunto a la propiedad"],
            ['label' => 'Barbacoa', 'grupo' => 'general_features', 'description' => "Área destinada para asados"],
            ['label' => 'Calefacción', 'grupo' => 'general_features', 'description' => "Sistema de calentamiento para interiores"],
            ['label' => 'Cámaras de seguridad', 'grupo' => 'general_features', 'description' => "Sistema de monitoreo con cámaras"],
            ['label' => 'Cochera', 'grupo' => 'general_features', 'description' => "Espacio para estacionar vehículos"],
            ['label' => 'Depósito', 'grupo' => 'general_features', 'description' => "Área destinada para almacenamiento"],
            ['label' => 'Financiación', 'grupo' => 'general_features', 'description' => "Tipos de Características generales"],
            ['label' => 'Gimnasio', 'grupo' => 'general_features', 'description' => "Espacio equipado para hacer ejercicio"],
            ['label' => 'Jacuzzi', 'grupo' => 'general_features', 'description' => "Instalación de baño con hidromasaje"],
            ['label' => 'Jardín', 'grupo' => 'general_features', 'description' => "Espacio verde en el inmueble"],
            ['label' => 'Parque infantil', 'grupo' => 'general_features', 'description' => "Área de juegos para niños"],
            ['label' => 'Parrillero', 'grupo' => 'general_features', 'description' => "Espacio para asados al aire libre"],
            ['label' => 'Piscina', 'grupo' => 'general_features', 'description' => "Área de natación disponible"],
            ['label' => 'Portería', 'grupo' => 'general_features', 'description' => "Servicio de control y vigilancia en el edificio"],
            ['label' => 'Sala de eventos', 'grupo' => 'general_features', 'description' => "Espacio destinado para reuniones o celebraciones"],
            ['label' => 'Terraza', 'grupo' => 'general_features', 'description' => "Espacio abierto en el inmueble"],


          
        );

        foreach ($profesiones as $value) {
            // Inserta la sección principal
            $groupId = DB::table('master_tables')->insertGetId([
                'label' => $value["label"],
                'grupo' => $value["grupo"],
            ]);
        
            // Inserta los items asociados, si existen
            if (!empty($value['items'])) {
                foreach ($value['items'] as $item) {
                    $cityId = DB::table('master_tables')->insertGetId([
                        'label' => $item["label"],
                        'grupo' => $item["grupo"],
                        'description' => $item["description"] ?? null,
                        'options' => $item["options"] ?? null,
                        'medida_id' => $groupId, // Relaciona con el departamento
                    ]);
        
                    // Inserta los barrios, si existen
                    if (!empty($item['items'])) {
                        foreach ($item['items'] as $subItem) {
                            DB::table('master_tables')->insert([
                                'label' => $subItem["label"],
                                'grupo' => $subItem["grupo"],
                                'description' => $subItem["description"] ?? null,
                                'options' => $subItem["options"] ?? null,
                                'medida_id' => $cityId, // Relaciona con la ciudad
                            ]);
                        }
                    }
                }
            }
        }
        
    }
}
