var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = undefined;
        fs.readdir(`data`,`utf-8`,function(err,file){
            var list = `<ul>`;
            for (i=0;i<file.length;i++) {
                list = list + `<li><a href="/?id=${file[i]}">${file[i]}</a></li>`;
            }
            list = list + `</ul>`;
            var template = `
            <!doctype html>
            <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${description}</p>
                </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template);
        });
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var list = undefined;
            fs.readdir(`data`,`utf-8`,function(err,file){
                var list = `<ul>`;
                for (i=0;i<file.length;i++) {
                    list = list + `<li><a href="/?id=${file[i]}">${file[i]}</a></li>`;
                }
                list = list + `</ul>`;
                var title = queryData.id;
                var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);