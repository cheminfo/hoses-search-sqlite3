import { create } from 'domain';
import { xHistogram, createStepArray } from 'ml-spectra-processing';

export function getGlobalStats(stats) {

  const globalStats = {};
  for (const key in stats) {
    const spheresStats = []
    globalStats[key] = { key, spheres: spheresStats }
    for (const stat of Object.values(stats[key])) {
      const atomLabel = stat.sources[0].atomLabel;
      let currentSphereStats = spheresStats.filter(stats => stats.sphere === stat.sphere && stats.atomLabel === atomLabel)[0];
      if (!currentSphereStats) {
        currentSphereStats = { sphere: stat.sphere, atomLabel: atomLabel, min: stat.boxplot.min, max: stat.boxplot.max, diffs: [], values: [], medians: [] };
        spheresStats.push(currentSphereStats);
      }
      const min = stat.boxplot.min
      const max = stat.boxplot.max
      if (max && min) {
        currentSphereStats.diffs.push(stat.boxplot.max - stat.boxplot.min);
        currentSphereStats.medians.push(stat.boxplot.median);
      }
      currentSphereStats.values.push(...stat.values.filter(value => value && !isNaN(value)))
    }
    for (const currentSphereStats of spheresStats) {
      currentSphereStats.min = Math.min(...currentSphereStats.values)
      currentSphereStats.max = Math.max(...currentSphereStats.values)
      if (currentSphereStats.diffs.length > 0) {
        currentSphereStats.diffsHistogram = xHistogram(currentSphereStats.diffs, { min: -0.1, max: 10.1, nbSlots: 51 });
      }
      if (currentSphereStats.medians.length > 0) {
        currentSphereStats.mediansHistogram = getHistogramMedians(currentSphereStats.medians, currentSphereStats.min, currentSphereStats.max);
      }
    }
    spheresStats.sort((a, b) => {
      if (a.atomLabel !== b.atomLabel) {
        return a.atomLabel.localeCompare(b.atomLabel);
      }
      return a.sphere - b.sphere;
    })
  }
  return globalStats;
}

function getHistogramMedians(medians, min, max) {
  min = Math.floor(min * 10) / 10
  max = Math.ceil(max * 10) / 10
  const step = 0.1
  const nbSlots = Math.floor((max - min) / step) + 1;
  const xs = createStepArray({ from: min, step, length: nbSlots })
  const ys = new Array(nbSlots).fill(0)
  return xHistogram(medians, { histogram: { x: xs, y: ys } })
}