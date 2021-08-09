import { IconCompass } from '@queelag/react-feather-icons'
import React from 'react'

export function Loading() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <IconCompass className='animate-spin' color='text-white' size={32} thickness={1} />
    </div>
  )
}
