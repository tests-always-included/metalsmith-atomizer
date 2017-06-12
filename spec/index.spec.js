"use strict";

var plugin;

plugin = require("..");


/**
 * Run the plugin and return a promise.
 *
 * @param {Function} middleware
 * @param {Object} files
 * @return {Promise.<*>}
 */
function pluginAsync(middleware, files) {
    return new Promise((resolve, reject) => {
        // The plugin ignores the metalsmith object.
        middleware(files, {}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


/**
 * Kick off the plugin and send it a list of files.
 *
 * This is far easier because the entire plugin is synchronous.
 *
 * @param {Object} [files={}]
 * @param {Object} [config]
 * @return {Object} modified files
 */
function runPlugin(files, config) {
    if (!files) {
        files = {};
    }

    // Convert everything to Buffer objects
    Object.keys(files).forEach((file) => {
        files[file].contents = Buffer.from(files[file].contents, "utf8");
    });

    return pluginAsync(plugin(config), files).then(() => {
        // Convert everything to strings for easy comparisons
        Object.keys(files).forEach((file) => {
            files[file].contents = files[file].contents.toString("utf8");
        });

        return files;
    });
}

describe("metalsmith-atomizer", () => {
    it("generates a zero byte file with no input", () => {
        return runPlugin().then((files) => {
            expect(files["atomic.css"]).toEqual({
                contents: "",
                mode: "0644"
            });
        });
    });
    it("matches expected files by default", () => {
        var files;

        files = {
            "folder/test.html": {
                contents: "<div class=\"C(#fff)\">"
            },
            "folder2/skip.css": {
                contents: "<div class=\"C(#000)\">"
            },
            "another-test.htm": {
                contents: "<div class=\"C(#777)\">"
            }
        };

        return runPlugin(files).then(() => {
            expect(files["atomic.css"]).toEqual({
                contents: jasmine.any(String),
                mode: "0644"
            });
            expect(files["atomic.css"].contents).toContain("#fff");
            expect(files["atomic.css"].contents).toContain("#fff");
            expect(files["atomic.css"].contents).not.toContain("#000");
        });
    });
    it("matches files when configured by options", () => {
        var files;

        files = {
            "folder/test.html": {
                contents: "<div class=\"C(#fff)\">"
            },
            "folder2/skip.css": {
                contents: "<div class=\"C(#000)\">"
            },
            "another-test.htm": {
                contents: "<div class=\"C(#777)\">"
            }
        };

        return runPlugin(files, {
            match: "**/*.css"
        }).then(() => {
            expect(files["atomic.css"]).toEqual({
                contents: jasmine.any(String),
                mode: "0644"
            });
            expect(files["atomic.css"].contents).not.toContain("#fff");
            expect(files["atomic.css"].contents).not.toContain("#777");
            expect(files["atomic.css"].contents).toContain("#000");
        });
    });
    it("allows the destination file to be renamed", () => {
        return runPlugin({}, {
            destination: "thing.whatever"
        }).then((files) => {
            expect(files["atomic.css"]).not.toBeDefined();
            expect(files["thing.whatever"]).toEqual({
                contents: "",
                mode: "0644"
            });
        });
    });
    it("calls acss.addRules", () => {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Tkl(999px)\">"
            }
        };

        return runPlugin(files, {
            addRules: [
                {
                    type: "pattern",
                    id: "twinkle",
                    name: "Twinkle",
                    matcher: "Tkl",
                    allowParamToValue: true,
                    styles: {
                        twinkle: "$0"
                    }
                }
            ]
        }).then(() => {
            expect(files["atomic.css"].contents).toContain("999px");
        });
    });
    it("uses extra config in acss.getCss", () => {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Fl(start)\">"
            }
        };

        return runPlugin(files, {
            setOptions: {
                rtl: true
            }
        }).then(() => {
            expect(files["atomic.css"].contents).toContain("float: right");
        });
    });
    it("uses acss.getConfig with options.acssConfig", () => {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Fz(heading)\">"
            }
        };

        return runPlugin(files, {
            acssConfig: {
                custom: {
                    heading: "123px"
                }
            }
        }).then(() => {
            expect(files["atomic.css"].contents).toContain("123px");
        });
    });
    it("remembers by default", () => {
        var files, middleware;

        files = {
            "test.html": {
                contents: Buffer.from("<div class=\"W(1)\">", "utf8")
            }
        };
        middleware = plugin();

        return pluginAsync(middleware, files).then(() => {
            expect(files["atomic.css"].contents.toString("utf8")).toContain("W\\(1\\)");
            files = {
                "another-test.html": {
                    contents: Buffer.from("div class=\"H(2)\">", "utf8")
                }
            };

            return pluginAsync(middleware, files);
        }).then(() => {
            expect(files["atomic.css"].contents.toString("utf8")).toContain("W\\(1\\)");
            expect(files["atomic.css"].contents.toString("utf8")).toContain("H\\(2\\)");
        });
    });
    it("forgets previous builds", () => {
        var files, middleware;

        files = {
            "test.html": {
                contents: Buffer.from("<div class=\"W(1)\">", "utf8")
            }
        };
        middleware = plugin({
            forget: true
        });

        return pluginAsync(middleware, files).then(() => {
            expect(files["atomic.css"].contents.toString("utf8")).toContain("W\\(1\\)");
            files = {
                "another-test.html": {
                    contents: Buffer.from("div class=\"H(2)\">", "utf8")
                }
            };

            return pluginAsync(middleware, files);
        }).then(() => {
            expect(files["atomic.css"].contents.toString("utf8")).not.toContain("W\\(1\\)");
            expect(files["atomic.css"].contents.toString("utf8")).toContain("H\\(2\\)");
        });
    });
});
