const fetchRepoDir = require('fetch-repo-dir');
const fs = require('fs/promises');
const path = require('path');

const LIST = [
    {
        src: 'https://github.com/sveltejs/kit/documentation',
        dst:'__BUILD/sites/kit.svelte.dev/src/content/documentation'
    }
];

(async()=>{
    for(let module of LIST){
        console.log('Downloading',module.src,'...')
        await fs.rmdir(module.dst,{ recursive: true });
        await fetchRepoDir({
            src: module.src,
            dir: module.dst
        });
    }
})();
