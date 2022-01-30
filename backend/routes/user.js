const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

//on applique les fonctions a la route, on ne l'applique pas => pas de ()
router.post('/signup',userCtrl.signup );
router.post('/login',userCtrl.login );

module.exports = router;