<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfirmacionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Correo Confirmación de registro en nuestra plataforma Ivoolve',
        );
    }

    public function build()
    {
        return $this->view('email.template_02') // Corrige la ruta de la vista si es necesario
                    ->with('data', $this->data); // Pasa los datos a la vista utilizando el método with()
    }
}
