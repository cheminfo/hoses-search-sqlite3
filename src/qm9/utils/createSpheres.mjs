export function createSpheres(stats) {
  const spheres = [];
  for (const stat of Object.values(stats)) {
    if (!spheres[stat.sphere]) {
      spheres[stat.sphere] = { sphere: stat.sphere, hoses: {} };
    }
    spheres[stat.sphere].hoses[stat.idCode] = {
      sphere: stat.sphere,
      boxplot: stat.boxplot,
      idCode: stat.idCode,
      nbValues: stat.nbValues,
    };
  }
  return spheres;
}
