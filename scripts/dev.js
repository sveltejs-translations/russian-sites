const watch = require('node-watch');
const KIT = process.argv.includes('--kit');
const child = require('child_process');

let dir;
if(KIT) dir = '__BUILD/sites/kit.svelte.dev';

runApply();

const site = child.spawn('npm', ['run', 'dev'], {
    cwd: dir,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
});

process.on('SIGTERM', ()=>site.kill(0));
process.on('exit', ()=>site.kill(0));

watch('patch',{recursive:true},runApply);

function runApply(){
    try{
        child.execSync('npm run apply');
        if(KIT) child.execSync('npm run fetch:kit');
    }catch{
        console.error('Something wrong in patch directory')
    }
}