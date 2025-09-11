import { type Metadata } from "next";
import React from "react";
import CSRCalendar from "./CSRCalendar";

const title:string    =   "Perfil"
const alias:string    =   'profile';

export const metadata: Metadata = {
  title: 'Dashboard - '+title+' - '+process.env.NEXT_PUBLIC_NAME,
  description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

const Profile = (props:any) => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <CSRCalendar {...props}/>  
      </div>
    </div>
  );
};

export default Profile;
