const express = require('express')
const router = express.Router()
const password = require('../middleware/password')
const userCtrl = require('../controllers/user')

//on applique les fonctions a la route, on ne l'applique pas => pas de ()
router.post('/signup',password, userCtrl.signup );
router.post('/login',userCtrl.login );

module.exports = router;