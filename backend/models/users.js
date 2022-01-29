const mongoose = require('mongoose')
//utilisation du package qui valide l'unicité de l'email
const uniqueValidator = require('mongoose-unique-validator')

//unique = true -> une  seule inscription par email
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)