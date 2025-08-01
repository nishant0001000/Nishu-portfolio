import React from 'react'
import Image from 'next/image'

const NavPart1 = () => {
  return (
    <div className='flex items-center gap-4'>
        <a href="https://skiper-ui.com/" className=' flex items-center gap-2'>
            <Image src="/images/m-logo2.svg" alt="logo" width={42} height={42} />
            {/* <h4 className='font-bold text-lg'>Nishant Mogahaa</h4>
            <p className='text-[10px] border-1 border-orange-600 rounded-full px-1.5 text-orange-600'>Welcome</p> */}
        </a>

    </div>
  )
}

export default NavPart1