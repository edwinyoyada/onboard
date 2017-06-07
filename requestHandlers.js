var querystring = require("querystring"),
fs = require("fs"),
formidable = require("formidable"),
req = require("request");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = fs.readFile('./index.html', function (err, html) {
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

  if(request.method == 'get') {
    response.writeHead(302, {
      'Location': '/'
      //add other headers here...
    });
    response.end();
  }

  var form = new formidable.IncomingForm();
  console.log("about to parse");

  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    var oldpath =files.upload.path;
    var newpath = 'img/' + files.upload.name;
    const folder = 'img/';

    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;

      req({
        uri: "http://ocr.snapcart.id:5000/cassiopeia/api/v1.0/",
        method: "POST",
        json: {
          url: request.headers.referer + folder + files.upload.name
        }
      }, function(error, res, body) {

        var value = { message: 'image is not a receipt'};
        if (body) {
          value = body
        }

        response.write(JSON.stringify(value, null, 4));
        response.end();
      });

    });

  });
}

exports.start = start;
exports.upload = upload;
