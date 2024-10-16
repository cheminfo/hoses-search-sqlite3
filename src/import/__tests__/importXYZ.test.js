import { test, expect } from 'vitest';
import { importXYZ } from '../importXYZ.js';

test('importXYZ', async () => {
  const entries = await importXYZ(
    new URL('./data/test.xyz', import.meta.url).pathname,
  );
  expect(entries).toMatchSnapshot();
});
