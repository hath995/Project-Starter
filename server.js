
var Hapi = require('hapi');
var moment = require('moment');
var ansi = require('simple-ansi');
var mysql = require('mysql');
var creds = require('./creds');

var mydb = mysql.createConnection({
  host  : 'localhost',
  database: 'sakila',
  user  : creds.name,
  password: creds.pass
});
mydb.connect();

var debug = true;
var options = {
  views: {
    engines: { html: 'handlebars'},
    path: __dirname + '/views',
    partialsPath: __dirname + '/views/partials',
    helpersPath: __dirname + '/views/helpers'
  },
  cors: {
    origin: ["creativelive.com","localhost","dev.creativelive.com"]
  }
};
var server_port = 8000;
var server = new Hapi.Server('localhost',server_port, options);

function viewHandler(request, reply) {
  mydb.query('SELECT * FROM actor LIMIT 10', function(err, rows, fields) {
    reply.view("index", {people: rows});
  });
}

function receiveQuestions(request, reply) {
  console.log(request.payload);
  console.log(request.payload.uploads);
  reply();
}

function dataHandler(request, reply) {
  var page = parseInt(request.query.page);
  var skip = page*10;
  mydb.query('SELECT * FROM actor LIMIT '+skip+', 10', function(err, rows, fields) {
    reply({people:rows});
  });
}

server.route([
  { method: 'GET', path: '/', handler: viewHandler},
  { method: 'GET', path: '/data', handler: dataHandler},
  { method: 'POST', path: '/submit', handler: receiveQuestions,
    config: {}
  },
  { method: 'GET', path: '/vendor/{stuff*}', handler: {directory: {path: "./vendor/"}}}
]);

server.on('request', function(request, event, tags) {
  'use strict';
  var now, time;

  if (debug === true) {
    now = moment().format('HH:mm:ss');
    time = ansi.bold + ansi.gray + now + ansi.reset;
    console.log(time, '[' + ansi.green + request.method.toUpperCase() + ansi.reset
      + ']', ansi.blue + ansi.bold + request.path + ansi.reset);
    if (request.params && request.params.length > 0) {
      console.log(ansi.yellow,'\tParams: ', request.params, ansi.reset);
    }
    if (request.payload) {
      console.log(ansi.cyan,'\tPayload: ', request.payload, ansi.reset);
    }
    if (request.query && Object.keys(request.query).length > 0) {
      console.log(ansi.magenta,'\tQuery: ', request.query, ansi.reset);
    }
  }
});

server.start( function() {
  now = moment().format('HH:mm:ss');
  time = ansi.bold + ansi.gray + now + ansi.reset;
  console.log('['+ ansi.green + 'INFO' + ansi.reset + ']' + ' ' + time + ' Starting HAPI server at port: ' + ansi.blue + server_port + ansi.reset);
});



  //{ method: 'GET', path: '/vendor/jquery-2.1.0.min.js', handler: {file: {path: "./vendor/jquery-2.1.0.min.js"}}}
  //{ method: 'GET', path: '/sample/{stuff*}', handler: { directory: {path:"/sample", listing: true}}},

  //{ method: 'GET', path: '/', handler: { file: { path: "./index.html"} }},
