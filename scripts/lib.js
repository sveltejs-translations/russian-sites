const child = require('child_process');

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

exports.getSiteDir = function(){
  if(exports.getProject() === 'kit') return '__BUILD/sites/kit.svelte.dev'
  return '__BUILD/sites/svelte.dev'
}


function makeCommand(command){
  const parts = command.split(/\s+/);
  return [parts.shift(), parts];
}