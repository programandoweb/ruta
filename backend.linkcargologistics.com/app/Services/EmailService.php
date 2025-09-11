<?php

namespace App\Services;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\Factory as ViewFactory;

class EmailService
{
    private $mailer;
    private $viewFactory;

    public function __construct(Mail $mailer, ViewFactory $viewFactory)
    {
        $this->mailer       =   $mailer;
        $this->viewFactory  =   $viewFactory;
    }

    public function sendEmailRegisterUser($user)
    {
        $toEmail    = $user->email;
        $subject    = "Confirmación de registro en " . env("APP_NAME");

        $data = [
            'user'              => $user->name,
            'subject'           => $subject,
            'confirmation_code' => $user->confirmation_code, // Incluye el código de confirmación
        ];

        Mail::send('email.register', $data, function ($msj) use ($subject, $toEmail) {
            $msj->from(env("MAIL_FROM_ADDRESS"), env("MAIL_FROM_NAME"));
            $msj->subject($subject);
            $msj->to($toEmail);
        });
    }


    public function sendPasswordResetEmail($user)
    {
        $toEmail    =   $user->email;
        $subject    =   "Recuperación de contraseña en ".env("APP_NAME"); 

        $data = [
            'user'      =>  $user->name,
            'subject'   =>  $subject, // Pass the subject dynamically if needed
            'verification_link' => route('auth.recovery_password', ['email' => $user->email,'token' => $user->remember_token]),
        ];        

        Mail::send( 'email.recover_password', $data, 
                        function($msj) 
                        use($subject,$toEmail){
            $msj->from(env("APP_FROM_ACCOUNT"),env("APP_FROM_EMAIL"));
            $msj->subject($subject);
            $msj->to($toEmail);
        });
        
    }  
}
