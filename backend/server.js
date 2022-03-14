console.log("hello world");
// le module http fournit méthodes et classes
const http = require('http');
//on importe notre propre fichier, app.js
const app = require('./app');

// normalizePort configure le port de connection
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); //port 3000 par defaut
app.set('port', port);

// errorHandler gère les differentes erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// fonction qui sera exécutée a chaque appel effectué vers ce serveur
// https necessite un certificat ssl, a obtenir avec un nom de domaine
const server = http.createServer(app)

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Prêt à écouter les requètes au port ' + bind);
});

server.listen(port);

