CREATE TABLE IF NOT EXISTS molecules (
  id data_type PRIMARY KEY,
  idCode data_type TEXT,
  ssIndex0 data_type INTEGER,
  ssIndex1 data_type INTEGER,
  ssIndex2 data_type INTEGER,
  ssIndex3 data_type INTEGER,
  ssIndex4 data_type INTEGER,
  ssIndex5 data_type INTEGER,
  ssIndex6 data_type INTEGER,
  ssIndex7 data_type INTEGER
);
CREATE INDEX IF NOT EXISTS ssIndex0 ON molecules(ssIndex0);
CREATE INDEX IF NOT EXISTS ssIndex1 ON molecules(ssIndex1);
CREATE INDEX IF NOT EXISTS ssIndex2 ON molecules(ssIndex2);
CREATE INDEX IF NOT EXISTS ssIndex3 ON molecules(ssIndex3);
CREATE INDEX IF NOT EXISTS ssIndex4 ON molecules(ssIndex4);
CREATE INDEX IF NOT EXISTS ssIndex5 ON molecules(ssIndex5);
CREATE INDEX IF NOT EXISTS ssIndex6 ON molecules(ssIndex6);
CREATE INDEX IF NOT EXISTS ssIndex7 ON molecules(ssIndex7);