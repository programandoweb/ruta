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

const accountSid  =   process.env.TWILIO_ACCOUNT_SID!;
const authToken   =   process.env.TWILIO_AUTH_TOKEN!;
const fromNumber  =   process.env.TWILIO_WHATSAPP_NUMBER!;

console.log(accountSid, authToken)

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { to, body } = await req.json();

  try {
    const variables = {
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      body,
    };
    
    console.log(variables);
    
    const message = await client.messages.create(variables);
    
    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
