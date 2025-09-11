import { headers } from 'next/headers';

export let dataSeo =   {};
export let seo_    =   {};

export async function generateMeta() {

    try {
      
      const headersList   =   await headers();
      const referer       =   headersList.get('x-forwarded-proto')+"://"+headersList.get('host');
      const api_url       =   referer+"/api/generic?seo=true&pathname="+headersList.get('real_pathname');
      const res           =   await fetch(api_url);
      const api_local     =   await res.json();
      
      if( api_local&&
          !api_local.error&&
          api_local?.endpoint?.includes("undefined")){
        return;
      }
  
      dataSeo             =   api_local;
  
      let seo;
      if(api_local&&api_local.data&&api_local.data.seo){
        seo                   =   api_local.data.seo;
        seo_                  =   seo;
        seo_.manifest         =   "/manifest.json";
        seo_.openGraph        =   seo.og;
        seo_.openGraph.app_id =   1359571028250186;
        seo_.openGraph.images =   seo.image;
        delete(seo_.og)
      }else{
        seo_.manifest     =   "/manifest.json";
        seo_.title        =   process.env.REACT_APP_TITLE+' App 202222';
        seo_.description  =   process.env.REACT_APP_NAME+' es la evolución del desarrollo por programandoweb.net';
        seo_.manifest     =   "/manifest.json";
        seo_.icons        =   { apple: "/img/icons-192.png" };
      }    
  
      return  {   ...seo_,
                  current_pathname:headersList.get('real_pathname'),
                  real_pathname:headersList.get('real_pathname')
              }
  
    } catch (error) {
      console.log(error) 
    }  
   
  }