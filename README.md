# RUSSIAN SVELTE SITES TRANSLATION

## Contributing

* Clone the repo
* Run `npm install`
* Run `npm run dev:kit` to start development site of kit.svelte.dev
* Edit or add any files in `patch` directory and site will be reloaded with translation
* In case you need download new version of official site run `npm run update`

> Change and PR only the files in `patch` directory

### Speedup

To fast copy file from source repository to `patch` dir use npm command `copy:kit`. For example you may find needed file at `https://github.com/sveltejs/kit/blob/master/documentation/docs/00-introduction.md` then copy the path after ford `documentation` and run the command `npm run copy:kit docs/00-introduction.md`. New file will be copied and ready for translation.