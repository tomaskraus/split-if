import {marbles} from 'rxjs-marbles';

import {splitIf} from '../src/splitif';

describe('splitIf', () => {
  function isZero(x: number | string) {
    return +x === 0;
  }

  test(
    'empty',
    marbles(m => {
      const source = m.hot('     ----|');
      const expected = m.hot('   ----|');

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'no split points',
    marbles(m => {
      const source = m.hot('      -1-^---6-3-4|');
      const subs = '                 ^--------!';
      const expected = m.hot('       ---------(r|)', {r: ['6', '3', '4']});

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  test(
    'split at start',
    marbles(m => {
      const source = m.hot('     ----0-6-|');
      const expected = m.hot('   --------(r|)', {r: ['0', '6']});

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'split at end',
    marbles(m => {
      const source = m.hot('     2-0-|');
      const expected = m.hot('   --a-(b|)', {a: ['2'], b: ['0']});

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'more split points',
    marbles(m => {
      const source = m.hot('     --350204-5-|');
      const expected = m.hot('   ----a-b----(c|)', {
        a: ['3', '5'],
        b: ['0', '2'],
        c: ['0', '4', '5'],
      });

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
    })
  );
});
