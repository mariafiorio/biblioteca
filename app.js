const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const appRoutes = require('./routes/app');

mongoose.connect('mongodb://127.0.0.1:27017/node-mongoose-ativextra').then(() => {
  console.log('conexao estabelecida com sucesso.')
})
.catch((error) =>{
  console.error('erro', error)
})
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Configuração do CORS 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/', appRoutes);

module.exports = app;
 