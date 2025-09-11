import { type Metadata } from "next";
import ComponentCategory from "./Component";
const  title:string = "Configuración"
export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const Setting=()=>{
    return  <div>
                <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
                  <ComponentCategory/>  
                </div>
            </div>
}
export default Setting;
