import { type ReactNode } from 'react'

type Props = {
  className?: string;
  children?: ReactNode;
  variant?: "brand" | "violet" | "purple" | "fuchsia" | "green" | undefined | boolean;  
}

function CardNotRound(props: Props) {
  const { className, children, variant  } = props;
  
  if(variant==="green"){
    return  <div className={`!z-5 relative flex flex-col bg-lime-400 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
        {children}
      </div>
  }

  if(variant){
    return  <div className={`!z-5 relative flex flex-col bg-brand-400 bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
        {children}
      </div>
  }

  return  <div className={`!z-5 relative flex flex-col bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none ${className}`}>
      {children}
    </div>
  
}

export default CardNotRound;
