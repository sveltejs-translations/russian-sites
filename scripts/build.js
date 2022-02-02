const {runSync,getSiteDir,getProject} = require('./lib');
const {writeFileSync} = require('fs');
const path = require('path');

const DIR = getSiteDir();

runSync('npm run update');
runSync('npx pnpm run build',DIR,
  getProject() === 'kit' ? {} :
  {
    SUPABASE_URL:'no',
    SUPABASE_KEY:'no',
  }
);

writeFileSync(path.join(DIR,'build','package.json'),JSON.stringify({type:'module'}));