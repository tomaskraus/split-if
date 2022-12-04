import {from} from 'rxjs';
import {OperatorFunction} from 'rxjs';

import {splitIf} from '../src/splitif';

const partitionN = <T>(n: number): OperatorFunction<T, T[]> =>
  splitIf((_: T, i: number) => i % n === 0);

const src = from([4, 8, 1, 3, 5, 4, 1, 6, 8, -1, 2]).pipe(partitionN(3));
const res: number[][] = [];
src.subscribe((x: number[]) => res.push(x));
console.log(res);
//=> [ [ 4, 8, 1 ], [ 3, 5, 4 ], [ 1, 6, 8 ], [ -1, 2 ] ]
