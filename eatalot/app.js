const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
var count = 0;
var obj = {'id':count};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  count++;
  console.log('I am called.' + count.toString());
  //res.end('Hello World\n' + count.toString());
  res.end(JSON.stringify(obj));
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});