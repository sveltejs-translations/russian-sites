const path = require('path');
const fs = require('fs');
const KIT = process.argv.includes('--kit');

const SRC = '__BUILD';
const DST = 'patch';

let DIR;
if(KIT) DIR = "sites/kit.svelte.dev/src/content/documentation";

const file = process.argv[3];
if(!file) throw new Error('You must provide a filepath, ex: `npm run copy:kit docs/00-introduction.md`');

const srcFilepath = path.join(SRC,DIR,file);
const dstFilepath = path.join(DST,DIR,file);

if(!fs.existsSync(srcFilepath)) throw new Error('Source file not exists');
if(fs.existsSync(dstFilepath)) throw new Error('Destination file already exist');

fs.mkdirSync(path.dirname(dstFilepath),{recursive:true});

fs.copyFileSync(srcFilepath,dstFilepath);

console.log('File is copied to',dstFilepath);