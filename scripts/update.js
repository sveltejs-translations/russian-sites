const path = require('path');
const {runSync,injectConfig,getSiteDir} = require('./lib');
const CFG = require("./../translation.config.json");

runSync('npm run download');
runSync('npm run apply');

injectConfig('kit');
injectConfig('svelte');

runSync('npx pnpm install --no-frozen-lockfile','./__BUILD');
if(CFG.adapter) runSync(`npx pnpm install ${CFG.adapter} -w`,'./__BUILD');


