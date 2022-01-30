const mongoose = require('mongoose');

//Modèle Thing : méthode Schema de Mongoose (Id généré automatiquement) 
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: {type: Number},
    dislikes: { type: Number},
    usersLiked: { type: [String]},
    usersDisliked: { type: [String]},
})

//la méthode model transforme ce schema  en un modèle utilisable
module.exports = mongoose.model('sauces', sauceSchema);