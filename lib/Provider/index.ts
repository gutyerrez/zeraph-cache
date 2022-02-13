import { IProvider } from '@vyrnn/zeraph-provider'

import { ICache } from '../Cache'

export class CacheProvider<T extends ICache> implements IProvider<T> {
  private provider!: T

  constructor(
    Cache: { new(): T }
  ) { this.provider = new Cache() }

  prepare = (): void => {
    const { populate } = this.provider

    populate?.call(this.provider)
  }

  provide = (): T => this.provider
}
