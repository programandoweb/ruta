'use client'
import Card from "@/components/card";
import Image from "next/image";
import { FC } from "react";
import ButtonSale from "@/components/shoppincart/ButtonSale";
import CustomCardMedia from "../cardmedia";

interface ContentDescriptionProps {
    sale?:boolean,
    data: {
        image?:string;
        name?: string;
        excerpt?:string;
        price?:string;
    };
}



const ContentDescription: FC<ContentDescriptionProps> = ({ data , sale = false }) => {
    //shoppingCart
    
    return (
                <Card className={"items-center w-full h-full"}>
                    <div className="relative w-full">
                        <div className="absolute right-2 top-2">
                            {
                                sale&&(
                                    <ButtonSale data={data}/>
                                )
                            }    
                        </div> 
                        <div className="w-full">
                            <CustomCardMedia alt={String(process.env.NEXT_PUBLIC_NAME)} src={data?.image||"/img/profile/banner.png"} width={"100%"} height={220}/>                                                                               
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex gap-1">
                            <div className="flex-grow text-left bg-gray-200">
                                <h2 className="font-bold text-xl m-2">
                                    {data?.name}
                                </h2>
                            </div>
                            <div className="flex-shrink-0 text-center bg-gray-200">
                                <h2 className="text-2xl m-2">
                                    {data?.price}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-justify mt-2 mb-2 p-2">
                        <div dangerouslySetInnerHTML={{ __html: data?.excerpt||"" }} />                        
                    </div>                                        
                </Card>
    );
};

export default ContentDescription;
