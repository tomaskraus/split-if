"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const splitif_1 = require("../src/splitif");
const partitionN = (n) => (0, splitif_1.splitIf)((_, i) => i % n === 0);
const src = (0, rxjs_1.from)([4, 8, 1, 3, 5, 4, 1, 6, 8, -1, 2]).pipe(partitionN(3));
const res = [];
src.subscribe((x) => res.push(x));
console.log(res);
//=> [ [ 4, 8, 1 ], [ 3, 5, 4 ], [ 1, 6, 8 ], [ -1, 2 ] ]
//# sourceMappingURL=example.js.map