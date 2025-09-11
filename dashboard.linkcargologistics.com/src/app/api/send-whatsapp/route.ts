/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve
 * ---------------------------------------------------
 */
import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Autenticación con API KEY y SECRET
const accountSid      =   process.env.TWILIO_ACCOUNT_SID!;
const apiKeySid       =   process.env.TWILIO_API_KEY_SID!;
const apiKeySecret    =   process.env.TWILIO_API_KEY_SECRET!;
const fromNumber      =   process.env.TWILIO_WHATSAPP_NUMBER!;
const client          =   twilio(apiKeySid, apiKeySecret, { accountSid });

export async function POST(req: Request) {
  const { to, templateSid, variables = [] } = await req.json();

  /*
  const setting       = {
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      body,
  }
      */

  //return NextResponse.json({ success: true, to, body });
  /*
  const setting_template       = {
    from: `whatsapp:${fromNumber}`,
    to:   `whatsapp:${to}`,
    //contentSid: 'HXe006379285cd5faf139945feb98a8084'
    contentSid: 'HXa3fde477157e07a877f5ec0d642c2bc3'    
  }*/

  const setting_template  =  {
      from:           `whatsapp:${fromNumber}`,
      to:             `whatsapp:${to}`,
      contentSid:     'HXc77b93c74d14f05ecc3e714f50222a07'      
  }

  /*
  const setting_template2       = {
    from: `whatsapp:${fromNumber}`,
    to:   `whatsapp:${to}`,
    //contentSid: 'HXb8ac2d46e3725df9761404abb3191c45',
    contentSid: 'HX061e80f3504c1bcf21d0981d9e6acda8',    
  }

  const setting_plain = {
    from: `whatsapp:${fromNumber}`,
    to:   `whatsapp:${to}`,
    body: 'hola'
  }
  */
  
  //console.log(setting_template,setting_template2,setting_plain)
  //console.log(setting_template)
  
  //return NextResponse.json({ success: true, to, body,setting_template,setting_template2 });

  try {

    const message = await client.messages.create(setting_template);
    console.log(message,setting_template);
    /*
    if(message.sid){
      setTimeout(async () => {
        //const message = await client.messages.create(setting_template2);  
      }, 5000);      
    }
    */

    return NextResponse.json({ success: true, sid: message.sid });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
