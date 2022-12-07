import {Observable, OperatorFunction} from 'rxjs';

/**
 * Packs all the source Observable values into arrays. New array is emitted every time a predicate is fulfilled.
 *
 * @example
 * ```js
  const src = from([4, 8, 1, 3, 5, 1, 1, 6, 8]).pipe(splitIf(x => x === 1));
  const res = [];
  src.subscribe(x => res.push(x));
  console.log(res);
  //=> [ [ 4, 8 ], [ 1, 3, 5 ], [ 1 ], [ 1, 6, 8 ] ]
 * ```
 * @template T The type of Observable's value.
 * @param predicate {(value: T, index: number) => boolean} A function that evaluates each value emitted by the source Observable. If it returns `true`, a new array of previous 'buffered' values is emitted. The index parameter is the number i for the i-th source emission that has happened since the subscription, starting from the number 0.
 * @param thisArg {any}  Optional. Default is undefined. An optional argument to determine the value of this in the predicate function.
 * @returns A function that returns an Observable that emits arrays of all items from the source Observable. These arrays are emitted every time a predicate is fulfilled.
 */
export function splitIf<T>(
  predicate: (value: T, index: number) => boolean,
  thisArg?: any
): OperatorFunction<T, T[]> {
  let buffer: T[] = [];
  let index = 0;
  return (source: Observable<T>) => {
    return new Observable<T[]>(observer => {
      const subscription = source.subscribe({
        next(value) {
          try {
            if (predicate.call(thisArg, value, index++) && buffer.length > 0) {
              observer.next(buffer);
              buffer = [];
            }
            buffer.push(value);
          } catch (e) {
            observer.error(e);
          }
        },
        error: (e: any) => observer.error(e),
        complete() {
          if (buffer.length > 0) {
            observer.next(buffer);
          }
          observer.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}
