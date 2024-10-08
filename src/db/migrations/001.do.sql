CREATE TABLE IF NOT EXISTS entries (
    entryID data_type PRIMARY KEY,
    idCode data_type TEXT NOT NULL,
    nbAtoms data_type INTEGER NOT NULL,
    coordinates data_type TEXT NOT NULL,
    relativeWeight data_type INTEGER NOT NULL,
    comment data_type TEXT NOT NULL,
    ssIndex data_type BLOB NOT NULL,
    molFile data_type TEXT,
    xyzFile data_type TEXT,
    lastModificationDate data_type TEXT
);

CREATE TABLE IF NOT EXISTS atoms (
    atomID data_type PRIMARY KEY,
    atomNumber data_type INTEGER NOT NULL,
    atomLabel data_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXIST algorithms (
    algorithmID data_type PRIMARY KEY,
    algoName data_type TEXT UNIQUE,
    algoDescription data_type TEXT,
)

CREATE TABLE IF NOT EXISTS energies (
    energyID data_type PRIMARY KEY,
    orbital data_type TEXT NOT NULL,
    bindingEnergy data_type REAL,
    kineticEnergy  data_type REAL,
    sourceEnergy  data_type REAL
    FOREIGN KEY (algorithmID) REFERENCES algorithms(algorithmID),
    FOREIGN KEY (atomID) REFERENCES atoms(atomID),
)

CREATE TABLE IF NOT EXISTS hoseCodes (
    hoseID data_type PRIMARY KEY,
    hose data_type TEXT NOT NULL,
    nucleus data_type TEXT,
    creationDate data_type TEXT,
    sphere data_type INTEGER NOT NULL,
    hoseValue data_type INTEGER NOT NULL,
    FOREIGN KEY (atomID) REFERENCES entries(atomID),
    FOREIGN KEY (entryID) REFERENCES entries(entryID)
);


