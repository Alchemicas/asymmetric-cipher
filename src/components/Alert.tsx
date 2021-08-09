import { Avatar, HTMLDivProps, Shape } from '@queelag/react-core'
import { IconCheck } from '@queelag/react-feather-icons'
import React from 'react'

export function Alert(props: HTMLDivProps) {
  return (
    <div className='flex items-center p-6 space-x-6 rounded-sm bg-gradient-to-r from-green-900 via-green-800 to-green-700'>
      <Avatar background='bg-green-600' color='text-white' icon={IconCheck} shape={Shape.CIRCLE} size={24} />
      <span className='flex-1 text-sm'>{props.children}</span>
    </div>
  )
}
