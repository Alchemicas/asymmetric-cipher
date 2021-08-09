import { Base64, Logger, tc, tcp } from '@queelag/core'

export class Crypto {
  static decoder: TextDecoder = new TextDecoder()
  static encoder: TextEncoder = new TextEncoder()

  static async deriveAESKeyFromPair(prk: CryptoKey, puk: CryptoKey): Promise<CryptoKey | Error> {
    let key: CryptoKey | Error

    key = await tcp(() => window.crypto.subtle.deriveKey({ name: 'ECDH', public: puk }, prk, { name: 'AES-GCM', length: 256 }, false, ['decrypt', 'encrypt']))
    if (key instanceof Error) return key

    Logger.debug('Crypto', 'deriveAESKeyFromPair', `The key has been derived from the pair.`, key, prk, puk)

    return key
  }

  static async decrypt(key: CryptoKey, iv: string, encrypted: string): Promise<string | Error> {
    let decrypted: ArrayBuffer | Error

    decrypted = await tcp(() => window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: Base64.decode(iv), length: 256 }, key, Base64.decode(encrypted)))
    if (decrypted instanceof Error) return decrypted

    return this.decoder.decode(decrypted)
  }

  static async encrypt(key: CryptoKey, iv: string, text: string): Promise<string | Error> {
    let encrypted: ArrayBuffer | Error

    encrypted = await tcp(() => window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: Base64.decode(iv), length: 256 }, key, this.encoder.encode(text)))
    if (encrypted instanceof Error) return encrypted

    return Base64.encode(encrypted)
  }

  static async exportKey(key: CryptoKey): Promise<string | Error> {
    let jwk: JsonWebKey | Error

    jwk = await tcp(() => window.crypto.subtle.exportKey('jwk', key))
    if (jwk instanceof Error) return jwk

    Logger.debug('Crypto', 'exportKey', `The key has been exported.`, key, jwk)

    return Base64.encode(this.encoder.encode(JSON.stringify(jwk)))
  }

  static async generateECDHKeyPair(): Promise<CryptoKeyPair | Error> {
    let pair: CryptoKeyPair | Error

    pair = await tcp(() =>
      window.crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-521'
        },
        true,
        ['deriveKey']
      )
    )
    if (pair instanceof Error) return pair

    Logger.debug('Crypto', 'generateKeyPair', `The key pair has been generated.`, pair)

    return pair
  }

  static async hash(string: string): Promise<string | Error> {
    let hash: ArrayBuffer | Error

    hash = await tcp(() => window.crypto.subtle.digest('SHA-512', this.encoder.encode(string)))
    if (hash instanceof Error) return hash

    return Base64.encode(hash)
  }

  static async importECDHKey(base64JWK: string): Promise<CryptoKey | Error> {
    let jwk: JsonWebKey | Error, key: CryptoKey | Error

    jwk = await tc(() => JSON.parse(this.decoder.decode(Base64.decode(base64JWK))))
    if (jwk instanceof Error) return jwk

    key = await tcp(() =>
      window.crypto.subtle.importKey(
        'jwk',
        jwk as JsonWebKey,
        { name: 'ECDH', namedCurve: (jwk as JsonWebKey).crv },
        true,
        (jwk as JsonWebKey).key_ops as KeyUsage[]
      )
    )
    if (key instanceof Error) return key

    Logger.debug('Crypto', 'importECDHKey', `The key has been imported.`, jwk, key)

    return key
  }

  static get randomIV(): string {
    return Base64.encode(window.crypto.getRandomValues(new Uint8Array(32)))
  }
}
