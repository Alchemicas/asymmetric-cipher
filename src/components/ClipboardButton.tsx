import { Avatar, HTMLDivProps, Shape } from '@queelag/react-core'
import { IconClipboard } from '@queelag/react-feather-icons'
import React from 'react'

export function ClipboardButton(props: HTMLDivProps) {
  return (
    <Avatar
      {...props}
      background='bg-gray-800 hover:bg-gray-700 active:bg-gray-800'
      className='rounded-sm cursor-pointer transition duration-200'
      color='text-gray-300'
      icon={IconClipboard}
      iconProps={{ thickness: 1.5 }}
      shape={Shape.SQUARE}
      size={48}
    />
  )
}
