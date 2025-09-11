/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

const MapComponent = () => {
    return (
        <div className="w-full">
            <GoogleMap mapContainerStyle={defaultMapContainerStyle}></GoogleMap>
        </div>
    )
};

export default MapComponent;