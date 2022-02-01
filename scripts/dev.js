const watch = require('node-watch');
const child = require('child_process');

const KIT = process.argv.includes('--kit');
const SVELTE = process.argv.includes('--svelte');

let dir;
if(KIT) dir = '__BUILD/sites/kit.svelte.dev';
if(SVELTE) dir = '__BUILD/sites/svelte.dev';

runApply();

const site = child.spawn('npm', ['run', 'dev'], {
    cwd: dir,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
    env: {...process.env, DOCS_PREVIEW:'true'}
});

process.on('SIGTERM', ()=>site.kill(0));
process.on('exit', ()=>site.kill(0));

watch('patch',{recursive:true},runApply);

function runApply(){
    try{
        child.execSync('npm run apply');
    }catch{
        console.error('Something wrong in patch directory')
    }
}