var http = require('http');
var fs = require('fs');
var url = require('url');

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
            <h1 style="text-align: center;"><a href="/">나의 커뮤니티</a></h1>
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
            <h1 style="text-align: center;"><a href="/">나의 커뮤니티</a></h1>
            <div style="text-align: center;"><a href="/create">새로운 글 만들기</a></div>
            <div style="text-align: center;"><strong>:글 목록:</strong></div>
            ${list}
        </body>
        </html>`
    }
}

function MakeList(files){
    let list = ``
    for (i=0;i<files.length;i++){
        list = list + `
        <li style="text-align: center; list-style: none;">
            <a href="?id=${encodeURIComponent(files[i])}">${files[i]}</a>
        <li>`
    }
    return list
}

function MakePost(title,description){
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body>
        <h1 style="text-align: center;"><a href="/">나의 커뮤니티</a></h1><br>
        <h1 style="text-align: center;">${title}</h1><br><br>
        <div style="text-align: center;"><strong>${description}</strong></div>
    </body>
    </html>`
}

var app = http.createServer(function(request,response){
    _url = request.url;
    pathname = url.parse(_url,true).pathname;
    query = url.parse(_url,true).query;
    response.writeHead(200);
    var template = ``;
    if (pathname == `/`){
        if (query.id != null){
            fs.readFile(`data2/${query.id}`,`utf-8`,(err,data)=>{
                if (data == undefined){
                    response.writeHead(302, {Location: `/`});
                }
                template = MakePost(query.id,data);
                response.end(template);
            })
        }else {
            fs.readdir(`data2`,`utf-8`,(err,data)=>{
                list = MakeList(data);
                template = makeTemplate(list,false);
                response.end(template);
            });
        }
    } else if (pathname == `/create`) {
        template = makeTemplate(``,true);
        response.end(template);
    } else if (pathname == `/create-process`) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var title = new URLSearchParams(body).get(`title`);
            var description = new URLSearchParams(body).get(`description`);
            const Decoding = new Promise((resolve,reject)=>{
                resolve([decodeURI(title),decodeURI(description)]);
            });
            Decoding.then((value) =>{
                console.log(value);
                fs.writeFile(`data2/${value[0]}`,value[1],`utf-8`,(err) =>{
                    response.writeHead(302, {Location: `/?id=${encodeURIComponent(title)}`});
                    response.end()
                });
            })
        });
    }
});

app.listen(6974);
