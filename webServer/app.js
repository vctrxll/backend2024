const http = require('http');

const server = http.createServer((req,res) => {
    res.write('Hello World');
    res.end();
});

server.listen(3000, '127.0.0.1');
console.log('Servidor web iniciado en http://127.0.0.1:3000');