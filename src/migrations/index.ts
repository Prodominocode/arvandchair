import * as migration_20260929_144532_initial from './20260929_144532_initial'
import * as migration_20261029_124912_footer_logo from './20261029_124912_footer_logo'
import * as migration_20261103_133220_site_noindex from './20261103_133220_site_noindex'
import * as migration_20261107_140941_home_carousel from './20261107_140941_home_carousel'

export const migrations = [
  {
    up: migration_20260929_144532_initial.up,
    down: migration_20260929_144532_initial.down,
    name: '20260929_144532_initial',
  },
  {
    up: migration_20261029_124912_footer_logo.up,
    down: migration_20261029_124912_footer_logo.down,
    name: '20261029_124912_footer_logo',
  },
  {
    up: migration_20261103_133220_site_noindex.up,
    down: migration_20261103_133220_site_noindex.down,
    name: '20261103_133220_site_noindex',
  },
  {
    up: migration_20261107_140941_home_carousel.up,
    down: migration_20261107_140941_home_carousel.down,
    name: '20261107_140941_home_carousel',
  },
]
