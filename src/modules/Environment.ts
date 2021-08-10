export class Environment {
  static get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  static get isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }
}
