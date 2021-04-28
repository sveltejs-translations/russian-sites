const fs = require('fs/promises');
const path = require('path');
const http = require('http');
const {spawn} = require('child_process');

const DIR_DOC = '__BUILD/sites/kit.svelte.dev/src/content/documentation';
const DIR_KIT = '__BUILD/sites/kit.svelte.dev/src/routes/api/docs/kit/';
const API_URL = 'http://localhost:3456/docs/kit';

const DOCS = ['docs','faq','migrating'];

(async ()=>{
  await fs.mkdir(DIR_KIT, {recursive:true});
  const apiSrv = await runApiServer();
  for(let doc of DOCS){
      const content = await wget(API_URL+'/'+doc+'?content');
      await fs.writeFile(path.join(DIR_KIT,doc+'.json.js'),getEndpointSource(content));
  }
  apiSrv.stop();
})();

/** Save content from URL */
async function wget(url){
    return new Promise((resolve,reject)=>{
        http.get(url, (resp) => {
            let data = '';
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => resolve(data));
        }).on("error", err => reject(err.message));
    });
}

/** Run API server from `action-deploy-docs` */
async function runApiServer(){
    return new Promise((resolve,reject)=>{
        const child = spawn('node', [ 
            'node_modules/action-deploy-docs/cli.js',
            'pkg=__BUILD/packages',
            'docs='+DIR_DOC,
            'project=kit'
        ]);
    
        const kill = ()=>child.kill();
    
        child.stdout.on('data', (data) => {
            if(data.toString('utf8').indexOf('Running on localhost:3456') > 0) resolve({
                stop:()=>kill()
            });
        });
    
        child.stderr.on('data', (data) => {
            kill();
            reject(new Error(data));
        });
    
        process.on('exit', kill);
        process.on('SIGTERM', kill);

        setTimeout(()=>{
            kill();
            reject(new Error('Can not start the server'));
        },3000);
    });
}

function getEndpointSource(content){
    return `
        export function get(){
            return {
                body: ${content}
            }
        }
    `
}