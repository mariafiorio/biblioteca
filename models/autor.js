const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutorSchema = new Schema(
  {
    primeiro_nome: {type: String, required: true, maxLength: 100},
    familia_nome: {type: String, required: true, maxLength: 100},
    data_de_nascimento: {type: Date}
  }
);

module.exports = mongoose.model('???', AutorSchema); 


  
