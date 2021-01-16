# serverless one hook

- easily create plugins without publishing them 
- assign a hook before and after all existing hooks

`npm i -s @kessler/serverless-onehook`

```yaml
plugins:
    - "@kessler/serverless-onehook"
```
create a `oneHook.js` at the base of your project:
```js
module.exports = (onehook) => {
    // this module is run in during the construction of the plugin instance
    // so you can do anything that you would do in a normal sls plugin class
    onehook.commands = { ... }
    onehook.hooks = { ... }

    // but also, you can just skip the whole plugin class thing and just do hooks
    onehook.before('deploy:deploy', () => {})

    // will run before the "after" of deploy deploy
    onehook.before('after:deploy:deploy', () => { })

    // will run after the "after" of deploy deploy
    onehook.after('after:deploy:deploy', () => { })

    // an array containing all existing hook names
    // please note that what you get here probably (but i didn't check) depends
    // on the plugin load order, but in any case, all the core plugins (but not enterprise)
    // are loaded before this plugin
    console.log(onehook.existingHookNames)
}
```

### customize the location of oneHook.js

```yaml
plugins:
    - "@kessler/serverless-onehook"
custom:
    hookPath: something relative to project root (sls project roo)
```

### hooks reference
https://gist.github.com/HyperBrain/50d38027a8f57778d5b0f135d80ea406