const express = require('express');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const Thing = require('./models/thing');
const app = express();


app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use('/api/stuff', stuffRoutes);

module.exports = app;
