import Image from 'next/image';
import React from 'react';
import './index.css'

interface CustomCardMediaProps {
  alt: string;
  src: string;
  width: number|string;
  height: number;
}

const CustomCardMedia: React.FC<CustomCardMediaProps> = ({ alt, src, width, height }) => {
  return (
    <div className="card" style={{width, height}}>
      <Image src={src} alt={alt} fill={true}  style={{objectFit: "cover"}}	/>      
    </div>
  );
};

export default CustomCardMedia;
