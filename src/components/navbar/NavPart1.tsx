import React from 'react'
import Image from 'next/image'

const NavPart1 = () => {
  return (
    <div className='flex gap-4 items-center'>
        <a href="#" className='flex gap-2 items-center'>
            <Image src="/images/m-logo2.svg" alt="logo" width={42} height={42} />
            {/* <h4 className='text-lg font-bold'>Nishant Mogahaa</h4>
            <p className='text-[10px] border-1 border-orange-600 rounded-full px-1.5 text-orange-600'>Welcome</p> */}
        </a>

    </div>
  )
}

export default NavPart1