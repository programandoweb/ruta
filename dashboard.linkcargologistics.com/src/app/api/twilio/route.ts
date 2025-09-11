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

export async function POST(req: Request) {
  const { to, text, sender_id, imageUrl }  =   await req.json();
  //return console.log(to, text,imageUrl,"10000")
  
  try {
    const base  = process.env.NEXT_PUBLIC_WHATSAPP_URL+"/"+sender_id+"/send"||"";
    if(base===''){
      return NextResponse.json(
        { success: false,error:"base=null"},
        { status: 200 }
      );
    } 

    if(!sender_id||sender_id===0){
      return NextResponse.json(
        { success: false,error:"Not Sender"},
        { status: 200 }
      );
    }

    const response = await fetch(
      base,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, text, imageUrl })
      }
    );

    console.log(base)

    const data = await response.json();

    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Error from WhatsApp service' },
        { status: response.status }
      );
    }
    //console.log(data)
    return NextResponse.json(
      { success: true, sid: data.id || data.sid || null, to:to },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
