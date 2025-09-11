import Image from "next/image"
const Logo=()=>{
    return  <Image
              width={200}
              height={200}
              alt={String(process.env.NEXT_PUBLIC_NAME)}
              src="/img/logo.png"
              priority
              className="w-auto h-auto"
            />
}
export default Logo;