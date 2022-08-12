import { ReactUtils } from '@queelag/react-core'
import { useObserver } from '@queelag/state-manager-react'
import React from 'react'
import { AppMode } from '../definitions/enums'
import { appStore } from '../stores/app.store'

export function Header() {
  const onClickSwitchMode = () => {
    switch (appStore.data.mode) {
      case AppMode.DECRYPTION:
        appStore.data.mode = AppMode.ENCRYPTION
        break
      case AppMode.ENCRYPTION:
        appStore.data.mode = AppMode.DECRYPTION
        break
    }
  }

  return useObserver(() => (
    <div className='flex justify-between items-center p-6 space-x-6'>
      <span className=''>{appStore.data.mode}</span>
      <div className='flex items-center space-x-6'>
        {appStore.hasIVAndReceiverPublicKey && (
          <button
            className={ReactUtils.joinClassNames(
              'px-6 py-2 rounded-sm uppercase text-xs bg-gray-800',
              'transition duration-200 hover:bg-gray-700 active:bg-gray-800'
            )}
            onClick={onClickSwitchMode}
            type='button'
          >
            switch mode
          </button>
        )}
      </div>
    </div>
  ))
}
