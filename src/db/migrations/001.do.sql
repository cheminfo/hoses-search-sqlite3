CREATE TABLE IF NOT EXISTS entries (
    molecule_id data_type PRIMARY KEY,
    id_code data_type TEXT NOT NULL UNIQUE, -- UNIQUE ?
    coordinates data_type TEXT NOT NULL,
    ssIndex data_type BLOB NOT NULL,
    lastModificationDate data_type TEXT
);

CREATE TABLE IF NOT EXISTS hoseCodes (
    hose_id data_type PRIMARY KEY,
    hose data_type TEXT NOT NULL,
    nucleus data_type TEXT,
    creationDate data_type TEXT,
    sphere data_type INTEGER NOT NULL,
    hoseValue data_type INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS measures ( -- TODO : Revoir le nom de cette table ?
    hose_id INTEGER,
    molecule_id INTEGER,
    PRIMARY KEY (hose_id, molecule_id), -- Peut-il y avoir un HOSE code commun à plusieurs molécules différentes ? Si oui, corriger cette PRIMARY KEY.
    FOREIGN KEY (hose_id) REFERENCES hoseCode(hose_id),
    FOREIGN KEY (molecule_id) REFERENCES Entries(molecule_id)
);
