import { AppMode } from '../definitions/enums'
import { AppData } from '../definitions/interfaces'

export class Dummy {
  static get appData(): AppData {
    return {
      derivedKey: {} as CryptoKey,
      iv: '',
      keyPair: {
        crypto: {} as CryptoKeyPair,
        raw: {
          private: '',
          public: ''
        }
      },
      mode: AppMode.DECRYPTION,
      receiver: {
        publicKey: {} as CryptoKey,
        rawPublicKey: ''
      },
      text: {
        decrypted: '',
        encrypted: '',
        toDecrypt: '',
        toEncrypt: ''
      }
    }
  }
}
