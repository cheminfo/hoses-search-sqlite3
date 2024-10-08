import { test } from 'vitest'
import { getGlobalStats } from '../getGlobalStats.js';
import { readFileSync } from 'fs';

test('getGlobalStats', () => {
  const data = JSON.parse(readFileSync(new URL('../../../../src/data/qm9.json', import.meta.url), 'utf8'));

  getGlobalStats(data.stats);

})