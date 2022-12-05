"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_marbles_1 = require("rxjs-marbles");
const splitif_1 = require("../src/splitif");
describe('splitIf', () => {
    function isZero(x) {
        return +x === 0;
    }
    test('empty', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('     ----|');
        const expected = m.hot('   ----|');
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
    }));
    test('no split points', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('      -1-^---6-3-4|');
        const subs = '                 ^--------!';
        const expected = m.hot('       ---------(r|)', { r: ['6', '3', '4'] });
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
        m.expect(source).toHaveSubscriptions(subs);
    }));
    test('split at start', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('     ----0-6-|');
        const expected = m.hot('   --------(r|)', { r: ['0', '6'] });
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
    }));
    test('split at end', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('     2-0-|');
        const expected = m.hot('   --a-(b|)', { a: ['2'], b: ['0'] });
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
    }));
    test('more split points', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('     --350204-5-|');
        const expected = m.hot('   ----a-b----(c|)', {
            a: ['3', '5'],
            b: ['0', '2'],
            c: ['0', '4', '5'],
        });
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
    }));
    test('split by index', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.hot('     --35180-4-5-|');
        const expected = m.hot('   ----a-b---c-(d|)', {
            a: ['3', '5'],
            b: ['1', '8'],
            c: ['0', '4'],
            d: ['5'],
        });
        const destination = source.pipe((0, splitif_1.splitIf)((_, i) => i % 2 === 0));
        m.expect(destination).toBeObservable(expected);
    }));
    test('source observable throws', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.cold('     --350-#321');
        const expected = m.cold('   ----a-#', { a: ['3', '5'] });
        const destination = source.pipe((0, splitif_1.splitIf)(isZero));
        m.expect(destination).toBeObservable(expected);
    }));
    test('predicate throws', (0, rxjs_marbles_1.marbles)(m => {
        const source = m.cold('     --35021');
        const expected = m.cold('   ----a#', { a: ['3', '5'] }, { name: 'Error', message: 'predicate err' });
        let count = 0;
        const predicate = function (x) {
            count++;
            if (count === 4) {
                throw new Error('predicate err');
            }
            return isZero(x);
        };
        const destination = source.pipe((0, splitif_1.splitIf)(predicate));
        m.expect(destination).toBeObservable(expected);
    }));
});
//# sourceMappingURL=splitif.test.js.map