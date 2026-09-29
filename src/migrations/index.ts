import * as migration_20260929_144532_initial from './20260929_144532_initial'

export const migrations = [
  {
    up: migration_20260929_144532_initial.up,
    down: migration_20260929_144532_initial.down,
    name: '20260929_144532_initial',
  },
]
