
console.log("lancement de app.js")
// express = framework basé sur node.js
const express = require('express');
// mongoose = connection a mongoDB
const mongoose = require('mongoose');
// bodyParser = extrait l'objet JSON des requêtes post
const bodyParser = require('body-parser');
// path = plugin pour charger des images
const path = require('path');

//on importe les routes
const sauceRoutes = require('./routes/sauceRoutes.js')
const userRoutes = require('./routes/user')

const app = express();

mongoose.connect('mongodb+srv://jbm:FaitChier@cluster0.exfhg.mongodb.net/hot-takes?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

//Headers qui permettent d'accéder a l'API
//Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), 
//des headers spécifiques de contrôle d'accès doivent être précisés 
//pour tous vos objets de réponse.
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