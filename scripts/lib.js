const child = require('child_process');
const path = require('path');
const fs = require('fs');
const CFG = require("./../translation.config.json");

exports.run = function(command,dir=".",env={}){
  const [cmd,args] = makeCommand(command);
  const site = child.spawn(cmd,args, {
    cwd: dir,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
    env: {...process.env, ...env}
  });

  process.on('SIGTERM', ()=>site.kill(0));
  process.on('exit', ()=>site.kill(0));
}

exports.runSync = function(command,dir=".",env={}){
  const [cmd,args] = makeCommand(command);
  child.spawnSync(cmd,args,{
    cwd: dir,
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {...process.env, ...env}
  });
}

exports.runSilent = function(command,dir=".",env={}){
  const [cmd,args] = makeCommand(command);
  child.spawnSync(cmd,args, {
    cwd: dir,
    shell: true,
    env: {...process.env, ...env}
  });
}


exports.getProject = function(){
  if(process.argv.includes('--kit')) return 'kit'
  return 'svelte'
}

exports.getSiteDir = function(project){
  if(project === 'kit' || exports.getProject() === 'kit') return '__BUILD/sites/kit.svelte.dev'
  return '__BUILD/sites/svelte.dev'
}

exports.injectConfig = function(project){
  const DIR = exports.getSiteDir(project);

  const cfgFile = path.join(DIR,'svelte.config.js');

  let contentCfg = fs.readFileSync(cfgFile,'utf-8');

  const adapter = getAdapterPackage();

  if(adapter) contentCfg = contentCfg.replace("import adapter from '@sveltejs/adapter-auto';",`import adapter from '${adapter.pkg}';`)
  if(CFG.adapter_config) contentCfg = contentCfg.replace("adapter: adapter(),",`adapter: adapter(${CFG.adapter_config || ''}),`);
  
  if(CFG.api_url) contentCfg = contentCfg.replace('https://api.svelte.dev',CFG.api_url)
  if(CFG.api_url_dev) contentCfg = contentCfg.replace(/http:\/\/localhost:[0-9]{4}/,CFG.api_url_dev);

  fs.writeFileSync(cfgFile,contentCfg);
}

exports.getAdapter = function(){
  if(!CFG.adapter) return 'auto';
  const matched = CFG.adapter.match(/adapter-(\w+)/);
  if(matched) return matched[1];
  return 'unknown';
}

function getAdapterPackage(){
  if(!CFG.adapter) return null;

  const matched = CFG.adapter.match(/(.+adapter-\w+)@([^/]+)/);
  if(matched) return {pkg: matched[1], ver: matched[2]};
  return {pkg: CFG.adapter, ver: 'latest'};
}

function makeCommand(command){
  const parts = command.split(/\s+/);
  return [parts.shift(), parts];
}