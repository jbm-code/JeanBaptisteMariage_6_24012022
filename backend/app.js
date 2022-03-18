
console.log("lancement de app.js")
const dotenv = require("dotenv");
dotenv.config();
console.log("jwt =", process.env.jwt_key);
console.log("userName =", process.env.db_userName);
console.log("userPass =", process.env.db_userPass);
console.log("clusterName =", process.env.db_clusterName);
console.log("DataBase =", process.env.db_name);
// express = framework basé sur node.js, permet de déployer les API rapidement
const express = require('express')
// mongoose = connection a mongoDB, base de données NoSQL
const mongoose = require('mongoose')
// bodyParser = extrait l'objet JSON des requêtes post
const bodyParser = require('body-parser')
// path = plugin pour charger des images
const path = require('path')
//helmet protege contre les vunlérabilités courantes (OWASP)
const helmet = require('helmet')
const cors = require('cors')

//on importe les routes
const sauceRoutes = require('./routes/sauceRoutes.js')
const userRoutes = require('./routes/user')

const app = express()
app.use(helmet())
app.use(cors())

//jbm:NouveauCode@cluster0.exfhg.mongodb.net/hot-takes//aEffacer///
mongoose.connect('mongodb+srv://${process.env.db_userName}:${process.env.db_userPass}@${process.env.db_clusterName}.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'))

// CORS <<Cross Origin Resource Sharing>>, systeme de sécrutité qui, par défaut, 
// bloque les appels HTTP entre des serveurs différents.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next();
  });

//donne accès au corps de la requête
app.use(bodyParser.json())
//gestion  de la ressource image de facon statique
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)


//exporter depuis les autres fichiers, notamment notre server node
module.exports = app;