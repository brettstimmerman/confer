var fs       = require('fs'),
    path     = require('path'),
    compress = require('json-compressor'),
    parents  = require('parents'),
    exists   = fs.existsSync,
    readFile = fs.readFileSync,
    confer;

module.exports = confer = function confer(file, dir) {
    if  (file.indexOf(path.sep) === -1) {
        file = locateFile(file, dir);
    }
    else {
        file = path.resolve(file);

        if (!exists(file)) {
            file = false;
        }
    }

    return file && JSON.parse(compress(readFile(file, 'utf8')));
};

var locateFile = confer.locateFile = function (file, dir) {
    var dirs = parents(path.resolve(dir || process.cwd())),
        home = path.join(process.env.HOME, file),
        found;

    while (!found && dirs.length) {
        found = path.join(dirs.shift(), file);

        if (!exists(found)) {
            found = null;
        }
    }

    if (found) {
        return found;
    }

    if (exists(home)) {
        return home;
    }

    return false;
};
