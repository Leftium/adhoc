var path = require('path'),
    union = require('union'),
    logger = require('./middleware/logger'),
    favicon = require('./middleware/favicon'),
    static = require('./middleware/static'),
    directory = require('./middleware/directory'),
    connectLivereload = require('connect-livereload');

exports.createServer = function (options, livereloadPort) {
    options = options || {};

    options.root      = options.root      || './';
    options.headers   = options.headers   || {};

    options.root = path.resolve(options.root);
    options.icons = true;


    var need_newline = false;
    function adaptiveLogger(tokens, req, res) {
        if (options.verbosity < 1) {
            return;
        }
        if (options.verbosity == 1) {
            if (res.statusCode < 300) {
                process.stdout.write('2'.bold.green);
                need_newline = true;
                return;
            } else if (res.statusCode < 400) {
                process.stdout.write('3'.cyan);
                need_newline = true;
                return;
            }
        }
        if (need_newline) {
            process.stdout.write('\n');
        }
        need_newline = false;
        return logger.dev(tokens, req, res);
    }

    var before = [];
    before.push( logger(adaptiveLogger) );
    before.push( favicon() );
    if (livereloadPort) {
        before.push( connectLivereload({
            port: livereloadPort
        }) );
    }
    before.push( static(options.root, options) );
    before.push( directory(options.root, options) );

    var server = union.createServer({
        before: before,
        headers: options.headers
    });

    server.root = options.root;

    return server;
};
