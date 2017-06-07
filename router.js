var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')

function route(handle, pathname, res, req) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](res, req);
  } else {
    console.log("No request handler found for " + pathname);
     var serve = serveStatic('./', {
  'index': false,
});
     serve(req, res, finalhandler(req, res));

  }
}

exports.route = route;
