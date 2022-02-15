import { TimeUnit } from '@vyrnn/zeraph-util';

export class LoadingCache<K, V> {
  protected milliseconds = -1;

  expireAfterWrite = (
    time: number,
    unit: TimeUnit = TimeUnit.SECONDS,
  ): LoadingCache<K, V> => {
    this.milliseconds = time * unit.duration;

    return this;
  };

  build = (fetcher: (key: K) => Promise<V | undefined>) => new Cache<K, V>(
    fetcher,
    this.milliseconds,
  );
}

export interface ICache<K, V> {
  key: K;
  value: V;
  timer?: NodeJS.Timer;
}

class Cache<K, V> {
  private populated: ICache<K, V>[] = [];

  private fetcher!: (key: K) => Promise<V | undefined>;
  private milliseconds = -1;

  constructor(
    fetcher: (key: K) => Promise<V | undefined>,
    milliseconds = -1,
  ) {
    this.fetcher = fetcher;
    this.milliseconds = milliseconds;
  }

  fetchBy = async (key: K): Promise<V | undefined> => {
    try {
      let founded = this.populated.find((cached) => cached.key === key)?.value;

      if (founded) {
        return founded;
      }

      founded = await this.fetcher(key);

      if (founded) {
        this.populated.push({
          key,
          value: founded,
          timer: this.milliseconds >= 1 ? setTimeout(() => {
            this.invalidate(key);
          }, this.milliseconds) : undefined,
        });

        return founded;
      }
    } catch (e) {
      console.error(e);
    }

    return undefined;
  };

  invalidate = (key: K) => {
    this.populated = this.populated.filter((cached) => cached.key !== key);
  };
}
