import Link from 'next/link';
import { MdOutlineSettings } from 'react-icons/md';


export default function Home() {
  return (
    <main className="auth-content flex items-center justify-center h-screen">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-1">        
          <div className="p-4 text-center">
            <div className="flex justify-center">
              <MdOutlineSettings className="w-30 md:w-40 h-30 md:h-40 mb-5 mt-5" />
            </div>
            <h3>
              Sistema bien desarrollado en Colombia, por Jorge Méndez de{' '}
              <Link href="https://programandoweb.net" target="_blank">
                programandoweb.net
              </Link>
            </h3>
            <div>Soporte técnico lic.jorgemendez@gmail.com</div>
            <div>
              Tecnología de desarrollo: <b>NEXTJS 14 y Laravel 11</b>
            </div>
          </div>
        
      </div>
    </main>
  );
}
