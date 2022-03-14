const passwordValid = require('password-validator')

const passwordSchema = new passwordValid()
passwordSchema
.is().min(6)
.is().max(20)
.has().uppercase()
.has().lowercase()

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error : "Le mot de passe doit contenir 6 à 20 caractères et au moins une minuscule et une majuscule !" + passwordSchema.validate('req.body.password', {list: true})})
    }
}