import { Logger, LoggerLevel, PromiseUtils } from '@queelag/core'
import { ReactUtils } from '@queelag/react-core'
import { IconArrowUp } from '@queelag/react-feather-icons'
import { configure } from 'mobx'
import { observer } from 'mobx-react'
import React, { Fragment, useEffect } from 'react'
import { Alert } from './components/Alert'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Loading } from './components/Loading'
import { TextArea } from './components/TextArea'
import { AppMode, AppStatusKey } from './definitions/enums'
import { appStore } from './stores/app.store'

configure({ enforceActions: 'never' })
Logger.level = LoggerLevel.DEBUG

export const App = observer(() => {
  useEffect(() => {
    PromiseUtils.truthyChain(
      () => appStore.initialize(),
      async () => {
        let params: URLSearchParams, iv: string, receiverRawPublicKey: string, textToDecrypt: string

        params = new URLSearchParams(window.location.search)
        iv = params.get('iv')
        receiverRawPublicKey = params.get('rrpuk')
        textToDecrypt = params.get('ttd')

        if (iv && receiverRawPublicKey) {
          appStore.data.iv = iv.replace(/ /g, '+')
          appStore.data.mode = AppMode.ENCRYPTION
          appStore.data.receiver.rawPublicKey = receiverRawPublicKey.replace(/ /g, '+')

          if (textToDecrypt) {
            appStore.data.mode = AppMode.DECRYPTION
            appStore.data.text.toDecrypt = textToDecrypt.replace(/ /g, '+')
          }

          return appStore.initializeCipher()
        }
      },
      async () => appStore.isModeDecryption && appStore.decryptText()
    )
  }, [])

  if (appStore.status.isPending(AppStatusKey.INITIALIZE)) {
    return <Loading />
  }

  const onClickPublicKey = () => {
    window.navigator.clipboard.writeText(appStore.data.keyPair.raw.public)

    appStore.status.idle(AppStatusKey.COPIED_ENCRYPTED_TEXT)
    appStore.status.success(AppStatusKey.COPIED_PUBLIC_KEY)

    window.scrollTo({ top: 0 })
  }

  const onClickEncryptedText = () => {
    window.navigator.clipboard.writeText(appStore.data.text.encrypted)

    appStore.status.idle(AppStatusKey.COPIED_PUBLIC_KEY)
    appStore.status.success(AppStatusKey.COPIED_ENCRYPTED_TEXT)

    window.scrollTo({ top: 0 })
  }

  return (
    <div>
      <Header />
      <div className='max-w-screen-lg mx-auto flex flex-col p-6 pb-96 space-y-6'>
        {appStore.status.isSuccess(AppStatusKey.COPIED_ENCRYPTED_TEXT) && (
          <Alert>The encrypted text has been copied to the clipboard, it is safe to share it anywhere.</Alert>
        )}
        {appStore.status.isSuccess(AppStatusKey.COPIED_PUBLIC_KEY) && (
          <Alert>Your public key has been copied to the clipboard, it is safe to share it anywhere.</Alert>
        )}
        <Input
          label='your public key'
          onClick={onClickPublicKey}
          path='public'
          placeholder='ex. long_alphanumerical_string'
          store={appStore.data.keyPair.raw}
          readOnly
        />
        {appStore.hasIV && <Input label='initialization vector' path='iv' placeholder='ex. long_alphanumerical_string' store={appStore.data} readOnly />}
        {appStore.hasIVAndReceiverPublicKey && (
          <Fragment>
            <Input
              label='receiver public key'
              onChange={() => appStore.initializeCipher()}
              path='rawPublicKey'
              placeholder='ex. long_alphanumerical_string'
              store={appStore.data.receiver}
            />
            {appStore.isModeDecryption && (
              <Fragment>
                <Input
                  className={ReactUtils.joinClassNames('w-full', appStore.status.isError(AppStatusKey.DECRYPT_TEXT) && '!border-red-600')}
                  label='text to decrypt'
                  onChange={() => appStore.decryptText()}
                  path='toDecrypt'
                  placeholder='ex. long_alphanumerical_string'
                  store={appStore.data.text}
                />
                <TextArea rows={10} label='decrypted text' path='decrypted' placeholder='ex. supersecret_stuff' store={appStore.data.text} readOnly />
              </Fragment>
            )}
          </Fragment>
        )}
        {appStore.isModeDecryption && (
          <div className='flex flex-col items-center p-6 space-y-6 text-xs text-center'>
            <a className='break-all transition duration-200 hover:opacity-50 active:opacity-100' href={appStore.linkToEncrypt} target='_blank'>
              {appStore.linkToEncrypt}
            </a>
            <IconArrowUp className='animate-bounce' color='text-white' />
            <span>Share the link above for quick encryption.</span>
          </div>
        )}
        {appStore.isModeEncryption && (
          <Fragment>
            <TextArea
              onChange={() => appStore.encryptText()}
              rows={10}
              label='text to encrypt'
              path='toEncrypt'
              placeholder='ex. supersecret_stuff'
              store={appStore.data.text}
            />
            <Input
              label='encrypted text'
              onClick={onClickEncryptedText}
              path='encrypted'
              placeholder='ex. long_alphanumerical_string'
              store={appStore.data.text}
              readOnly
            />
            {appStore.status.isSuccess(AppStatusKey.ENCRYPT_TEXT) && (
              <div className='flex flex-col items-center p-6 space-y-6 text-xs text-center'>
                <a className='break-all transition duration-200 hover:opacity-50 active:opacity-100' href={appStore.linkToDecrypt} target='_blank'>
                  {appStore.linkToDecrypt}
                </a>
                <IconArrowUp className='animate-bounce' color='text-white' />
                <span>Share the link above for quick decryption.</span>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
})
