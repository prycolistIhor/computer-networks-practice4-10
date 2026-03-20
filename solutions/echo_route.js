const http = require('http');
const { URL } = require('url');

const port = process.argv[2];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/echo') {
    const msg = parsedUrl.searchParams.get('msg') || '';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(msg);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
