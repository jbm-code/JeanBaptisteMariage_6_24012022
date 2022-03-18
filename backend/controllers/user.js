// bcrypt servira a hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt')
const User = require('../models/users')
// jsonwebtoken permet d'attribuer un token à un utilisateur quand il se connecte
const jwt = require('jsonwebtoken')

// enregistre un nouvel utilisateur et on crypte son mot de passe
exports.signup = (req, res, next) => { 
    bcrypt.hash(req.body.password, 10) // on fait 10 tours de hashage
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() 
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// connexion et création d'un token de validation, valable 24h
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) { return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ userId: user._id, token: jwt.sign(
                { userId: user._id },
                process.env.jwt_key,
                { expiresIn: '24h' }
            )})
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };