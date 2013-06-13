
/*!
 * Connect - directory
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

// TODO: icon / style for directories
// TODO: arrow key navigation
// TODO: make icons extensible

/**
 * Module dependencies.
 */

var fs = require('fs')
  , parse = require('url').parse
  , utils = require('../utils')
  , path = require('path')
  , normalize = path.normalize
  , extname = path.extname
  , join = path.join;

/*!
 * Icon cache.
 */

var cache = {};

/**
 * Directory:
 *
 * Serve directory listings with the given `root` path.
 *
 * Options:
 *
 *  - `hidden` display hidden (dot) files. Defaults to false.
 *  - `useIcons`  display icons. Defaults to false.
 *  - `filter` Apply this filter function to files. Defaults to false.
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function directory(root, options){
  options = options || {};

  // root required
  if (!root) throw new Error('directory() root path required');
  var hidden = options.hidden
    , useIcons = options.icons
    , filter = options.filter
    , root = normalize(root);

  return function directory(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();

    var accept = req.headers.accept || 'text/plain'
      , url = parse(req.url)
      , dir = decodeURIComponent(url.pathname)
      , path = normalize(join(root, dir))
      , originalUrl = parse(req.originalUrl)
      , originalDir = decodeURIComponent(originalUrl.pathname)
      , showUp = path != root && path != root + '/';

    // null byte(s), bad request
    if (~path.indexOf('\0')) return next(utils.error(400));

    // malicious path, forbidden
    if (0 != path.indexOf(root)) return next(utils.error(403));

    // check if we have a directory
    fs.stat(path, function(err, stat){
      if (err) return 'ENOENT' == err.code
        ? next()
        : next(err);

      if (!stat.isDirectory()) return next();

      // fetch files
      fs.readdir(path, function(err, files){
        if (err) return next(err);
        if (!hidden) files = removeHidden(files);
        if (filter) files = files.filter(filter);

        var files_meta = {
            '..': {
                isDirectory: true,
                icon: icons['folder']
            }
        };

        for (var i = 0; i < files.length; i++) {
            var filename = files[i];
            var meta = {
                isDirectory:  fs.statSync(path + filename).isDirectory()
            };

            if (meta.isDirectory) {
                meta.icon = icons['folder'];
            } else {
                meta.icon = icons[extname(filename)] || icons.default;
            }

            files_meta[filename] = meta;
        }

        files.sort(function(a, b) {
            // directories before files
            if (files_meta[a].isDirectory && !files_meta[b].isDirectory) {
              return -1;
            }
            if (!files_meta[a].isDirectory && files_meta[b].isDirectory) {
              return 1;
            }
            // fallback on string compare
            return a.localeCompare(b);
        });

        // content-negotiation
        for (var key in exports) {
          if (~accept.indexOf(key) || ~accept.indexOf('*/*')) {
            exports[key](req, res, files, next, originalDir, showUp, useIcons, files_meta);
            return;
          }
        }

        // not acceptable
        next(utils.error(406));
      });
    });
  };
};

/**
 * Respond with text/html.
 */

exports.html = function(req, res, files, next, dir, showUp, useIcons, files_meta){
  fs.readFile(__dirname + '/../public/directory.html', 'utf8', function(err, str){
    if (err) return next(err);
    fs.readFile(__dirname + '/../public/style.css', 'utf8', function(err, style){
      if (err) return next(err);
      if (showUp) files.unshift('..');
      str = str
        .replace('{style}', style)
        .replace('{files}', html(files, dir, useIcons, files_meta))
        .replace('{directory}', dir)
        .replace('{linked-path}', htmlPath(dir));
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', str.length);
      res.end(str);
    });
  });
};

/**
 * Respond with application/json.
 */

exports.json = function(req, res, files){
  files = JSON.stringify(files);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', files.length);
  res.end(files);
};

/**
 * Respond with text/plain.
 */

exports.plain = function(req, res, files){
  files = files.join('\n') + '\n';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', files.length);
  res.end(files);
};

/**
 * Map html `dir`, returning a linked path.
 */

function htmlPath(dir) {
  var curr = [];
  return dir.split('/').map(function(part){
    curr.push(part);
    return '<a href="' + curr.join('/') + '">' + part + '</a>';
  }).join(' / ');
}

/**
 * Map html `files`, returning an html unordered list.
 */

function html(files, dir, useIcons, files_meta) {
  return '<ul id="files">' + files.map(function(file){
    var icon = ''
      , classes = [];

    if (useIcons) {
      icon = files_meta[file].icon;
      icon = '<img src="data:image/png;base64,' + load(icon) + '" />';
      classes.push('icon');
    }

    return '<li><a href="'
      + join(dir, file).replace(/\\/g, '/')
      + '" class="'
      + classes.join(' ') + '"'
      + ' title="' + file + '">'
      + icon + file + '</a></li>';

  }).join('\n') + '</ul>';
}

/**
 * Load and cache the given `icon`.
 *
 * @param {String} icon
 * @return {String}
 * @api private
 */

function load(icon) {
  if (cache[icon]) return cache[icon];
  return cache[icon] = fs.readFileSync(__dirname + '/../public/icons/' + icon, 'base64');
}

/**
 * Filter "hidden" `files`, aka files
 * beginning with a `.`.
 *
 * @param {Array} files
 * @return {Array}
 * @api private
 */

function removeHidden(files) {
  return files.filter(function(file){
    return '.' != file[0];
  });
}

/**
 * Icon map.
 */

var icons = {
   'default': 'page_white.png'
 , 'folder': 'folder.png'
 , '.html': 'page_white_code.png'
 , '.htm': 'page_white_code.png'
};
