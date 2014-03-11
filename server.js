
var Hapi = require('hapi');
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
var server = new Hapi.Server('localhost',8000, options);

function viewHandler(request, reply) {
  reply.view("index", {});
}
var receivedAnswers = [];

server.route([
  { method: 'GET', path: '/', handler: viewHandler},
  { method: 'POST', path: '/submit', handler: receiveQuestions},
  { method: 'GET', path: '/vendor/{stuff*}', handler: {directory: {path: "./vendor/"}}}
]);

server.start();

  //{ method: 'GET', path: '/vendor/jquery-2.1.0.min.js', handler: {file: {path: "./vendor/jquery-2.1.0.min.js"}}}
  //{ method: 'GET', path: '/sample/{stuff*}', handler: { directory: {path:"/sample", listing: true}}},

  //{ method: 'GET', path: '/', handler: { file: { path: "./index.html"} }},
