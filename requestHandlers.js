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

  // '<html>'+
  //   '<head>'+
  //   '<meta http-equiv="Content-Type" '+
  //   'content="text/html; charset=UTF-8" />'+
  //   '</head>'+
  //   '<body>'+
  //
    // '<form action="/upload" enctype="multipart/form-data" '+
    // 'method="post">'+
    // '<input type="file" name="upload" multiple="multiple">'+
    // '<input type="submit" value="Upload file" />'+
    // '</form>'+
  //
  //   '</body>'+
  //
  //   '</html>';



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
      json: {
        url: [request.headers.referer + files.upload.name]
      }
    }, function(error, res, body) {


      //fs.writeFile('test.json', JSON.stringify( null, 4));

      response.write(JSON.stringify(body, null, 4));
      response.end();
       });

     });

  });
}

exports.start = start;
exports.upload = upload;
