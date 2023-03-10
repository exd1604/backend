/*
    User controller.
    Contains the master piece of the process related to user.
    It manages the signup and login routes.
    On sign up:     
    - password is hashed using bcrypt package.
    bcrypt is also used in login controller to validate entered password (not crpyted)
    matches the Encrypted password recorded in DB 
*/
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Sign up 
exports.signup = (req, res, next) => {
/* 
    Check password between 8 to 15 characters
    Contains:
    at least 1 lowercase, 1 uppercase, 1 numeric digit, 1 special character
*/
    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
    if (regexPassword.test(req.body.password)) {
// Hash Password
        bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10))
            .then(hash => {
                const user = new User({
                    email: req.body.email, 
                    password: hash                
                });                        
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                    .catch(error => { res.status(400).json({ error: error })});
            })
            .catch(error => res.status(500).json({ error: error }));
    } else {
        res.status(400).json({ message: 'Mot de passe invalide. (Entre 8 et 15 caractères. Doit contenir majuscule(s), minuscule(s), chiffre(s), caractère(s) spécial(aux).)'});
    }
};

// Login
exports.login = (req, res, next) => {
// Search DB using the frontend entered email
    User.findOne({ email: req.body.email })    
    .then(user => {        
        if (user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {                
                if (!valid) {                    
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                } else {                    
                    res.status(200).json({                        
                        userId: user._id,
// When login is valid, process returns an allocated token that will be used for
// authentication in the various sauces requests
                        token: jwt.sign(
                            { userId: user._id },                            
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: process.env.JWT_TOKEN_EXPIRE }
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json( { error: error } );
            });
        }            
    })
    .catch(error => {
        res.status(500).json( { error: error } );
    });
};