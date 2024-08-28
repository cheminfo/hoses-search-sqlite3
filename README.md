The goal of this project is to test the capabilities of sqlite3 to be used as a database for substructure search.

Substructure search requires 2 step:

1. Search for candidates (using bitwise operation)
2. Check if a query is really in the target molecule

## Installation

On silicon mac you may need:

```
cd node_modules/better-sqlite3
npm run build-release
```

## Database structure

```
CREATE TABLE molecules (
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
CREATE INDEX ssIndex1 ON molecules(ssIndex0);
CREATE INDEX ssIndex1 ON molecules(ssIndex1);
CREATE INDEX ssIndex2 ON molecules(ssIndex2);
CREATE INDEX ssIndex3 ON molecules(ssIndex3);
CREATE INDEX ssIndex4 ON molecules(ssIndex4);
CREATE INDEX ssIndex5 ON molecules(ssIndex5);
CREATE INDEX ssIndex6 ON molecules(ssIndex6);
CREATE INDEX ssIndex7 ON molecules(ssIndex7);
```

The `id` contains the md5 of the idCode.

In order to speedup the queries the idea is that based on the first letter of the md5 we create 16 different databases. This should allow to make the substructure search 16 times faster on a machine having many cores.

## Next step

Calculation of the molecule information should be done using piscina. Th

## Index searches

## Storing / retrieving LONG
