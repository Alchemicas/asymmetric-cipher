import { AppMode } from './enums'

export interface AppData {
  derivedKey: CryptoKey
  iv: string
  keyPair: {
    crypto: CryptoKeyPair
    raw: {
      private: string
      public: string
    }
  }
  mode: AppMode
  receiver: {
    publicKey: CryptoKey
    rawPublicKey: string
  }
  text: {
    decrypted: string
    encrypted: string
    toDecrypt: string
    toEncrypt: string
  }
}
