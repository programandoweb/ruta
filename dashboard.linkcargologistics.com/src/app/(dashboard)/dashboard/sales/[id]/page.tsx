import { type Metadata } from "next";
import CSRViewSaleComponent from "./CSRViewSaleComponent";
const  title:string = "Categoría"
export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const Category=(props:any)=>{
    return (
      <div>
                  <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
                    <CSRViewSaleComponent /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
                    {...props}/>  
                  </div>
              </div>
    );
}
export default Category;
