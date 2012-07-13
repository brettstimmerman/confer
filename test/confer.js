var assert = require('assert'),
    fs   = require('fs'),
    path = require('path'),
    confer = require('../');

describe('confer()', function () {
    it('should locate and parse a file given a full path', function (done) {
        var json = confer('./test/fixtures/config.json');

        assert.equal(json.foo, false);
        assert.equal(json.bar, true);
        done();
    });

    it('should NOT locate a file given a non-existent full path', function (done) {
        var json = confer('./test/fixtures/baz/config.json');

        assert.strictEqual(json, false);
        done();
    });

    it('should locate and parse a file given no directory', function (done) {
        var cwd = process.cwd(),
            file = path.join(cwd, 'config.json'),
            json;

        fs.writeFile(file, '{"cwd":"' + cwd + '"}', 'utf8', function (err) {
            json = confer('config.json');
            assert.equal(json.cwd, cwd);
            fs.unlink(file, done);
        });
    });

    it('should locate and parse a file in a directory', function (done) {
        var json = confer('config.json', './test/fixtures');

        assert.equal(json.foo, false);
        assert.equal(json.bar, true);
        done();
    });

    it('should locate and parse a file in a subdirectory', function (done) {
        var json = confer('config.json', './test/fixtures/foo');

        assert.equal(json.foo, true);
        assert.equal(json.bar, false);
        done();
    });

    it('should locate and parse a file in a parent directory', function (done) {
        var json = confer('config.json', './test/fixtures/bar');

        assert.equal(json.foo, false);
        assert.equal(json.bar, true);
        done();
    });

    it('should locate and parse a file in a non-existent sub-directory', function (done) {
        var json = confer('config.json', './test/fixtures/baz');

        assert.equal(json.foo, false);
        assert.equal(json.bar, true);
        done();
    });

    it('should locate and parse a file in $HOME when not found in directory tree', function (done) {
        var home = process.env.HOME,
            file = path.join(home, 'config.json'),
            json;

        fs.writeFile(file, '{"home":"' + home + '"}', 'utf8', function (err) {
            json = confer('config.json', '/tmp/nowayjose');
            assert.equal(json.home, home);
            fs.unlink(file, done);
        });
    });

    it('should return false when no file is is found', function (done) {
        var json = confer('config.json', '/tmp/nowayjose');

        assert.strictEqual(false, json);
        done();
    });

    it('should ignore search directory when given with a path', function (done) {
        var json = confer(
                './test/fixtures/config.json',
                './test/fixtures/foo/config.json'
            );

        assert.equal(json.foo, false);
        assert.equal(json.bar, true);
        done();
    });

    it('should throw when invalid JSON is found', function (done) {
        assert.throws(function () {
            var json = confer.parseJSON('{[}');
        },
        function (err) {
            process.nextTick(done);
            return true;
        });
    });
});

describe('confer.locateFile()', function () {
    it('should locate a file given a filename and dir', function (done) {
        var file = confer.locateFile('config.json', 'test/fixtures');

        assert.equal(file, path.resolve('test/fixtures/config.json'));
        done();
    });

    it('should locate a file given a full path', function (done) {
        var file = confer.locateFile('/test/fixtures/foo/config.json');

        assert.equal(file, path.resolve('test/fixtures/foo/config.json'));
        done();
    });

    it('should NOT locate a file given a non-existent full path', function (done) {
        var file = confer.locateFile('test/fixtures/baz/config.json');

        assert.equal(file, false);
        done();
    });

    it('should NOT locate a file given a filename and non-existent dir', function (done) {
        var file = confer.locateFile('config.json', '/tmp/nowayjose');

        assert.equal(file, false);
        done();
    });
});
