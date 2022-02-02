const {runSync,getSiteDir,getProject} = require('./lib');
const {writeFileSync,cpSync,rmSync} = require('fs');
const path = require('path');

const DIR = getSiteDir();

runSync('npm run update');
if(getProject() === 'kit'){
  runSync('npx pnpm run build',DIR);
  writeFileSync(path.join(DIR,'build','package.json'),JSON.stringify({type:'module'}));
}else{
  runSync('npx pnpm run build',DIR,{
    SUPABASE_URL:'no',
    SUPABASE_KEY:'no',
  });
  writeFileSync(path.join(DIR,'build','package.json'),JSON.stringify({type:'module'}));
  runSync('npm i @supabase/supabase-js cookie devalue do-not-zip flru marked dotenv yootils sourcemap-codec svelte-json-tree',path.join(DIR,'build'));
}