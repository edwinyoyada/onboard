var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    req = require("request");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    var oldpath =files.upload.path;
    var newpath = 'img/' + files.upload.name;

     fs.rename(oldpath, newpath, function (err) {
       if (err) throw err;

       req({
         uri: "http://ocr.snapcart.id:5000/cassiopeia/api/v1.0/",
      method: "POST",
      form: {
        url: [request.headers.referer + files.upload.name]
      }
    }, function(error, res, body) {
      console.log(body);
      response.write(body);
      response.end();
       });

     });

  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
