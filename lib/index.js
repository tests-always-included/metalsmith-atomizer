"use strict";

var Atomizer, debug, minimatch;

Atomizer = require("atomizer");
debug = require("debug")("metalsmith-atomizer");
minimatch = require("minimatch");

/**
 * Factory to build middleware for Metalsmith.
 *
 * @param {Object} options
 * @return {Function}
 */
module.exports = function (options) {
    var classesByFile, matcher;

    options = options || {};
    options.acssConfig = options.acssConfig || {};
    options.bufferEncoding = options.bufferEncoding || "utf8";
    options.destination = options.destination || "atomic.css";
    options.destinationMode = options.destinationMode || "0644";
    options.forget = !!options.forget;
    options.match = options.match || "**/*.{html,htm}";
    options.matchOptions = options.matchOptions || {};
    options.setOptions = options.setOptions || {};
    matcher = new minimatch.Minimatch(options.match, options.matchOptions);
    classesByFile = {};


    /**
     * Creates a deep copy of an object.
     *
     * @param {*} input
     * @return {*}
     */
    function clone(input) {
        return JSON.parse(JSON.stringify(input));
    }


    /**
     * Builds an array of every mentioned class name inside the
     * classesByFile object.
     *
     * @return {Array.<string>}
     */
    function combineClasses() {
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
     * Middleware function.
     *
     * @param {Object} files
     * @param {Object} metalsmith
     * @param {Function} done
     */
    return function (files, metalsmith, done) {
        var acss, allClasses, cssString, mergedConfig;

        acss = new Atomizer();

        if (options.forget) {
            classesByFile = {};
        }

        if (options.addRules) {
            acss.addRules(options.addRules);
        }

        Object.keys(files).forEach(function (file) {
            var classes, html;

            if (matcher.match(file)) {
                // Convert Buffers to strings
                html = files[file].contents.toString(options.bufferEncoding);
                classes = acss.findClassNames(html);
                debug(file + ": " + classes.join(" "));
                classesByFile[file] = classes;
            }
        });

        allClasses = combineClasses();

        // Atomizer modifies the object passed as the second parameter,
        // so we use `clone()` to make sure our options are not permanently
        // altered.  This makes it forget class names that are not listed
        // in allClasses.
        mergedConfig = acss.getConfig(allClasses, clone(options.acssConfig));
        cssString = acss.getCss(mergedConfig, options.setOptions);

        files[options.destination] = {
            contents: Buffer.from(cssString, options.bufferEncoding),
            mode: options.destinationMode
        };

        done();
    };
};
