import { type Metadata } from "next";
import Link from "next/link";
import FixedPlugin from "@/components/fixedPlugin/FixedPlugin";
import Footer from "@/components/footer/FooterAuthDefault";
import Logo from "@/components/logo";

export const metadata: Metadata = {
    title: 'Inicio de sesión',
    description:String(process.env.NEXT_PUBLIC_SLOGAN)
}

export default function AuthLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
                <FixedPlugin />
                <main className={`mx-auto min-h-screen`}>
                    <div className="relative flex">
                        <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
                            <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                                <Link href="/web" className="mt-0 w-max lg:pt-10">
                                    <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
                                        <Logo/>
                                    </div>
                                </Link>
                                {children}
                                <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                                    <div className={`absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px] bg-[url('/img/auth/auth.jpg')]`}/>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}