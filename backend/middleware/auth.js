// ce middleware sera appelé à toutes les routes

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on split, en ne conservant que le second élément, sans le "bear"
    const token = req.headers.authorization.split(' ')[1];
    // on compare le token avec le RANDOM_TOKEN_SECRET
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // finalement on récupère le userID
    const userId = decodedToken.userId;
    //ajout d'authentification a l'objet de requête qui contient le userId extrait du token
    req.userAuth = { userId };
    console.log("user connecté =", userId);
    console.log("user autorisé =", req.body.userId)
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID incorrect';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête non authentifiée!')
    });
  }
};