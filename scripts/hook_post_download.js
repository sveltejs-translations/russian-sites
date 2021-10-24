const fetchRepoDir = require('fetch-repo-dir');
const fs = require('fs/promises');
const path = require('path');

const LIST = [
    {
        src: 'https://github.com/sveltejs/kit/documentation',
        dst:'__BUILD/sites/kit.svelte.dev/src/content/documentation'
    }
];

const package = '__BUILD/sites/kit.svelte.dev/package.json';

(async()=>{
    for(let module of LIST){
        console.log('Downloading',module.src,'...')
        try{
            await fs.rm(module.dst,{ recursive: true });
        }catch{}
        await fetchRepoDir({
            src: module.src,
            dir: module.dst
        });
    }

    console.log('Fixing Svelte version...');
    let body = await fs.readFile(package,'utf8');
    body = body.replace('"svelte": "^3.43.0"','"svelte": "^3.44.0"');
    await fs.writeFile(package,body);
})();
