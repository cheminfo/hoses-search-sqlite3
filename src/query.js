import { getDB } from './db/getDB.js';

const db = getDB();
const stmt = db.prepare(`
SELECT count(*)
FROM molecules 
WHERE 
  ssIndex0 > @ssIndex0 AND
  ssIndex1 != @ssIndex1 AND
  ssIndex2 != @ssIndex2 AND
  ssIndex3 > @ssIndex3 AND
  ssIndex4 != @ssIndex4 AND
  ssIndex5 > @ssIndex5 AND
  ssIndex6 != @ssIndex6 AND
  ssIndex7 != @ssIndex7
`);

const data1 = {
  ssIndex0: 10000,
  ssIndex1: 16777216,
  ssIndex2: 15000,
  ssIndex3: 20000,
  ssIndex4: 536870912,
  ssIndex5: 30000,
  ssIndex6: 262144,
  ssIndex7: 80000,
};

const data2 = {
  ssIndex0: 918734323983581184n,
  ssIndex1: 4107282860161892352n,
  ssIndex2: -180143985094819840n,
  ssIndex3: -2107684625609392128n,
  ssIndex4: 31525197391593472n,
  ssIndex5: -36028797018963968n,
  ssIndex6: 1008806316530991104n,
  ssIndex7: -549439154539200512n,
};

const data3 = {
  ssIndex0: 20,
  ssIndex1: 10,
  ssIndex2: 840n,
  ssIndex3: 0n,
  ssIndex4: 784n,
  ssIndex5: 0,
  ssIndex6: 0,
  ssIndex7: 0,
};

console.time('query');
const result = stmt.all(data2);
console.log(result);
console.timeEnd('query');

console.time('query2');
const result2 = stmt.all(data2);
console.log(result2);
console.timeEnd('query2');
