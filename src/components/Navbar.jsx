import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex items-center justify-around bg-gray-900 w-full'>
     <div className=''>
          logo
     </div>
     <div className="">
          <nav className="">
               <ul className="capitalize flex p-2 m-2 justify-around w-full">
                    <li className='' Link="/">Home</li>
                    <li className='' Link="/about">about</li>
                    <li className='' Link="/#">service</li>
                    <li className='' Link="/login">login</li>
                    <li className='' Link="/register">login</li>
               </ul>
          </nav>
     </div>
    </div>
  )
}

export default Navbar