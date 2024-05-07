const express = require ('express')
const app = express();
const bodyParser = require ('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); 
const bookRoutes = require('./routes/book');  // vu 
const userRoutes = require('./routes/user'); // vu 


mongoose.connect('mongodb+srv://Fabien:openclass@cluster0.28idr2c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(cors());
app.use(bodyParser.json());  // il etait a la fin  juste avant le module.exports et donc les identifiants n'etaient pas convertis en un objet JavaScript au bon moment

// Middleware CORS pour l'application
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Routes pour les ressources
app.use('/api/books', bookRoutes);   // vu 
app.use('/api/auth', userRoutes); // vu 
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use(logger);


module.exports = app;

//const logger = function (req, res, next) {
  //console.log('GOT REQUEST !');
 // console.log(req.originalUrl);
 //  const params = Object.keys(req.body).length === 0 ? req.query : req.body;
 // console.log(params);
 // next();
//};