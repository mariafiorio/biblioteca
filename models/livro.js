const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LivroSchema = new Schema(
  {
    titulo: { type: String, required: true },
    autor: { type: Schema.Types.ObjectId, ref: 'Autor', required: true },
    sumario: { type: String, required: true },
    isbn: { type: String, required: true },
    generos: [{ type: Schema.Types.ObjectId, ref: 'Genero' }]
  }
);

module.exports = mongoose.model('Livro', LivroSchema);

  