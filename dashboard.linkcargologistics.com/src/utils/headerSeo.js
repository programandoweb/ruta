import { headers } from 'next/headers';

export const headerSeoOLD      =   async()=>{
    
    const headersList       =   await headers();
    const referer           =   headersList.get('referer')
    const forwardedHost     =   headersList.get('x-forwarded-host').replace(":3000","");
    const forwardedProto    =   headersList.get('x-forwarded-proto').replace(":3000","");

    if(referer){
        const url               =   new URL(referer);
        const pathname          =   url.pathname;
        const endPointSeo       =   forwardedProto+"://"+forwardedHost+process.env.NEXT_PUBLIC_DOMAINSUBFIXED+"/seo?true&pathname="+(pathname||"/");
        const response          =   await fetch(endPointSeo);   
        const data              =   await response.json();        
        const response2         =   await headerSeoOld(data)    
        //return 
        //console.log(response2,"----------------------------------------------")
        return response2;        
    }    
}

export async function headerSeo(dataset){ 
    if (!dataset) {
        return {}; // Devuelve un objeto vacío si dataset es undefined
    }
    const response    =      JSON.parse(dataset)    
    //const response      =      dataset   
    let seo   =   {};
    let seo_  =   {};
    const id  =   1359571028250186;
    if(response&&response.error===undefined&&response&&response.data&&response.data.seo){
        seo                   =   {...response.data.seo};
        seo_                  =   seo;
        seo_.manifest         =   "/manifest.json";
        seo_.openGraph        =   seo.og;
        seo_.openGraph.app_id =   id;
        seo_.openGraph.images =   seo.image;
        delete(seo_.og)
    }else{
        seo_.openGraph          =   {app_id:id}
        seo_.manifest           =   "/manifest.json";        
        seo_.title              =   process.env.REACT_APP_TITLE+' App';
        seo_.description        =   process.env.REACT_APP_NAME+' es la evolución del desarrollo por programandoweb.net';        
        seo_.icons              =   { apple: "/img/icons-192.png" };
    }  
    return {...seo_}
}
export async function decode(props){
    const dataset   =   props?.searchParams?.data;
    if(!dataset){
        return{}
    }
    let endpoint;
    const response  =       JSON.parse(dataset) 
    if(response&&response.status&&response.status>200){
        return{error:response.message};
    }

    if(response&&response.data&&response.data.url){
        endpoint    =       response.data.url.replace("/seo","")
    }      
    return {...response.data,endpoint}
}