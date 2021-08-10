import { Cookie, Logger, QueryParametersUtils, rc, Status, URLUtils } from '@queelag/core'
import { makeObservable, observable } from 'mobx'
import { AppMode, AppStatusKey, CookieName } from '../definitions/enums'
import { AppData } from '../definitions/interfaces'
import { Crypto } from '../modules/Crypto'
import { Dummy } from '../modules/Dummy'

class AppStore {
  data: AppData
  status: Status

  constructor() {
    this.data = Dummy.appData
    this.status = new Status()

    makeObservable(this, { data: observable })
    makeObservable(this.status, { data: observable })
  }

  async initialize(): Promise<boolean> {
    let keyPair: CryptoKeyPair | Error, rawPrivateKey: string | Error, rawPublicKey: string | Error

    this.status.idle(AppStatusKey.INITIALIZE)

    Cookie.get(CookieName.APP, this.data.keyPair.raw)

    if (this.data.keyPair.raw.private && this.data.keyPair.raw.public) {
      let privateKey: CryptoKey | Error, publicKey: CryptoKey | Error

      privateKey = await Crypto.importECDHKey(this.data.keyPair.raw.private)
      if (privateKey instanceof Error) return false

      publicKey = await Crypto.importECDHKey(this.data.keyPair.raw.public)
      if (publicKey instanceof Error) return false

      this.data.iv = Crypto.randomIV
      this.data.keyPair.crypto = {
        privateKey,
        publicKey
      }

      Logger.debug('AppStore', 'initialize', `The iv has been generated and the key pair has been imported.`, this.data.iv, this.data.keyPair.crypto)

      this.status.success(AppStatusKey.INITIALIZE)

      return true
    }

    keyPair = await Crypto.generateECDHKeyPair()
    if (keyPair instanceof Error) return false

    rawPrivateKey = await Crypto.exportKey(keyPair.privateKey)
    if (rawPrivateKey instanceof Error) return false

    rawPublicKey = await Crypto.exportKey(keyPair.publicKey)
    if (rawPublicKey instanceof Error) return false

    this.data.keyPair.crypto = keyPair
    this.data.iv = Crypto.randomIV
    this.data.keyPair.raw.private = rawPrivateKey
    this.data.keyPair.raw.public = rawPublicKey

    Logger.debug(
      'AppStore',
      'initialize',
      `The iv and key pair have been generated, private and public keys have been exported.`,
      keyPair,
      this.data.iv,
      rawPrivateKey,
      rawPublicKey
    )

    Cookie.set(CookieName.APP, this.data.keyPair.raw, undefined, { domain: 'alchemicas.github.io', sameSite: 'strict', secure: true })

    this.status.success(AppStatusKey.INITIALIZE)

    return true
  }

  async initializeCipher(): Promise<boolean> {
    let receiverPublicKey: CryptoKey | Error, derivedKey: CryptoKey | Error

    this.status.idle(AppStatusKey.INITIALIZE_CIPHER)

    receiverPublicKey = await Crypto.importECDHKey(this.data.receiver.rawPublicKey)
    if (receiverPublicKey instanceof Error) return false

    derivedKey = await Crypto.deriveAESKeyFromPair(this.data.keyPair.crypto.privateKey, receiverPublicKey)
    if (derivedKey instanceof Error) return false

    this.data.derivedKey = derivedKey
    this.data.receiver.publicKey = receiverPublicKey

    Logger.debug('AppStore', 'initializeCipher', `The receiver public key has been imported and the AES key has been derived.`, derivedKey, receiverPublicKey)

    this.status.success(AppStatusKey.INITIALIZE_CIPHER)

    return true
  }

  async decryptText(): Promise<boolean> {
    let decrypted: string | Error

    this.status.pending(AppStatusKey.DECRYPT_TEXT)

    decrypted = await Crypto.decrypt(this.data.derivedKey, this.data.iv, this.data.text.toDecrypt)
    if (decrypted instanceof Error) return rc(() => this.status.error(AppStatusKey.DECRYPT_TEXT), false)

    this.data.text.decrypted = decrypted
    Logger.debug('AppStore', 'decryptText', `The text has been decrypted.`, decrypted)

    this.status.success(AppStatusKey.DECRYPT_TEXT)

    return true
  }

  async encryptText(): Promise<boolean> {
    let encrypted: string | Error

    this.status.pending(AppStatusKey.ENCRYPT_TEXT)

    encrypted = await Crypto.encrypt(this.data.derivedKey, this.data.iv, this.data.text.toEncrypt)
    if (encrypted instanceof Error) return rc(() => this.status.error(AppStatusKey.ENCRYPT_TEXT), false)

    this.data.text.encrypted = encrypted
    Logger.debug('AppStore', 'encryptText', `The text has been encrypted.`, encrypted)

    this.status.success(AppStatusKey.ENCRYPT_TEXT)

    return true
  }

  get linkToDecrypt(): string {
    return URLUtils.appendSearchParams(
      URLUtils.concat(window.location.origin, window.location.pathname),
      QueryParametersUtils.toString({
        iv: this.data.iv,
        rrpuk: this.data.keyPair.raw.public,
        ttd: this.data.text.encrypted
      })
    )
  }

  get linkToEncrypt(): string {
    return URLUtils.appendSearchParams(
      URLUtils.concat(window.location.origin, window.location.pathname),
      QueryParametersUtils.toString({
        iv: this.data.iv,
        rrpuk: this.data.keyPair.raw.public
      })
    )
  }

  get hasIV(): boolean {
    return this.data.iv.length > 0
  }

  get hasIVAndReceiverPublicKey(): boolean {
    return this.hasIV && this.data.receiver.rawPublicKey.length > 0
  }

  get isModeDecryption(): boolean {
    return this.data.mode === AppMode.DECRYPTION
  }

  get isModeEncryption(): boolean {
    return this.data.mode === AppMode.ENCRYPTION
  }
}

export const appStore = new AppStore()
