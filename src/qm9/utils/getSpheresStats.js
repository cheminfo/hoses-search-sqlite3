import { xHistogram } from 'ml-spectra-processing';

export function getSpheresStats(stats) {
  const sphereStats = {};
  for (const key in stats) {
    const spheres = [];
    sphereStats[key] = { key, spheres };
    for (const stat of Object.values(stats[key])) {
      const atomLabel = stat.sources[0].atomLabel;
      let currentStats = spheres.filter(
        (stats) =>
          stats.sphere === stat.sphere && stats.atomLabel === atomLabel,
      )[0];
      if (!currentStats) {
        currentStats = {
          sphere: stat.sphere,
          atomLabel: atomLabel,
          min: stat.boxplot.min,
          max: stat.boxplot.max,
          diffs: [],
        };
        spheres.push(currentStats);
      }

      currentStats.min = Math.min(currentStats.min, stat.boxplot.min);
      currentStats.max = Math.max(currentStats.max, stat.boxplot.max);
      currentStats.diffs.push(stat.boxplot.max - stat.boxplot.min);
    }
    for (const sphere of spheres) {
      sphere.diffsHistogram = xHistogram(sphere.diffs, {
        min: -0.1,
        max: 10.1,
        nbSlots: 51,
      });
    }
  }

  return sphereStats;
}
