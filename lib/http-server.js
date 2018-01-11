var path = require('path'),
    connect = require('connect'),
    logger = require('./middleware/logger'),
    favicon = require('./middleware/favicon'),
    static = require('serve-static'),
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
        if (res.statusCode < 300) {
            if (options.verbosity < 3) {
                process.stdout.write('2'.bold.green);
                need_newline = true;
                return;
            }
        } else if (res.statusCode < 400) {
            if (options.verbosity < 4) {
                process.stdout.write('3'.cyan);
                need_newline = true;
                return;
            }
        } else if (res.statusCode < 500) {
            if (options.verbosity < 2) {
                process.stdout.write('4'.bold.yellow);
                need_newline = true;
                return;
            }
        } else if (res.statusCode < 600) {
            if (options.verbosity < 2) {
                process.stdout.write('5'.bold.red);
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

    /**/
    var server = connect();

    server.use( logger(adaptiveLogger) );
    server.use( favicon() );

    if (livereloadPort) {
        server.use( connectLivereload({
            port: livereloadPort,
        }) );
    }

    var livereload = connectLivereload({
            port: livereloadPort,
        });


    server.use( function(req, res, next) {
        // console.log(res);
        livereload(req, res, next);
    });

    server.use( static(options.root, options) );
    server.use( directory(options.root, options) );

    server.use( function(req, res, next) {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<body>Not found!</body>');
    });

    server.root = options.root;

    return server;
};
