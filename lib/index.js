/**
 * Metalsmith Atomizer constructs Atomic CSS from HTML markup in your
 * Metalsmith build process.
 *
 * @example
 * var atomizer = require("metalsmith-atomizer");
 *
 * // Make the Metalsmith instance and add this plugin as middleware.
 * metalsmith.use(atomizer({
 *     // options go here
 * }));
 *
 * @module metalsmith-atomizer
 * @see {@link https://github.com/acss-io/atomizer}
 * @see {@link http://acss.io/}
 */
"use strict";

var Atomizer, debug, pluginKit;

Atomizer = require("atomizer");
debug = require("debug")("metalsmith-atomizer");
pluginKit = require("metalsmith-plugin-kit");


/**
 * Builds an array of every mentioned class name inside the
 * classesByFile object.
 *
 * @param {Object.<string,string>} classesByFile
 * @return {Array.<string>}
 */
function combineClasses(classesByFile) {
    var classIndex, classList, fileIndex, fileKeys, resultHash;

    resultHash = {};
    fileKeys = Object.keys(classesByFile);

    // Avoid .forEach() for speed
    for (fileIndex = 0; fileIndex < fileKeys.length; fileIndex += 1) {
        classList = classesByFile[fileKeys[fileIndex]];

        for (classIndex = 0; classIndex < classList.length; classIndex += 1) {
            // Deduplicate the class name
            resultHash[classList[classIndex]] = true;
        }
    }

    return Object.keys(resultHash);
}


/**
 * Options supported by the middleware factory.
 *
 * @typedef {Object} options
 * @property {Object} [acssConfig={}] Atomic CSS configuration.
 * @property {(false|Object)} [addRules=false] Additional Atomic CSS rules.
 * @property {string} [bufferEncoding=utf8] Used when parsing file contents.
 * @property {string} [destination=atomic.css] File to generate.
 * @property {string} [destinationMode=0644] Permissions for the generated file.
 * @property {boolean} [forget=false] If true, previous Atomic rules are forgotten. Must be false when using this plugin with caching or limited builds (eg. metalsmith-watch).
 * @property {module:metalsmith-plugin-kit~matchList} [match] Files to match. Defaults to *.htm and *.html.
 * @property {module:metalsmith-plugin-kit~matchOptions} [matchOptions={}] Options controlling matching behavior.
 * @property {Object} [setOptions={}] Used for generating Atomic CSS and can control `rtl` and `namespace`.
 * @see {@link https://github.com/fidian/metalsmith-plugin-kit}
 * @see {@link https://github.com/acss-io/atomizer}
 */

/**
 * Factory to build middleware for Metalsmith.
 *
 * @param {Object} options
 * @return {Function}
 */
module.exports = function (options) {
    var acss, classesByFile;

    options = pluginKit.defaultOptions({
        acssConfig: {},
        addRules: false,
        bufferEncoding: "utf8",
        destination: "atomic.css",
        destinationMode: "0644",
        forget: false,
        match: "**/*.{html,htm}",
        matchOptions: {},
        setOptions: {}
    }, options);
    classesByFile = {};


    return pluginKit.middleware({
        after: (files) => {
            var allClasses, cssString, mergedConfig;

            allClasses = combineClasses(classesByFile);

            // Atomizer modifies the object passed as the second parameter,
            // so we use `clone()` to make sure our options are not permanently
            // altered.  This makes it forget class names that are not listed
            // in allClasses.
            mergedConfig = acss.getConfig(allClasses, pluginKit.clone(options.acssConfig));

            cssString = acss.getCss(mergedConfig, options.setOptions);
            pluginKit.addFile(files, options.destination, cssString, {
                encoding: options.bufferEncoding,
                mode: options.destinationMode
            });
        },
        before: () => {
            acss = new Atomizer();

            if (options.forget) {
                classesByFile = {};
            }

            if (options.addRules) {
                acss.addRules(options.addRules);
            }
        },
        each: (filename, file) => {
            var classes, html;

            // Convert Buffers to strings
            html = file.contents.toString(options.bufferEncoding);
            classes = acss.findClassNames(html);
            debug(`${filename}: ${classes.join(" ")}`);
            classesByFile[filename] = classes;
        },
        match: options.match,
        matchOptions: options.matchOptions,
        name: "metalsmith-atomizer"
    });
};
