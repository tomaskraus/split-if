[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

# split-if

Packs all the RxJS source Observable values into arrays. These arrays are emitted every time a predicate is fulfilled.

### Examples

#### Example 1 (split by value)

```js
const {from} = require('rxjs');
const {splitIf} = require('splitif');

const src = from([4, 8, 1, 3, 5, 1, 1, 6, 8]).pipe(splitIf(x => x === 1));
const res = [];
src.subscribe(x => res.push(x));
console.log(res);
//=> [ [ 4, 8 ], [ 1, 3, 5 ], [ 1 ], [ 1, 6, 8 ] ]
```

#### Example 2 (split by index)

We can easily make a `partitionN` RxJS operator using `splitIf`:

```ts
import {OperatorFunction} from 'rxjs';
import {splitIf} from 'splitif';

const partitionN = <T>(n: number): OperatorFunction<T, T[]> =>
  splitIf((_: T, i: number) => i % n === 0);
```

Let's use it:

```ts
import {from} from 'rxjs';

const src = from([4, 8, 1, 3, 5, 4, 1, 6, 8, -1, 2]).pipe(partitionN(3));
const res: number[][] = [];
src.subscribe((x: number[]) => res.push(x));
console.log(res);
//=> [ [ 4, 8, 1 ], [ 3, 5, 4 ], [ 1, 6, 8 ], [ -1, 2 ] ]
```

## Why to use

- Typed. With `d.ts` for Javascript.
- Well tested. 100% code coverage.

## Installation

```bash
$ npm install split-if
```

## Usage

Typescript / ES module:

```ts
import {splitIf} from 'split-if';
```

Javascript / CommonJS:

```js
const {splitIf} = require('split-if');
```

## API

```ts
function splitIf<T>(
  predicate: (value: T, index: number) => boolean,
  thisArg?: any
): OperatorFunction<T, T[]>;
```

Where its `OperatorFunction<T, T[]>` can be substituted for:

```ts
(source: Observable<T>) => Observable<T[]>;
```

**See**: RxJS [OperatorFunction](https://rxjs.dev/api/index/interface/OperatorFunction)

### Parameters

|           |                                        |                                                                                                                                                                                                                                                                                             |
| --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T         | {any}                                  | The type of Observable's value.                                                                                                                                                                                                                                                             |
| predicate | {(value: T, index: number) => boolean} | A function that evaluates each value emitted by the source `Observable`. If it returns `true`, a new array of previous 'buffered' values is emitted. The index parameter is the number i for the i-th source emission that has happened since the subscription, starting from the number 0. |
| thisArg   | {any}                                  | Optional. Default is undefined. An optional argument to determine the value of this in the predicate function.                                                                                                                                                                              |

### Returns

A function that returns an `Observable` that emits arrays of all items from the source Observable. These arrays are emitted every time a predicate is fulfilled.
