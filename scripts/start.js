const {runSync,getSiteDir} = require('./lib');

const DIR = getSiteDir();
runSync('npm run preview',DIR);