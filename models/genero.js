const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneroSchema = new Schema(
  {
    tipo_genero: {type: String, required: true, maxLength: 100},
  }
);
  

