'use client'
import AuthModal from '@/components/client/auth-modal/auth-modal'
import Footer from '@/components/client/footer/footer'
import Navbar from '@/components/client/navbar/navbar'
import { useDisclosure } from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import React from 'react'


const Pagelayout = ({children}:{children:React.ReactNode}) => {

  const {isOpen,onOpen,onOpenChange}= useDisclosure()
  const pathname=usePathname()

  return (
    <div>
      {
        pathname.includes("/admin") ? children :  
        <main>
            <Navbar onOpen={onOpen}/>
            <section>{children}</section>
            <AuthModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange}/>
            <Footer/>
        </main>
      }
    </div>
  )
}

export default Pagelayout