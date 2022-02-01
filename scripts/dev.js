const watch = require('node-watch');

const {
    run,
    runSilent,
    getSiteDir,
    runSync
} = require('./lib');

const DIR = getSiteDir();

runSync('npm run update');

run('npx pnpm run dev',DIR,{DOCS_PREVIEW:'true'})

watch('patch',{recursive:true},runApply);

function runApply(){
    try{
        console.log('Apply changes...')
        runSilent('npm run apply');
    }catch{
        console.error('Something wrong in patch directory')
    }
}