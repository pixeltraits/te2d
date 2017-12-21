const app = require('../app');
const ServerUtils = require('./ServerUtils');
const http = require('http');

const port = '1338';
const server = http.createServer(app);

/**
 * Create HTTP server.
 */
server.listen(port);
server.on('error', ServerUtils.onError);
server.on('listening', ServerUtils.onListening);

/**
 * Get port from environment and store in Express.
 */
app.set('port', port);
