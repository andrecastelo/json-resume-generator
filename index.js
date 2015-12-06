'use strict';

var handlebars  = require('handlebars');
var fs          = require('fs');
var async       = require('async');
var mkdirp      = require('mkdirp');
var ncp         = require('ncp');
var rimraf      = require('rimraf');

var templateFile    = "template/index.html";
var additionalFiles = [ 'css', 'js' ];

async.waterfall([
    clearDistFolder,
    copyFilesToDist,
    readHandlebarsTemplate,
    compileTemplate,
    saveHtml
]);

function clearDistFolder(callback) {
    rimraf('dist', function() {
        mkdirp('dist');
        callback(null);
    });
}

function copyFilesToDist(callback) {
    ncp('template', 'dist', function(error) {
        console.log('everything copied');
        callback(null);
    });
}

function readHandlebarsTemplate(callback) {
    fs.readFile(templateFile, 'utf8', function(err, data) {
        let templateFunction = handlebars.compile(data);
        console.log('Handlebars template compiled');
        callback(null, templateFunction);
    });
}

function compileTemplate(templateFunction, callback) {
    fs.readFile('resume.json', 'utf8', function(err, data) {
        callback(null, templateFunction(JSON.parse(data)));
    });
}

function saveHtml(htmlTemplate, callback) {
    fs.writeFile('dist/index.html', htmlTemplate, function(err) {
        console.log('resume.html generated');
        callback(null);
    });
}
