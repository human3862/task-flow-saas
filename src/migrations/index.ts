import * as migration_20260127_065414_rename_my_collection from './20260127_065414_rename_my_collection';

export const migrations = [
  {
    up: migration_20260127_065414_rename_my_collection.up,
    down: migration_20260127_065414_rename_my_collection.down,
    name: '20260127_065414_rename_my_collection'
  },
];
