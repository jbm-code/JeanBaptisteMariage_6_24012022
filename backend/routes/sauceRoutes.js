// on créé un routeur qu'on va ensuite importer dans app.js
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//on applique les fonctions a la route, on ne l'applique pas => pas de ()
// ! d'abord l'autentification,puis muster... !
router.post('/', auth, multer, sauceCtrl.createThing );
router.put('/:id', auth, multer, sauceCtrl.modifyThing);
router.delete('/:id',auth,  sauceCtrl.deleteThing);
router.get('/:id',auth,  sauceCtrl.getOneThing);
router.get('/',auth,  sauceCtrl.getAllThing); 
router.post('/:id/like', auth, sauceCtrl.likeThing)

module.exports = router;

