//import Debug from 'debug';

export function improveMoleculeInfo(data) {
  return {
    ...data,
    atoms: JSON.parse(data.atoms),
    ssIndex: Array.from(new Int32Array(new Uint8Array(data.ssIndex).buffer)),
  };
}
