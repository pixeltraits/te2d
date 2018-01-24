const app = require('../app');
const ServerUtils = require('./ServerUtils');
const http = require('http');

const port = '1338';
const server = http.createServer(app);
const serverUtils = new ServerUtils(server);

/**
 * Create HTTP server.
 */
server.listen(port);
server.on('error', serverUtils.onError);
server.on('listening', serverUtils.onListening);

/**
 * Get port from environment and store in Express.
 */
app.set('port', port);
