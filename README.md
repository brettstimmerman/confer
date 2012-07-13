# confer

Locate and parse a JSON file.

Confer begins its search in the specified directory or `process.cwd()`. If a
file is not found, confer then walks up the directory tree one level at a time
until a file is found. If confer has not found a file after the walk, it will
look for a file in `$HOME`.

## Installation

``` bash
npm install confer
```

## Usage

``` js
var config = require('confer')('config.json') || {};
```

## API

### confer(file, [dir])

Locate and parse a JSON file. Returns a JSON object or `false` if a file was not
found.

* `file` {string} filename or path
* `dir` {string} (optional) directory to begin from; default is `process.cwd()`

If `file` is a path then confer will parse the given file directly, bypassing
the locate step.

### confer.locateFile(file, [dir])

Locate a file by walking up the directory tree. Returns a file path or `false`
if a file was not found.

* `file` {string} filename
* `dir` {string} (optional) directory to begin from; default is `process.cwd()`

## Tests

``` bash
npm test
```
