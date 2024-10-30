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
    algorithmID INTEGER PRIMARY KEY AUTOINCREMENT,
    name data_type TEXT,
    version data_type TEXT,
    description data_type TEXT,
    UNIQUE(name, version)
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
    value data_type TEXT NOT NULL,
    sphere data_type INTEGER NOT NULL,
    atomID data_type INTEGER NOT NULL,
    FOREIGN KEY (atomID) REFERENCES atoms(atomID)
);

CREATE TABLE IF NOT EXISTS atoms (
    atomID INTEGER PRIMARY KEY AUTOINCREMENT,
    label data_type TEXT NOT NULL,
    molfileIndex data_type INTEGER NOT NULL,
    entryID data_type INTEGER NOT NULL,
    FOREIGN KEY (entryID) REFERENCES entries(entryID)
);


