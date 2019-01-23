import net from 'net';

export const HTTP_BASE_ADDRESS = 3100;
export const HTTP_REDIRECT_ADDRESS = 3001;
export const HTTPS_ADDRESS = 3443;

export const tcpConnection = conn => {
  conn.on('error', err => console.log('tcp connection error:', err.stack));
  conn.once('data', buf => {
    // A TLS handshake record starts with byte 22
    const address = buf[0] === 22 ? HTTPS_ADDRESS : HTTP_REDIRECT_ADDRESS;
    let proxy = net.createConnection(address, () => {
      proxy.write(buf);
      conn.pipe(proxy).pipe(conn);
    });
  });
};

export const httpConnection = (req, res) => {
  const host = req.headers['host'];
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
};
