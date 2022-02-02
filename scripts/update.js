const {runSync} = require('./lib');
const path = require('path');

runSync('npm run download');
runSync('npm run apply');
runSync('npx pnpm install --no-frozen-lockfile','./__BUILD');