import debugLibrary from 'debug';

import { getDB } from '../db/getDB.js';

const debug = debugLibrary('getInfoFromSmiles');

export default function molecules(fastify) {
  fastify.route({
    url: '/v1/molecules',
    method: ['GET', 'POST'],
    handler: getMolecules,
    schema: {
      summary: '$retrieve information from a molfile',
      description: '',
      consumes: ['multipart/form-data'],
      querystring: {
        type: 'object',
        properties: {
          algorithm: {
            type: 'string',
            description: 'Filename',
          },
          email: {
            type: 'string',
            description: 'email',
          },
        },
      },
    },
  });
}

async function getMolecules(request, response) {
  const { email, algorithm } = request.query;
  try {
    const db = await getDB();
    const moleculesData = getMoleculesFromDB(email, algorithm, db);
    return response.send(moleculesData);
  } catch (error) {
    return response.send({ result: {}, log: error.toString() });
  }
}

export function getMoleculesFromDB(contactEmail, algorithm, db) {
  const stmt = db.prepare(`
    SELECT algorithms.name, algorithms.version, contacts.email, entries.idCode AS entryIdCode, entries.coordinates, entries.xyz, entries.molfile3D, atoms.label, energies.bindingEnergy, hoses.idCode AS hoseIdCode, hoses.sphere
    FROM algorithms 
    INNER JOIN contacts ON algorithms.contactID = contacts.contactID
    INNER JOIN energies ON algorithms.algorithmID = energies.algorithmID
    INNER JOIN atoms ON atoms.atomID = energies.atomID
    INNER JOIN hoses ON hoses.atomID = atoms.atomID
    INNER JOIN entries on entries.entryID = atoms.entryID
    WHERE algorithms.name = '${algorithm}' AND contacts.email = '${contactEmail}'`);
  const moleculesFromDB = stmt.all();
  const molecules = refactorMoleculeData(moleculesFromDB);
  return molecules;
}

function refactorMoleculeData(data) {
  const molecules = [];
  for (const molecule of data) {
    const moleculeIndex = getMoleculeIndex(molecules, molecule.entryIdCode);
    if (Number.isNaN(moleculeIndex)) {
      const newMolecule = {
        ocl: {
          idCode: molecule.entryIdCode,
          coordinates: molecule.coordinates,
        },
        xyz: molecule.xyz,
        molfile3D: molecule.molfile3D,
        atoms: [
          {
            label: molecule.label,
            value: molecule.bindingEnergy,
            hoses: [{ idCode: molecule.hoseIdCode, sphere: molecule.sphere }],
          },
        ],
      };
      molecules.push(newMolecule);
    } else {
      const atomIndex = getAtomIndex(
        molecules[moleculeIndex].atoms,
        molecule.label,
      );
      if (Number.isNaN(atomIndex)) {
        const newAtom = {
          label: molecule.label,
          value: molecule.bindingEnergy,
          hoses: [{ idCode: molecule.hoseIdCode, sphere: molecule.sphere }],
        };
        molecules[moleculeIndex].atoms.push(newAtom);
      } else {
        const newHose = {
          idCode: molecule.hoseIdCode,
          sphere: molecule.sphere,
        };
        molecules[moleculeIndex].atoms[atomIndex].hoses.push(newHose);
      }
    }
  }
  return molecules;
}

function getMoleculeIndex(elements, entryIdCode) {
  const candidate = elements.find(
    (element) => element?.ocl.idCode === entryIdCode,
  );
  return candidate !== undefined ? elements.indexOf(candidate) : Number.NaN;
}

function getAtomIndex(atoms, atomLabel) {
  const candidate = atoms.find((atom) => atom.label === atomLabel);
  return candidate !== undefined ? atoms.indexOf(candidate) : Number.NaN;
}
