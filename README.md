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

        // Options for matching files.  See minimatch.
        matchOptions: {},

        // Custom CSS generation options to pass to Atomizer's .getCSS()
        // function.  It allows changing things like rtl and namespace.
        setOptions: {}
    })

This uses [minimatch] to match files.  The `.matchOptions` object can be filled with options that the [minimatch] library uses.

This plugin also can display the classes found by each processed file.  Enable debugging by setting the `DEBUG` environment variable when running your build.

    DEBUG=metalsmith-atomizer metalsmith

`metalsmith-atomizer` remembers the detected CSS rules between runs.  This makes it work far better with [metalsmith-watch] and other plugins that perform the same sort of action.  If you add and remove CSS classes, the plugin keeps track of what file added what Atomic CSS rules and updates the result accordingly.  This allows for incremental or partial builds of your project.  If this is undesirable, set `forget` to `true`.


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
[codecov-badge]: https://codecov.io/github/tests-always-included/metalsmith-atomizer/coverage.svg?branch=master
[codecov-link]: https://codecov.io/github/tests-always-included/metalsmith-atomizer?branch=master
[dependencies-badge]: https://david-dm.org/tests-always-included/metalsmith-atomizer.png
[dependencies-link]: https://david-dm.org/tests-always-included/metalsmith-atomizer
[devdependencies-badge]: https://david-dm.org/tests-always-included/metalsmith-atomizer/dev-status.png
[devdependencies-link]: https://david-dm.org/tests-always-included/metalsmith-atomizer#info=devDependencies
[License]: LICENSE.md
[metalsmith-watch]: https://github.com/FWeinb/metalsmith-watch
[minimatch]: https://github.com/isaacs/minimatch
[npm-badge]: https://badge.fury.io/js/metalsmith-atomizer.svg
[npm-link]: https://npmjs.org/package/metalsmith-atomizer
[travis-badge]: https://secure.travis-ci.org/tests-always-included/metalsmith-atomizer.png
[travis-link]: http://travis-ci.org/tests-always-included/metalsmith-atomizer
