'use client'
import { type ReactNode } from 'react'

type Props = {
  className?: string;
  children?: ReactNode;
  variant?: "brand" | "violet" | "purple" | "fuchsia" | "green" | undefined | boolean;  
}

function Card(props: Props) {
  const { className, children, variant  } = props;
  
  if(variant==="green"){
    return  <div className={`!z-5 relative flex flex-col rounded-[20px] bg-lime-400 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
              {children}
            </div>
  }

  if(variant){
    return  <div className={`!z-5 relative flex flex-col rounded-[20px] bg-brand-400 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
              {children}
            </div>
  }

  return  <div className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
            {children}
          </div>
  
}

export default Card;
