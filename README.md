# SVELTE SITES - RUSSIAN

This repo contains official Svelte and SvelteKit sites localized to russian. 

> If you looking for russian content(documentation, tutorial, examples etc.) for theese sites, you should go to [sveltejs-translations/content-server](https://github.com/sveltejs-translations/content-server/tree/master/docs/ru) repo of the unofficial multilangual content server.

## How it work?

The content of the official [sites repo](https://github.com/sveltejs/sites) is downloading to the temporary directory, then all needed files will be replaced or patched according `patch` directory content. So whenever official sites have some changes we can rebuild russian ones quickly.

## Contributing

* Run `npm install`
* Run `npm run dev:svelte` or `npm run dev:kit` to start development site of needed project
* Edit or add any files in `patch` directory or strings in `patch/strings.json` file and site will be reloaded with new translation

> Change and PR only the files in `patch` directory

## Use this repository as a template for your language

To start developing your own localized site: 

1. Clone this repo. 
2. Then remove all files from `patch` directory, except `strings.json`. 
3. Replace russian strings by your own in `strings.json`
4. If you need replace whole files, place it inside `patch` directory, respect relative path of original file.
5. Run `npm run build:svelte` or `npm run build:kit` to get production site ready to run in node enveronment. If you need `adapter-auto` instead to run sites at Vercel or other service, just remove strings replacements  with `@sveltejs/adapter-node` from `strings.json` (4 places around the file).
