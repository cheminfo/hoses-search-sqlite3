import debugLibrary from 'debug';
//@ts-expect-error ignore lack of declaration
import { MF } from 'mass-tools';
import { MoleculeProperties } from 'openchemlib';
//@ts-expect-error ignore lack of declaration
import { getMF } from 'openchemlib-utils';

const debug = debugLibrary('calculateMoleculeInfo');

export default function calculateMoleculeInfo(molecule, options = {}) {
  //@ts-expect-error ignore lack of declaration
  const info = {};
  const { ignoreTautomer = false } = options;

  const mf = getMF(molecule).parts.sort().join('.');
  const mfInfo = new MF(mf).getInfo();

  info.mf = mfInfo.mf;
  info.mw = mfInfo.mass;
  info.em = mfInfo.monoisotopicMass;
  info.charge = mfInfo.charge;

  info.atoms = mfInfo.atoms;
  info.unsaturation = mfInfo.unsaturation;

  info.idCode = molecule.getIDCode();
  info.noStereoID = getNoStereoIDCode(molecule);

  let small = true;
  if (mfInfo.atoms) {
    if (mfInfo.atoms.C > 50) small = false;
  } else if (mfInfo.parts) {
    for (const part of mfInfo.parts) {
      if (part.atoms.C > 50) small = false;
    }
  }

  if (small) {
    if (ignoreTautomer) {
      debug(`Ignore tautomer: ${mfInfo.mf}`);
      info.noStereoTautomerID = info.noStereoID;
    } else {
      info.noStereoTautomerID = getNoStereoTautomerIDCode(molecule);
    }
  } else {
    debug(`Too big: ${mfInfo.mf}`);
    info.noStereoTautomerID = info.noStereoID;
  }

  appendProperties(molecule, info);

  info.ssIndex = getSSIndex(molecule);

  return info;
}

function getNoStereoIDCode(molecule) {
  molecule.stripStereoInformation();
  return molecule.getIDCode();
}

function getNoStereoTautomerIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(
    molecule,
    OCL.CanonizerUtil.NOSTEREO_TAUTOMER,
  );
}

function getSSIndex(molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}

function appendProperties(molecule, info) {
  const moleculeProperties = new MoleculeProperties(molecule);
  info.logS = moleculeProperties.logS;
  info.logP = moleculeProperties.logP;
  info.acceptorCount = moleculeProperties.acceptorCount;
  info.donorCount = moleculeProperties.donorCount;
  info.rotatableBondCount = moleculeProperties.rotatableBondCount;
  info.stereoCenterCount = moleculeProperties.stereoCenterCount;
  info.polarSurfaceArea = moleculeProperties.polarSurfaceArea;
  const fragmentMap = [];
  const nbFragments = molecule.getFragmentNumbers(fragmentMap, false, false);
  info.nbFragments = nbFragments;
}
