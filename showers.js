const express = require('express');
const expressNunjucks = require('express-nunjucks');
const winston = require('winston');
const { getScriptUrls } = require('./assets');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true, colorize: true }),
  ],
});

const app = express();
const isDev = app.get('env') === 'development';

app.enable('trust proxy');
app.set('views', `${__dirname}/templates`);
app.use(express.static('public'));

expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
});

app.get('/', (req, res) => {
  res.render('index', {
    isDev,
    scriptUrls: getScriptUrls(),
    canonicalUrl: 'https://www.meteorshowers.org/',
  });
});

app.get('/view/:shower', (req, res) => {
  let showerId = req.params.shower;
  if (showerId === 'iau-7') {
    showerId = 'Perseids';
  }
  res.render('index', {
    shower: showerId,

    isDev,
    scriptUrls: getScriptUrls(),

    canonicalUrl: `https://www.meteorshowers.org/view/${showerId}`,
  });
});

const port = process.env.PORT || 8988;
const server = app.listen(port);
logger.info('NODE_ENV:', process.env.NODE_ENV);
logger.info('Running on port', port);

const gracefulShutdown = function gracefulShutdown() {
  logger.info('Received kill signal, shutting down gracefully.');
  server.close(() => {
    logger.info('Closed out remaining connections.');
    process.exit();
  });
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 10 * 1000);
};

// Listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// Listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

module.exports = app;
