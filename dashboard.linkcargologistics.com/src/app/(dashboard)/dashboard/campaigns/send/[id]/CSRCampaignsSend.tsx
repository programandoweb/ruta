'use client'
import useFormData from '@/hooks/useFormDataNew';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaHandPointer,
  FaPlayCircle,
  FaStopCircle
} from 'react-icons/fa';

interface Recipient {
  name: string;
  lastname: string;
  phone_number: string;
  sent_at: string | null;
  delivered_at: string | null;
  error?: boolean;
  responded: number;
}

let message_ia=""

const CSRCampaignsSend: NextPage = () => {
  const formData                    =   useFormData(false, false, false);
  const [playing, setPlaying]       =   useState(false);
  const [recipients, setRecipients] =   useState<Recipient[]>([]);
  const [campaign, setCampaign]     =   useState<any>({});
  const [sender_id, setSender_id]   =   useState<any>(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSend = async (to: string, body: string) => {
    try {
      const waitTime = 10000 + Math.floor(Math.random() * 15000); // entre 10s y 15s
      await delay(waitTime);

      const payload = {
        to: to || "+5215526589002",
        text: campaign[0]?.content || body || 'Mensaje de prueba desde Ivoolve',
        imageUrl: campaign[0]?.image,
        campaign,
        sender_id: sender_id
      };

      const apiKey = process.env.NEXT_PUBLIC_GEMINI;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Parafrasea este mensaje para cambiarlo, es un mensaje para marketing de whatsapp, no me des opciones, sólo muestra el mensaje sin comentarios "${message_ia!==''?message_ia:payload.text}".`
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data_gemini = await response.json();

      if (data_gemini && data_gemini.candidates) {
        
        let generatedText = data_gemini.candidates[0]?.content?.parts[0]?.text;
        generatedText = generatedText.replace(/```markdown|```/g, "").trim();
        message_ia    = generatedText;
        payload.text  = message_ia;
        console.log(payload," generado por ia => ",generatedText)
      }

      //return false;

      const res = await fetch('/api/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (error: any) {
      console.log(error);
    }
  };
  /*
  const handleSend    =   async (to:string, body:string) => {
    try {

      const payload   =  {
        to:to||"+5215526589002",
        text: campaign[0]?.content||body||'Mensaje de prueba desde Ivoolve',
        imageUrl: campaign[0]?.image,
        campaign,
        sender_id:sender_id
      };

      //return console.log(payload)

      const res   =   await fetch('/api/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
      
    } catch (error: any) {
      console.log(error)
    } finally {
      
    }
  };
  */

  useEffect(() => {
    formData
      .handleRequest(formData.backend + location.pathname)
      .then((res: any) => {
        if(res?.session) setSender_id(res?.session);
        if(res.campaign) setCampaign(res.templates);
        if (res.recipients) setRecipients(res.recipients);
      });
  }, []);

  useEffect(()=>{
    if(playing){  
      const new_recipients  =   [...recipients]  
      const result          =   new_recipients.find((search:any)=>{return search?.delivery?.sent_at===null})
      
      if(result&&result.phone_number){
        const textMessage = 
        "*Hola, bienvenido*\n" +
        "_Tu mejor aplicación en USA para transporte de carga._\n" +
        "Visítanos: https://latinoexpress-cargo.com/";

        
        handleSend(result.phone_number,textMessage).then((response:any)=>{
          setPlaying(false);
          //console.log(response)
          //return;
          if(response.success){
            formData.handleRequest(formData.backend + location.pathname,"put",result).then((res: any) => {
              if(res.campaign) setCampaign(res.templates);
              if (res.recipients){ 
                const result          =   res.recipients.find((search:any)=>{return search?.delivery?.sent_at===null})
                setRecipients(res.recipients)
                if(result){                 
                  setPlaying(true);
                }        
              }
            });            
          }          
        })
      }else{
        setTimeout(() => {
          setPlaying(false);     
        }, 2000);        
      }
    }
  },[playing]) 


  return (
    <div className="mt-10">
      <div className="flex justify-center mb-4">
        {playing
          ? <FaStopCircle className="w-8 h-8 text-red-500 cursor-pointer" onClick={() => setPlaying(false)} />
          : <FaPlayCircle className="w-8 h-8 text-green-500 cursor-pointer" onClick={() => setPlaying(true)} />
        }
      </div>
      <div className="grid grid-cols-6 gap-4 mt-4">
        {recipients.map((row:any, i) => {
          const d = row.delivery;
          return (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <div className="text-center text-xs mb-2">
                {row.name} {row.lastname}
                <div><b>+{row.phone_number}</b></div>
              </div>
              <div className="flex justify-center space-x-3">
                {/* Enviado */}
                {d.sent_at
                  ? <FaCheckCircle className="w-5 h-5 text-green-500" title="Enviado" />
                  : <FaTimesCircle className="w-5 h-5 text-red-500" title="No enviado" />
                }
                
                {/* Entregado */}
                {d.delivered_at
                  ? <FaTruck className="w-5 h-5 text-blue-500" title="Entregado" />
                  : <FaTruck className="w-5 h-5 text-gray-300" title="No entregado" />
                }
                {/* Click CTA */}
                {d.responded
                  ? <FaHandPointer className="w-5 h-5 text-purple-500" title="Click CTA" />
                  : <FaHandPointer className="w-5 h-5 text-gray-300" title="Sin click" />
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSRCampaignsSend;
