const morgan = require('morgan');

/**
 * Class
 */
class ServerUtils {
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
    const address = server.address();

    debug(`Listening on ${address}`);
  }
}
