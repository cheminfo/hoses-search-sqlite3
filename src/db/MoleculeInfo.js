export interface MoleculeInfo {
  mf: string;
  mw: number;
  em: number;
  charge: number;
  idCode: string;
  noStereoID: string;
  noStereoTautomerID: string;
  ssIndex: number[];
  logS: number;
  logP: number;
  acceptorCount: number;
  donorCount: number;
  stereoCenterCount: number;
  rotatableBondCount: number;
  polarSurfaceArea: number;
  nbFragments: number;
  unsaturation: number;
  atoms: string;
}
