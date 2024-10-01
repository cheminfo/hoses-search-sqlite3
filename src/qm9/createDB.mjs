

import { readFileSync, writeFileSync } from 'fs';
import { xBoxPlot, xHistogram } from 'ml-spectra-processing';
import { elementRanges } from './utils/elementRanges.mjs';
import { createSpheres } from './utils/createSpheres.mjs';
import { getDensities } from './utils/getDensities.mjs';
import { getEntries } from './utils/getEntries.mjs';
import { getGlobalStats } from './utils/getGlobalStats.mjs';

const statsKeys = ["gw",
  "dksCharged",
  "dksNeutral",
  "cm5",
  "mulliken",
]

const stats = {};
console.log('Loading densities')
const densities = await getDensities(readFileSync(new URL('QM9_mulliken_CM5_electron_density.txt', import.meta.url), 'utf8'), { maxSphereSize: 2 });
console.log('Loading entries')
const entriesQM9 = await getEntries(readFileSync(new URL('qm9.xyz', import.meta.url), 'utf8'), { maxSphereSize: 2, stats, densities, statsKeys });

appendBoxplot(stats, statsKeys);

const globalStats = getGlobalStats(stats);

const statsAsArrays = {};
for (const key of statsKeys) {
  statsAsArrays[key] = Object.values(stats[key]);
}

const spheres = {};
for (const key of statsKeys) {
  spheres[key] = createSpheres(stats[key]);
}

writeFileSync(new URL('../../src/data/qm9.json', import.meta.url), stringify({
  entries: entriesQM9, stats: statsAsArrays, spheres, globalStats, statsKeys: statsKeys.map(key => ({ key }))
}))

// we kee only gw in the js file
writeFileSync(new URL('../../src/data/qm9.js', import.meta.url), 'export const qm9=' + stringify({
  //  entries: entriesQM9, stats: statsAsArrays, spheres, globalStats, statsKeys: statsKeys.map(key => ({ key }))
  spheres: { gw: spheres.gw }
}))

function stringify(object) {
  return JSON.stringify(
    object,
    (key, value) =>
      ArrayBuffer.isView(value) ? Array.from(value) : value,
  );
}

function appendBoxplot(stats, statsKeys) {
  for (const key of statsKeys) {
    for (const hose in stats[key]) {
      const atomLabel = stats[key][hose].sources[0].atomLabel;
      const values = stats[key][hose].sources.map(source => source.value);
      stats[key][hose].values = values
      stats[key][hose].nbValues = stats[key][hose].values.length;
      stats[key][hose].boxplot = xBoxPlot(stats[key][hose].values, { allowSmallArray: true });
      stats[key][hose].histogram = xHistogram(stats[key][hose].values, elementRanges[atomLabel]);
    }
  }
}




