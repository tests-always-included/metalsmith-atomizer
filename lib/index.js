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
    var matcher;

    options = options || {};
    options.bufferEncoding = options.bufferEncoding || "utf8";
    options.match = options.match || "**/*.{html,htm}";
    options.matchOptions = options.matchOptions || {};
    options.destination = options.destination || "atomic.css";
    options.destinationMode = options.destinationMode || "0644";
    options.acssConfig = options.acssConfig || {};
    options.setOptions = options.setOptions || {};
    matcher = new minimatch.Minimatch(options.match, options.matchOptions);

    /**
     * Middleware function.
     *
     * @param {Object} files
     * @param {Object} metalsmith
     * @param {Function} done
     */
    return function (files, metalsmith, done) {
        var acss, allClasses, classIndex, cssString, mergedConfig;

        acss = new Atomizer();
        allClasses = {};

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

                // Avoid .forEach() for speed
                for (classIndex = 0; classIndex < classes.length; classIndex += 1) {
                    // Deduplicate the class names
                    allClasses[classes[classIndex]] = true;
                }
            }
        });

        mergedConfig = acss.getConfig(Object.keys(allClasses), options.acssConfig);
        cssString = acss.getCss(mergedConfig, options.setOptions);

        files[options.destination] = {
            contents: Buffer.from(cssString, options.bufferEncoding),
            mode: options.destinationMode
        };

        done();
    };
};
