import { existsSync } from 'node:fs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import debugLibrary from 'debug';
import delay from 'delay';
import md5 from 'md5';

const debug = debugLibrary('convertXYZToMolfile');

const baseDir = new URL('../../../cache/xyzToMolfile', import.meta.url)
  .pathname;

export async function convertXYZToMolfile(xyz) {
  const hash = md5(xyz);
  const xyzLines = xyz.split('\n');
  const subfolder = hash.slice(0, 2);
  const filename = join(baseDir, subfolder, hash);
  const folder = join(baseDir, subfolder);
  if (!existsSync(folder)) {
    await mkdir(folder, { recursive: true });
  }

  if (existsSync(filename)) {
    return readFile(filename, 'utf8');
  }

  const formData = new FormData();

  formData.append('input', xyz);
  formData.append('inputFormat', 'xyz');
  formData.append('outputFormat', 'mol');

  let nbFails = 0;
  while (nbFails < 3) {
    try {
      const response = await fetch(
        'https://openbabel.cheminfo.org/v1/convert',
        {
          body: formData,
          method: 'POST',
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const molfile = JSON.parse(await response.text()).result;
      const lines = molfile.split('\n');
      lines[2] = xyzLines[1];
      const molfileWithComment = lines.join('\n');
      await writeFile(filename, molfileWithComment, 'utf8');
      await delay(250);
      return molfileWithComment;
    } catch (error) {
      debug(error);
      debug(`Retrying... ${nbFails}`);
      nbFails++;
      await delay(15000);
    }
  }
  throw new Error('Could not convert the XYZ file');
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
