const {runSync} = require('./lib');

runSync('npm run download');
runSync('npm run apply');
runSync('npx pnpm install','./__BUILD');