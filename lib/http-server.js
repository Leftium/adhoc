var path = require('path'),
    union = require('union'),
    logger = require('./middleware/logger'),
    favicon = require('./middleware/favicon'),
    static = require('./middleware/static'),
    directory = require('./middleware/directory');

exports.createServer = function (options) {
    options = options || {};

    options.root      = options.root      || './';
    options.headers   = options.headers   || {};

    options.root = path.resolve(options.root);
    options.icons = true;

    var need_newline = false;
    var server = union.createServer({
        before: [
            logger(function(tokens, req, res){
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
            }),
            favicon(),
            static(options.root, options),
            directory(options.root, options)
        ],
        headers: options.headers
    });

    server.root = options.root;

    return server;
};


