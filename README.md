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

    npm install --save-dev metalsmith-atomizer


Usage
-----

Include this like you would include any other plugin.

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

        // Name of the generated file
        destination: "atomic.css",

        // Pattern of files to match
        match: "**/*.css",

        // Options for matching files.  See minimatch.
        matchOptions: {},

        // Custom CSS generation options to pass to Atomizer's .getCSS()
        // function.  It allows changing things like rtl and namespace.
        setOptions: {}
    })

This uses [minimatch] to match files.  The `.matchOptions` object can be filled with options that the [minimatch] library uses.


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
[minimatch]: https://github.com/isaacs/minimatch
[npm-badge]: https://badge.fury.io/js/metalsmith-atomizer.svg
[npm-link]: https://npmjs.org/package/metalsmith-atomizer
[travis-badge]: https://secure.travis-ci.org/tests-always-included/metalsmith-atomizer.png
[travis-link]: http://travis-ci.org/tests-always-included/metalsmith-atomizer
