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

  test(
    'use of this',
    marbles(m => {
      const source = m.hot('     --350204-5-|');
      const expected = m.hot('   -----a-----(b|)', {
        a: ['3', '5', '0'],
        b: ['2', '0', '4', '5'],
      });

      const customThis = {
        val: '2',
      };

      function predicate(value: string) {
        return value === this.val;
      }

      const destination = source.pipe(splitIf(predicate, customThis));
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'split by index',
    marbles(m => {
      const source = m.hot('     --35180-4-5-|');
      const expected = m.hot('   ----a-b---c-(d|)', {
        a: ['3', '5'],
        b: ['1', '8'],
        c: ['0', '4'],
        d: ['5'],
      });

      const destination = source.pipe(
        splitIf((_: any, i: number) => i % 2 === 0)
      );
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'source observable throws',
    marbles(m => {
      const source = m.cold('     --350-#321');
      const expected = m.cold('   ----a-#', {a: ['3', '5']});

      const destination = source.pipe(splitIf(isZero));
      m.expect(destination).toBeObservable(expected);
    })
  );

  test(
    'predicate throws',
    marbles(m => {
      const source = m.cold('     --35021');
      const expected = m.cold(
        '   ----a#',
        {a: ['3', '5']},
        {name: 'Error', message: 'predicate err'}
      );

      let count = 0;
      const predicate = function (x: string) {
        count++;
        if (count === 4) {
          throw new Error('predicate err');
        }
        return isZero(x);
      };

      const destination = source.pipe(splitIf(predicate));
      m.expect(destination).toBeObservable(expected);
    })
  );
});
