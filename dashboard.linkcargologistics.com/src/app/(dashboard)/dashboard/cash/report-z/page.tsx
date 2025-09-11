import { type Metadata } from "next";
import CSRCashReportZ from "./CSRCashReportZ";
const  title:string = "Caja"
export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const Cash=()=>{
    return  <div>
                <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
                  <CSRCashReportZ/>
                </div>
            </div>
}
export default Cash;
