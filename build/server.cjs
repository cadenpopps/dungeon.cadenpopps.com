var http = require("http");
var fs = require("fs");
var path = require("path");

const port = 4200;

console.log("Starting server...");
http.createServer(function (request, response) {
    var filePath = "./build" + request.url;
    if (filePath == "./build/") filePath = "./build/index.html";
    if (request.url.includes("content/")) filePath = "." + request.url;

    var extname = path.extname(filePath);
    var contentType = "text/html";
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
        case ".wav":
            contentType = "audio/wav";
            break;
    }

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == "ENOENT") {
                fs.readFile("./build/404.html", function (error, content) {
                    console.log(error);
                    response.writeHead(200, {
                        "Content-Type": contentType,
                    });
                    response.end(content, "utf-8");
                });
            } else {
                response.writeHead(500);
                response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                response.end();
            }
        } else {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
        }
    });
}).listen(port);
console.log(`Server running at http://127.0.0.1:${port}/\n`);
