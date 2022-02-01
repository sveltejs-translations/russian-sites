const {runSync,getSiteDir} = require('./lib');

const DIR = getSiteDir();
runSync('node build',DIR);