/*
    Sauce Controller
    Contains the master piece of the process related to sauces.
    All routes are authenticated (Prerequsite process completed prior to this code) 
*/
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Create a sauce
exports.createSauce = (req, res, next) => {    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
// Feed DB
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré'})})
        .catch((error) => { res.status(400).json({ error: error })});
};

/* Like / Dislike sauce
   Like values
   0: User cancels a previous Like/Dislike (related counter decremented / User removed from the related array (usersLiked or usersDisliked))
   1: User likes the sauce (likes counter incremented, usersLiked array fed)
   -1: User dislikes the sauce (disLikes counter incremented, usersDisliked array fed)
*/
exports.likeSauce = (req, res, next) => {    
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const sauceObject = {
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked
            };           
            switch (req.body.like) { 
                case 1:                 
                    sauceObject.likes++;
                    sauceObject.usersLiked.push(req.body.userId);
                    break;
                case -1:
                    sauceObject.dislikes++;
                    sauceObject.usersDisliked.push(req.body.userId);
                    break;
                case 0:   
                    if (sauceObject.usersLiked.indexOf(req.body.userId) >= 0) {                             
                        sauceObject.usersLiked.splice(sauceObject.usersLiked.indexOf(req.body.userId), 1);
                        sauceObject.likes--;
                    } else if (sauceObject.usersDisliked.indexOf(req.body.userId) >= 0) {                                       
                        sauceObject.usersDisliked.splice(sauceObject.usersDisliked.indexOf(req.body.userId), 1);
                        sauceObject.dislikes--;
                    }
                    break;
                default:
                    console.log(`Case ${req.body.like} not considered`);
            }                                     
// Update DB
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => { res.status(200).json({ message: 'Objet Modifié' })})
                .catch(error => { res.status(401).json({ error: error })});
        })            
        .catch(error => { res.status(400).json({ error: error })});    
};

/*
    Existing sauce changed
    2 modes:
    Request could contain an image file or not.
    Depending on the mode, the request content dropped by multer might differ 
    When includes a file, the body passed is a string that needs to be parsed.
    When no file, the body passed is directly a JSON format
    The process also ensures the user owns the sauce. Otherwise user cannot amend a
    sauce that doesn't belong to her/him
*/
exports.modifySauce = (req, res, next) => { 
// Checks the request includes a file to determin the mode   
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};    
    
    delete sauceObject._userId; 
// Research the sauce in DB 
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non-autorisé' });    
            } else { 
// When an image is loaded, the original file attached to the sauce is removed to
// save disk space 
                if (req.file !== undefined) {              
                    const filename = sauce.imageUrl.split('/images')[1];                                
                    fs.unlink(`images/${filename}`, () => {
                        console.log('Original file removed');
                    });
                }  
// Update DB            
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => { res.status(200).json({ message: 'Objet Modifié' })})
                .catch(error => { res.status(401).json({ error: error })});
            }})            
        .catch(error => { res.status(400).json({ error: error })});    
};

/*
    Remove a sauce.
    - Validate user owns the sauce otherwase cannot remove the sauce
    - If user is authorised process removed record from DB but also remove loaded file
    from directory to save disk space
*/
exports.deleteSauce = (req, res, next) => {    
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {                
                res.status(403).json({ message: 'Non-autorisé' });    
            } else { 
// Remove file on disk               
                const filename = sauce.imageUrl.split('/images')[1];                                
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Objet Supprimé' }))
                        .catch(error => res.status(400).json({ error: error }));
                });                
            }
        })            
        .catch(error => { console.log('Error 500'); res.status(500).json({ error: error })});     
};

/*
    A single sauce selected on client.
    Returns details related to the sauce searching the DB
*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error: error }));
};
/*
    All sauces requested to be displyed on client
*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {res.status(400).json({ error: error })});    
};