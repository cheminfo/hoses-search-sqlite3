import md5 from 'md5';
import { existsSync, readFileSync, write, writeFileSync } from 'fs';
import { join } from 'path';
const baseDir = new URL('../molfileCache', import.meta.url).pathname;

export async function convertXYZToMolfile(xyz) {
  const hash = md5(xyz);
  if (existsSync(join(baseDir, hash))) {
    return readFileSync(join(baseDir, hash), 'utf8');
  }

  const formData = new FormData();

  formData.append('input', xyz);
  formData.append('inputFormat', 'xyz');
  formData.append('outputFormat', 'mol');

  const response = await fetch('https://openbabel.cheminfo.org/v1/convert', {
    body: formData,
    method: 'POST',
  });
  const molfile = JSON.parse(await response.text()).result;
  console.log(molfile);
  writeFileSync(join(baseDir, hash), molfile, 'utf8');
  return molfile;
}

/*
const xyz = `5
Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"
C        5.02975104       5.59520017       5.38737141     290.59910000              nan     285.84400000
H        5.04461553       4.50000000       5.38133262              nan              nan              nan
H        6.05732741       5.97433493       5.37961885              nan              nan              nan
H        4.50000000       5.95804208       4.50000000              nan              nan              nan
H        4.51704914       5.94841095       6.28853619              nan              nan              nan`

await convertXYZToMolfile(xyz);
*/
