const http = require('http');
const fs = require('fs');
const url = require('url');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/missing-file') {
        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.statusCode = 400;
            res.end('fileName query parameter is required');
            return;
        }

        const fileStream = fs.createReadStream(fileName);

        fileStream.on('error', () => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Internal Server Error');
        });

        fileStream.on('open', () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            fileStream.pipe(res);
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
