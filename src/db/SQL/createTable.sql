CREATE TABLE IF NOT EXISTS molecules (
    molecule_id data_type PRIMARY KEY,
    molecule data_type TEXT NOT NULL UNIQUE, -- UNIQUE ?
    coordinates data_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hoseCodes (
    hose_id data_type PRIMARY KEY,
    hose data_type TEXT NOT NULL,
    nucleus data_type TEXT,
    creationDate data_type TEXT,
    lastModificationDate data_type TEXT,
    sphere data_type INTEGER NOT NULL,
    hoseValue data_type INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS measure ( -- TODO : Revoir le nom de cette table
    hose_id INTEGER,
    molecule_id INTEGER,
    PRIMARY KEY (hose_id, molecule_id), -- Peut-il y avoir un HOSE code commun à plusieurs molécules différentes ? Si, oui corriger cette PRIMARY KEY.
    FOREIGN KEY (hose_id) REFERENCES hoseCode(hose_id),
    FOREIGN KEY (molecule_id) REFERENCES molecules(molecule_id)
);

-- CREATE INDEX IF NOT EXISTS molecule ON molecules(molecule);
-- CREATE INDEX IF NOT EXISTS coordinates ON molecules(coordinates);

-- CREATE INDEX IF NOT EXISTS hose ON hoseCodes(hose);
-- CREATE INDEX IF NOT EXISTS nucleus ON hoseCodes(nucleus);
-- CREATE INDEX IF NOT EXISTS creationDate ON hoseCodes(creationDate);
-- CREATE INDEX IF NOT EXISTS lastModificationDate ON hoseCodes(lastModificationDate);
-- CREATE INDEX IF NOT EXISTS sphere ON hoseCodes(sphere);
-- CREATE INDEX IF NOT EXISTS hoseValue ON hoseCodes(hoseValue);