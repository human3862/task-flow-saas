import * as migration_20260127_065414_rename_my_collection from './20260127_065414_rename_my_collection';
import * as migration_20260201_110249_init from './20260201_110249_init';
import * as migration_20260201_111626_init from './20260201_111626_init';

export const migrations = [
  {
    up: migration_20260127_065414_rename_my_collection.up,
    down: migration_20260127_065414_rename_my_collection.down,
    name: '20260127_065414_rename_my_collection',
  },
  {
    up: migration_20260201_110249_init.up,
    down: migration_20260201_110249_init.down,
    name: '20260201_110249_init',
  },
  {
    up: migration_20260201_111626_init.up,
    down: migration_20260201_111626_init.down,
    name: '20260201_111626_init'
  },
];
