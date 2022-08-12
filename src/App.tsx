import { PromiseUtils } from '@queelag/core'
import { ReactUtils } from '@queelag/react-core'
import { IconArrowUp } from '@queelag/react-feather-icons'
import { useWhen } from '@queelag/state-manager-react'
import React, { Fragment, useEffect, useState } from 'react'
import { Alert } from './components/Alert'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Loading } from './components/Loading'
import { TextArea } from './components/TextArea'
import { AppMode, AppStatusKey } from './definitions/enums'
import { appStore } from './stores/app.store'

export function App() {
  const [loading, setLoading] = useState(true)

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
          appStore.data.iv = iv
          appStore.data.mode = AppMode.ENCRYPTION
          appStore.data.receiver.rawPublicKey = receiverRawPublicKey

          if (textToDecrypt) {
            appStore.data.mode = AppMode.DECRYPTION
            appStore.data.text.toDecrypt = textToDecrypt
          }

          return appStore.initializeCipher()
        }
      },
      async () => appStore.isModeDecryption && appStore.decryptText()
    )
  }, [])

  useWhen(
    () => appStore.status.isSuccess(AppStatusKey.INITIALIZE),
    () => setLoading(false)
  )

  if (loading) {
    return <Loading />
  }

  const onClickIV = () => {
    window.navigator.clipboard.writeText(appStore.data.iv)

    appStore.status.idle(AppStatusKey.COPIED_ENCRYPTED_TEXT)
    appStore.status.idle(AppStatusKey.COPIED_PUBLIC_KEY)
    appStore.status.success(AppStatusKey.COPIED_IV)

    window.scrollTo({ top: 0 })
  }

  const onClickPublicKey = () => {
    window.navigator.clipboard.writeText(appStore.data.keyPair.raw.public)

    appStore.status.idle(AppStatusKey.COPIED_ENCRYPTED_TEXT)
    appStore.status.idle(AppStatusKey.COPIED_IV)
    appStore.status.success(AppStatusKey.COPIED_PUBLIC_KEY)

    window.scrollTo({ top: 0 })
  }

  const onClickEncryptedText = () => {
    window.navigator.clipboard.writeText(appStore.data.text.encrypted)

    appStore.status.idle(AppStatusKey.COPIED_PUBLIC_KEY)
    appStore.status.idle(AppStatusKey.COPIED_IV)
    appStore.status.success(AppStatusKey.COPIED_ENCRYPTED_TEXT)

    window.scrollTo({ top: 0 })
  }

  return (
    <Fragment>
      <Header />
      <div className='max-w-screen-lg mx-auto flex flex-col p-6 pb-96 space-y-6'>
        {appStore.status.isSuccess(AppStatusKey.COPIED_ENCRYPTED_TEXT) && (
          <Alert>The encrypted text has been copied to the clipboard, it is safe to share it anywhere.</Alert>
        )}
        {appStore.status.isSuccess(AppStatusKey.COPIED_IV) && (
          <Alert>The initialization vector has been copied to the clipboard, it is safe to share it anywhere.</Alert>
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
        {appStore.hasIV && (
          <Input label='initialization vector' onClick={onClickIV} path='iv' placeholder='ex. long_alphanumerical_string' store={appStore.data} readOnly />
        )}
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
    </Fragment>
  )
}
