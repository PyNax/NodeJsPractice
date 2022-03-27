var http = require('http');
var fs = require('fs');
var url = require('url');
const { title } = require('process');
var template = ``

function makeTemplate(list,createmode){
    if (createmode == true){
        return `<!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to my community!</title>
        </head>
        <body>
            <h1 style="text-align: center;"><a href="/">Py_nax 커뮤니티</a></h1>
            <div style="text-align: center;"><a href="/create">새로운 글 만들기</a></div>
            <form action="/create-process" method="post" id="create-form">
                <div style="text-align: center;">
                    <p><input type="text" name="title" placeholder="제목" id="title" value=""></p>
                    <p><textarea name="description" cols="30" rows="3" id="description" placeholder="설명"></textarea></p>
                    <p><input type="submit" value="완료"></p>
                </div>
            </form>
            <div style="text-align: center;"><strong>:글 목록:</strong></div>
            ${list}
        </body>
        </html>`
    } else{
        return `<!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to my community!</title>
        </head>
        <body>
            <h1 style="text-align: center;"><a href="/">Py_nax 커뮤니티</a></h1>
            <div style="text-align: center;"><a href="/create">새로운 글 만들기</a></div>
            <div style="text-align: center;"><strong>:글 목록:</strong></div>
            ${list}
        </body>
        </html>`
    }
}

var app = http.createServer(function(request,response){
    _url = request.url;
    pathname = url.parse(_url).pathname;
    query = url.parse(_url).query;
    console.log(`--------------------`);
    console.log(pathname);
    console.log(query);
    response.writeHead(200);
    if (pathname == `/`){
        template = makeTemplate(``,false);
        response.end(template);
    } else if (pathname == `/create`) {
        template = makeTemplate(``,true);
        response.end(template);
    } else if (pathname == `/create-process`) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var decoder = new TextDecoder();
            var title = new URLSearchParams(body).get(`title`);
            var description = new URLSearchParams(body).get(`description`);
            console.log(title);
            console.log(description);
            fs.writeFile(`data2/${title}`,description,`utf-8`,(err) =>{
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end()
            });
        });
    }
});

app.listen(6974);