const {runSync,getSiteDir,getProject} = require('./lib');

const DIR = getSiteDir();

runSync('npm run update');
runSync('npx pnpm run build',DIR,
  getProject() === 'kit' ? {} :
  {
    SUPABASE_URL:'123',
    SUPABASE_KEY:'123',
  }
);