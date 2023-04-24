const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;





http.createServer(function(request, response) {
  const { url } = request;
  if (url.includes("favicon")) {
    response.write('');
    response.end('');
    return;
  }
  let filepath = url === "/" ? path.resolve(__dirname, "index.html") : path.resolve(__dirname, url.replace("/", ""));
  fs.readFile(filepath, function(err, content) {
    if (err) throw err;
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(content)
    response.end();
  });

}).listen(PORT, () => {
  console.log('serving client on port ' + PORT);
});
