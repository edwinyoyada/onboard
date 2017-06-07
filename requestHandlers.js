var querystring = require("querystring"),
fs = require("fs"),
formidable = require("formidable"),
req = require("request"),
sharp = require("sharp"),
mu = require("mu2");

function start(response) {
  console.log("Request handler 'start' was called.");

  fs.readFile('./index.html', function (err, html) {
    if (err) {
      throw err;
    }
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  });

}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  if(request.method == 'GET') {
    response.writeHead(302, {
      'Location': '/'
    });
    response.end();
    return;
  }

  var form = new formidable.IncomingForm();
  console.log("about to parse");

  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    sharp(files.upload.path).resize(1400).png().toFile('img/' + files.upload.name, function (err, info) {
      if (err) throw err;


      req({
        uri: "http://ocr.snapcart.id:5000/cassiopeia/api/v1.0/",
        method: "POST",
        json: {
          url: 'http://i.imgur.com/v2aUkKZ.jpg' //request.headers.referer + 'img/' + files.upload.name
        }
      }, function(error, res, body) {
        if (body) {
          var stream = mu.compileAndRender('./template_success.html', body);
          stream.pipe(response);
        } else {
          var stream = mu.compileAndRender('./template_error.html', { message: 'image is not a receipt' });
          stream.pipe(response);
        }
      });
    });

  });
}

exports.start = start;
exports.upload = upload;
