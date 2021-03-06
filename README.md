metalsmith-atomizer
===================

Metalsmith plugin to use [Atomizer] to build your [Atomic CSS].

[![npm version][npm-badge]][npm-link]
[![Build Status][travis-badge]][travis-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Dev Dependencies][devdependencies-badge]][devdependencies-link]
[![codecov.io][codecov-badge]][codecov-link]


Installation
------------

`npm` can do this for you.

    npm install --save metalsmith-atomizer


Usage
-----

Include this like you would include any other plugin.  First, a CLI example that also shows the default options.  You don't need to specify any options unless you want to change their values.

    {
        "plugins": {
            "metalsmith-atomizer": {
                "acssConfig": {},
                "addRules": {},
                "bufferEncoding": "utf8",
                "destination": "atomic.css",
                "destinationMode": "0644",
                "forget": false,
                "match": "**/*.{html,htm}",
                "matchOptions": {},
                "setOptions": {}
            }
        }
    }

And this is a JavaScript example that also includes a brief explanation of the options.

    // Load this, just like other plugins.
    var atomizer = require("metalsmith-atomizer");

    // Then in your list of plugins you use it.
    .use(atomizer())

    // Alternately, you can specify options.  The values shown here are
    // the defaults.  Dig into atomizer's src/atomizer.js to understand
    // all of these options in depth.
    .use(atomizer({
        // Atomic CSS config passed to Atomizer.  Use this to assign custom
        // values, breakpoints, etc.  It also can be used to force some
        // classes to always be generated.
        acssConfig: {},

        // Another undocumented feature of Atomizer to create custom ACSS
        // "functions".  Calls .addRules() with this configuration.
        addRules: {},

        // When converting file buffers to strings for Atomizer and strings
        // into buffers, which encoding should be used?
        bufferEncoding: "utf8",

        // Name of the generated file.
        destination: "atomic.css",

        // File permissions of the generated CSS file.
        destinationMode: "0644",

        // Set to true if the list of detected CSS rules should be forgotten.
        // Remembering these rules helps the plugin work with
        // metalsmith-watch and similar plugins.
        forget: false,

        // Pattern of files to match
        match: "**/*.{html,htm}",

        // Options for matching files.  See metalsmith-plugin-kit.
        matchOptions: {},

        // Custom CSS generation options to pass to Atomizer's .getCSS()
        // function.  It allows changing things like rtl and namespace.
        setOptions: {}
    })

This uses [metalsmith-plugin-kit] to match files.  The `.matchOptions` object can be filled with options to control how the matching works.

This plugin also can display the classes found by each processed file.  Enable debugging by setting the `DEBUG` environment variable when running your build.

    DEBUG=metalsmith-atomizer metalsmith

`metalsmith-atomizer` remembers the detected CSS rules between runs.  This makes it work far better with [metalsmith-watch] and other plugins that perform the same sort of action.  If you add and remove CSS classes, the plugin keeps track of what file added what Atomic CSS rules and updates the result accordingly.  This allows for incremental or partial builds of your project.  If this is undesirable, set `forget` to `true`.


API
---

<a name="module_metalsmith-atomizer"></a>

## metalsmith-atomizer
Metalsmith Atomizer constructs Atomic CSS from HTML markup in your
Metalsmith build process.

**See**

- [https://github.com/acss-io/atomizer](https://github.com/acss-io/atomizer)
- [http://acss.io/](http://acss.io/)

**Example**  
```js
var atomizer = require("metalsmith-atomizer");

// Make the Metalsmith instance and add this plugin as middleware.
metalsmith.use(atomizer({
    // options go here
}));
```

* [metalsmith-atomizer](#module_metalsmith-atomizer)
    * [module.exports(options)](#exp_module_metalsmith-atomizer--module.exports) ⇒ <code>function</code> ⏏
        * [~combineClasses(classesByFile)](#module_metalsmith-atomizer--module.exports..combineClasses) ⇒ <code>Array.&lt;string&gt;</code>
        * [~options](#module_metalsmith-atomizer--module.exports..options) : <code>Object</code>

<a name="exp_module_metalsmith-atomizer--module.exports"></a>

### module.exports(options) ⇒ <code>function</code> ⏏
Factory to build middleware for Metalsmith.

**Kind**: Exported function  
**Params**

- options <code>Object</code>

<a name="module_metalsmith-atomizer--module.exports..combineClasses"></a>

#### module.exports~combineClasses(classesByFile) ⇒ <code>Array.&lt;string&gt;</code>
Builds an array of every mentioned class name inside the
classesByFile object.

**Kind**: inner method of [<code>module.exports</code>](#exp_module_metalsmith-atomizer--module.exports)  
**Params**

- classesByFile <code>Object.&lt;string, string&gt;</code>

<a name="module_metalsmith-atomizer--module.exports..options"></a>

#### module.exports~options : <code>Object</code>
Options supported by the middleware factory.

**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_metalsmith-atomizer--module.exports)  
**See**

- [https://github.com/fidian/metalsmith-plugin-kit](https://github.com/fidian/metalsmith-plugin-kit)
- [https://github.com/acss-io/atomizer](https://github.com/acss-io/atomizer)

**Properties**

- acssConfig <code>Object</code> - Atomic CSS configuration.  
- addRules <code>false</code> \| <code>Object</code> - Additional Atomic CSS rules.  
- bufferEncoding <code>string</code> - Used when parsing file contents.  
- destination <code>string</code> - File to generate.  
- destinationMode <code>string</code> - Permissions for the generated file.  
- forget <code>boolean</code> - If true, previous Atomic rules are forgotten. Must be false when using this plugin with caching or limited builds (eg. metalsmith-watch).  
- match <code>module:metalsmith-plugin-kit~matchList</code> - Files to match. Defaults to *.htm and *.html.  
- matchOptions <code>module:metalsmith-plugin-kit~matchOptions</code> - Options controlling matching behavior.  
- setOptions <code>Object</code> - Used for generating Atomic CSS and can control `rtl` and `namespace`.  



Development
-----------

This uses Jasmine, Istanbul and ESLint for tests.

    # Install all of the dependencies
    npm install

    # Run the tests
    npm run test

This plugin is licensed under the [MIT License][License] with an additional non-advertising clause.  See the [full license text][License] for information.


[Atomic CSS]: http://acss.io/
[Atomizer]: https://github.com/yahoo/atomizer
[codecov-badge]: https://img.shields.io/codecov/c/github/tests-always-included/metalsmith-atomizer/master.svg
[codecov-link]: https://codecov.io/github/tests-always-included/metalsmith-atomizer?branch=master
[dependencies-badge]: https://img.shields.io/david/tests-always-included/metalsmith-atomizer.svg
[dependencies-link]: https://david-dm.org/tests-always-included/metalsmith-atomizer
[devdependencies-badge]: https://img.shields.io/david/dev/tests-always-included/metalsmith-atomizer.svg
[devdependencies-link]: https://david-dm.org/tests-always-included/metalsmith-atomizer#info=devDependencies
[License]: LICENSE.md
[metalsmith-plugin-kit]: https://github.com/fidian/metalsmith-plugin-kit
[metalsmith-watch]: https://github.com/FWeinb/metalsmith-watch
[npm-badge]: https://img.shields.io/npm/v/metalsmith-atomizer.svg
[npm-link]: https://npmjs.org/package/metalsmith-atomizer
[travis-badge]: https://img.shields.io/travis/tests-always-included/metalsmith-atomizer/master.svg
[travis-link]: http://travis-ci.org/tests-always-included/metalsmith-atomizer
