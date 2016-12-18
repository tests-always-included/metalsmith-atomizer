"use strict";

var plugin;

plugin = require("..");

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
    Object.keys(files).forEach(function (file) {
        files[file].contents = Buffer.from(files[file].contents, "utf8");
    });

    // The plugin ignores the metalsmith object and is synchronous,
    // so the "done" callback doesn't need to do anything.
    plugin(config)(files, {}, function () {});

    // Convert everything to strings for easy comparisons
    Object.keys(files).forEach(function (file) {
        files[file].contents = files[file].contents.toString("utf8");
    });

    return files;
}

describe("metalsmith-atomizer", function () {
    it("generates a zero byte file with no input", function () {
        var files;

        files = runPlugin();
        expect(files["atomic.css"]).toEqual({
            contents: "",
            mode: "0644"
        });
    });
    it("matches expected files by default", function () {
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
        runPlugin(files);
        expect(files["atomic.css"]).toEqual({
            contents: jasmine.any(String),
            mode: "0644"
        });
        expect(files["atomic.css"].contents).toContain("#fff");
        expect(files["atomic.css"].contents).toContain("#fff");
        expect(files["atomic.css"].contents).not.toContain("#000");
    });
    it("matches files when configured by options", function () {
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
        runPlugin(files, {
            match: "**/*.css"
        });
        expect(files["atomic.css"]).toEqual({
            contents: jasmine.any(String),
            mode: "0644"
        });
        expect(files["atomic.css"].contents).not.toContain("#fff");
        expect(files["atomic.css"].contents).not.toContain("#777");
        expect(files["atomic.css"].contents).toContain("#000");
    });
    it("allows the destination file to be renamed", function () {
        var files;

        files = runPlugin({}, {
            destination: "thing.whatever"
        });
        expect(files["atomic.css"]).not.toBeDefined();
        expect(files["thing.whatever"]).toEqual({
            contents: "",
            mode: "0644"
        });
    });
    it("calls acss.addRules", function () {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Tkl(999px)\">"
            }
        };
        runPlugin(files, {
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
        });
        expect(files["atomic.css"].contents).toContain("999px");
    });
    it("uses extra config in acss.getCss", function () {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Fl(start)\">"
            }
        };
        runPlugin(files, {
            setOptions: {
                rtl: true
            }
        });
        expect(files["atomic.css"].contents).toContain("float: right");
    });
    it("uses acss.getConfig with options.acssConfig", function () {
        var files;

        files = {
            "test.html": {
                contents: "<div class=\"Fz(heading)\">"
            }
        };
        runPlugin(files, {
            acssConfig: {
                custom: {
                    heading: "123px"
                }
            }
        });
        expect(files["atomic.css"].contents).toContain("123px");
    });
});
