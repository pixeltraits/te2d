const morgan = require('morgan');
const debug = require('debug')('te2d:server');

/**
 * Class
 */
class ServerUtils {
  constructor(server) {
    this.server = server;
  }
  /**
   * Event listener for HTTP server "error" event.
   * @param {string} error The caught error
   * @return {void}
   */
  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EADDRINUSE':
        morgan(`${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   * @return {void}
   */
  onListening() {
    const address = 'localhost:1332';

    debug(`Listening on ${address}`);
  }
}

module.exports = ServerUtils;
