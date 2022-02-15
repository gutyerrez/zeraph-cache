import { LoadingCache } from '../LoadingCache';

export class CacheBuilder {
  public static newBuider = <K, V>(): LoadingCache<K, V> => new LoadingCache<K, V>();
}
