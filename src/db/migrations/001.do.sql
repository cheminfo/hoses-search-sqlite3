CREATE TABLE IF NOT EXISTS entries (
    entryID INTEGER PRIMARY KEY AUTOINCREMENT,
    nbAtoms data_type INTEGER NOT NULL,
    idCode data_type TEXT NOT NULL,
    coordinates data_type TEXT NOT NULL,
    mf data_type TEXT NOT NULL,
    mw data_type REAL NOT NULL,
    comment data_type TEXT NOT NULL,
    ssIndex data_type BLOB NOT NULL,
    molfile2D data_type TEXT,
    molfile3D data_type TEXT,
    xyz data_type TEXT,
    lastModificationDate data_type INTEGER
);

CREATE TABLE IF NOT EXISTS algorithms (
    algorithmID data_type PRIMARY KEY,
    name data_type TEXT UNIQUE,
    version data_type TEXT,
    description data_type TEXT
);

CREATE TABLE IF NOT EXISTS energies (
    energyID data_type PRIMARY KEY,
    orbital data_type TEXT NOT NULL,
    bindingEnergy data_type REAL,
    kineticEnergy  data_type REAL,
    sourceEnergy  data_type REAL,
    algorithmID data_type INTEGER NOT NULL,
    atomID data_type INTEGER NOT NULL,
    FOREIGN KEY (atomID) REFERENCES atoms(atomID),
    FOREIGN KEY (algorithmID) REFERENCES algorithms(algorithmID)
);

CREATE TABLE IF NOT EXISTS hoseCodes (
    hoseID data_type PRIMARY KEY,
    hose data_type TEXT NOT NULL,
    nucleus data_type TEXT,
    creationDate data_type INTEGER,
    sphere data_type INTEGER NOT NULL,
    hoseValue data_type INTEGER NOT NULL,
    entryID data_type INTEGER NOT NULL,
    atomID data_type INTEGER NOT NULL,
    FOREIGN KEY (atomID) REFERENCES atoms(atomID)
);

CREATE TABLE IF NOT EXISTS atoms (
    atomID data_type PRIMARY KEY,
    number data_type INTEGER NOT NULL,
    label data_type TEXT NOT NULL,
    FOREIGN KEY (entryID) REFERENCES entries(entryID)
);


