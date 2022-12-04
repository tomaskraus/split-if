const {from} = require('rxjs');
// const {splitIf} = require('splitif');

const {splitIf} = require('../build/src/splitif');

// const evenValueOnEvenIndex = (val, index) => val % 2 === 0 && index % 2 === 0;
{
  const src = from([4, 8, 1, 3, 5, 1, 1, 6, 8]).pipe(splitIf(x => x === 1));
  const res = [];
  src.subscribe(x => res.push(x));
  console.log(res);
  //=> [ [ 4, 8 ], [ 1, 3, 5 ], [ 1 ], [ 1, 6, 8 ] ]
}

{
  const src = from([]).pipe(splitIf(x => x === 1));
  const res = [];
  src.subscribe(x => res.push(x));
  console.log(res);
}

{
  const src = from([]).pipe(splitIf(x => x === 1));
  const res = [2, 3];
  src.subscribe(x => res.push(x));
  console.log(res);
}

{
  const partitionN = n => splitIf((_, i) => i % n === 0);
  const src = from([4, 8, 1, 3, 5, 4, 1, 6, 8, -1, 2]).pipe(partitionN(3));
  const res = [];
  src.subscribe(x => res.push(x));
  console.log(res);
  //=> [ [ 4, 8, 1 ], [ 3, 5, 4 ], [ 1, 6, 8 ], [ -1, 2 ] ]
}
