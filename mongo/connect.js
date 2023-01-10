// Connexion to MONGODB
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Connexion using .env variables 
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie'))
        .catch(() => console.log('Connexion à MongoDB échouée')); 

module.exports = mongoose;