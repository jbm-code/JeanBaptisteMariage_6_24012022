
console.log("lancement de app.js")
// express = framework basé sur node.js, permet de déployer les API rapidement
const express = require('express');
// mongoose = connection a mongoDB, base de données NoSQL
const mongoose = require('mongoose');
// bodyParser = extrait l'objet JSON des requêtes post
const bodyParser = require('body-parser');
// path = plugin pour charger des images
const path = require('path');

//on importe les routes
const sauceRoutes = require('./routes/sauceRoutes.js')
const userRoutes = require('./routes/user')

const app = express();

mongoose.connect('mongodb+srv://jbm:NouveauCode@cluster0.exfhg.mongodb.net/hot-takes?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS <<Cross Origin Resource Sharing>>, systeme de sécrutité qui, par défaut, 
// bloque les appels HTTP entre des serveurs différents.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//donne accès au corps de la requête
app.use(bodyParser.json());
//gestion  de la ressource image de facon statique
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

//exporter depuis les autres fichiers, notamment notre server node
module.exports = app;