The goal of this project is to test the capabilities of sqlite3 to be used as a database for substructure search.

Substructure search requires 2 steps:

1. Search for candidates (using bitwise operation)
2. Check if a query is really in the target molecule

## Installation

On silicon mac you may need:

```
cd node_modules/better-sqlite3
npm run build-release
```
