'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const Navbar = () => {
  return (
     <nav className='bg-blue-600'>
          <div className="">
               <Link href={`/`} className='hover-underline' >
               </Link>
          </div>
     </nav>
  )
}

export default Navbar