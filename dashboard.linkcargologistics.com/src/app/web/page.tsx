import Link from "next/link";
import React from "react";

const Web=()=>{
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white-100 6">        
          <div className={`mx-[56px] mt-[0px] flex items-center`}>
              <div className="text-center w-full mb-4 h-2.5 font-poppins text-[36px] font-bold uppercase text-navy-700 dark:text-white">
                {String(process.env.NEXT_PUBLIC_NAME)}
              </div>
          </div>                    
        </div>
      )
}
export default Web;