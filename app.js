/*
    App managing the high level orientation of the process
    Contains the DB connection piece and drive entering requests from client
*/
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie'))
        .catch(() => console.log('Connexion à MongoDB échouée'));    
        
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');    
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

/* Call the router for all routes defined in the external js file dedicated to it. (Imported above).
   It contains the root path. It has been removed from the router design - 
   see sauce and user.js in routes dir which only keep the endpoint component of the route
*/
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
// Loaded images route 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;