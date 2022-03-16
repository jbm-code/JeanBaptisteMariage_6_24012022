const sauceModel = require('../models/sauceModel.js');
//permet d'accéder au systeme de fichiers (supp des images)
const fs =require('fs');

exports.createThing = (req, res, next) => {
    //on transforme la chaine de caractères en objet json
    const sauceObject = JSON.parse(req.body.sauce);
    //on supprime l'id créé automatiquement par MongoDB
    delete sauceObject._id;

    const newSauce = new sauceModel({
      ...sauceObject, //détaille tous les champs de la requête
      //on recupere de maniere dynamique l'url defini par multer
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    newSauce.save()  //le methode save() renvoie une promesse
      .then(() => res.status(201).json({message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  }
exports.modifyThing = (req, res, next) => {
  sauceModel.findOne({ _id:req.params.id })
        .then(thing => {
         if (thing.userId !== req.userAuth.userId) {  
          res.status(400).json({ message: 'Votre authentification ne vous autorise pas cette action !'})
        }
          else if (thing.userId === req.userAuth.userId) {
            const sauceObject = req.file ? //le fichier image existe-t-il ?
                // si oui
                {   ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                // sinon    
                } : {  ...req.body };
            sauceModel.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet modifié !'}))
              .then (console.log("objet modifié"))
              .catch(error => res.status(400).json({ error }));
            }})
            .catch(error => res.status(400).json({ message: 'ne marche pas !'}));     
                
}
exports.deleteThing =  (req, res, next) => {
    sauceModel.findOne({ _id:req.params.id })
        .then(thing => {
         if (thing.userId !== req.userAuth.userId) {  
          res.status(400).json({ message: 'Votre authentification ne vous autorise pas cette action !'})
        }
          else if (thing.userId === req.userAuth.userId) {  
          const filename = thing.imageUrl.split('/images')[1]; // [1] seconde partie du split
            //appel fonction du package fs : unlink pour supprimer
            fs.unlink (`images/${filename}`, () => {            
            sauceModel.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .then (console.log("objet supprimé"))
                .catch(error => res.status(400).json({ error }));        
            })                                
        }})
        .catch(error => res.status(400).json({ message: 'ne marche pas !'}));
}   
        
exports.getOneThing = (req, res, next) => {

    sauceModel.findOne({ _id: req.params.id })
        .then(objetSelectionné => res.status(200).json(objetSelectionné))
        .catch(error => res.status(404).json({ error}));
}
exports.getAllThing =(req, res, next) => {
    sauceModel.find()
    .then(objetsExistants => res.status(200).json(objetsExistants))
    .catch(error => res.status(400).json({ error }))
}

exports.likeThing = (req, res, next) => {

    if (req.body.like === 0) {
          sauceModel.findOne({ _id: req.params.id })
          //console.log("req.params.id =", _id)
            .then((sauce) => {
              if (sauce.usersLiked.find(user => user === req.body.userId)) {
                sauceModel.updateOne({ _id: req.params.id }, {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: req.body.userId },
                  _id: req.params.id
                })
                  .then(() => { res.status(201).json({ message: 'Changement d avis : tu n aimes plus en fait !!' }); })
                  .catch((error) => { res.status(400).json({ error: error }); });
    
              } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                sauceModel.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes: -1 },
                  $pull: { usersDisliked: req.body.userId },
                  _id: req.params.id
                })
                  .then(() => { res.status(201).json({ message: 'Changement d avis : tu aimes en fait !!' }); })
                  .catch((error) => { res.status(400).json({ error: error }); });
              }
            })
            .catch((error) => { res.status(404).json({ error: error }); });
    }
    else if (req.body.like === 1) {
        sauceModel.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    }
    else if (req.body.like === -1) {
          sauceModel.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
            _id: req.params.id
          })
            .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
            .catch((error) => { res.status(400).json({ error: error }); });
    }
}
    