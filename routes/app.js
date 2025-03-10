const express = require('express'); 
const router = express.Router();

const Genero = require('../models/genero');
const Autor = require('../models/autor');
const Livro = require('../models/livro');

router.get('/', (req, res, next) => {
    res.render('index');
});

// *******************************************************************  
// *******************************************************************
// *******************************************************************
// ===================================================================
// *** AUTOR ***
router.get('/autor/criar', (req, res, next) => {
    res.render('autor_criar_pagina', {
        titulo: "Criar Autor"
    });
});

router.post('/autor/criar', async (req, res, next) => {
    const autor = new Autor({
        primeiro_nome: req.body.primeiro_nome,
        familia_nome: req.body.familia_nome,
        data_de_nascimento: req.body.data_de_nascimento
      });

      try{
        const autorSave = await autor.save();
        console.log("Autor salvo: " + autorSave.primeiro_nome);            
        res.redirect('/autores');      
      }
      catch(err){
        return next(err);
      }
});      

router.get('/autores', async (req, res, next) => {
    try{
      const lista_autoresRecuperado = await Autor.find({}).exec();
      res.render('autor_lista_pagina', { titulo: 'Lista de Autor', lista: lista_autoresRecuperado, listaExiste: true }); 
    }
    catch(err){
      err.stack;
      return next(err);
    }
}); 


router.get('/autor/deletar', async  (req, res, next) => {
    try{
      const lista_autoresRecuperado = await Autor.find({}).exec();
      res.render('autor_deletar_pagina', { titulo: 'Lista de Autores - Deletar', detalhes: lista_autoresRecuperado });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
  });

   
router.post('/autor/deletar', async (req, res, next) => {
        try {
          const idEnviado = req.body.idAutor;

          const [autorEncontrado, livrosEncontrados] = await Promise.all([
                 Autor.findById(idEnviado).exec(),
                 Livro.find({autor: idEnviado})
                 .populate("generos")  
                 .exec()
          ]);
       
          if (livrosEncontrados.length > 0) {
            res.render("autor_detalhes_pagina", {
              titulo: "Deletar Autor - Autor tem Livros",
              autor: autorEncontrado,
              livrosdoautor: livrosEncontrados
            });
      
            return;
          }
          else {
            const autorRecuperado = await Autor.findById(idEnviado).exec();
      
            if (autorRecuperado === null) {
              const err = new Error("autorRecuperado not found");
              err.status = 404;
              return next(err);
            }      
            const resultAutorDeletado = await autorRecuperado.deleteOne();            
            res.redirect('/autores'); 
          }
        }
        catch (err) {
            console.log(err);
        }
});


router.get('/autor/:id', async (req, res, next) => {
    try{
        const autorRecuperado = await Autor.findOne({primeiro_nome: req.params.id}).exec();
        res.render('autor_lista_pagina', { titulo: 'Autor', lista: autorRecuperado, listaExiste: false });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});     



// *******************************************************************
// *******************************************************************
// *******************************************************************
// ===================================================================
// *** GENERO ***
router.get('/genero/criar', (req, res, next) => {
    res.render('genero_criar_pagina', {
        titulo: "Criar Gênero"
    });
});

router.post('/genero/criar', async (req, res, next) => {
    const genero = new Genero({
        tipo_genero: req.body
    });

    try{
      const generoSave = await genero.save();
      res.redirect('/generos');    
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});

router.get('/generos', async (req, res, next) => {
    try{
      const lista_generosRecuperado = await Genero.find({}).exec();
      res.render('genero_???_pagina', { titulo: 'Lista de Gêneros', lista: lista_generosRecuperado, listaExiste: true });
    }
    catch(err){
      err.stack;
      return next(err);
    }
});


router.get('/generos/detalhar', async (req, res, next) => {
  try{
    const lista_generosRecuperado = await Genero.find({}).exec();
    res.render('genero_???_pagina', { titulo: 'Detalhes do Gênero', lista: lista_generosRecuperado, listaExiste: false });
  }
  catch(err){
    err.stack;
    return next(err);
  }  
});  


router.post('/genero/detalhar',  async (req, res, next) => {
  try {
    const idEnviado = req.body.idGenero;

    const [generosEncontrados, livrosEncontrados] = await Promise.all([
          Genero.findById(idEnviado).exec(),     
          Livro.find({generos: idEnviado})
          .populate("autor") 
          .exec()          
    ]);
  
    if (generosEncontrados === null) {
      const err = new Error("generosEncontrados not found");
      err.status = 404;
      return next(err);
    }

    res.render("genero_detalhes_pagina", {
        titulo: "Detalhes do Gênero",
        generos: generosEncontrados,
        livros: livrosEncontrados,
        listaExiste: true
    });
}
catch (err) {
    console.log(err);
}
});


// *******************************************************************
// *******************************************************************
// *******************************************************************
// ===================================================================
// ===================================================================
// *** LIVRO ***
router.get('/livro/criar',  async (req, res, next) => {
  try {
      const [autoresEncontrados, generosEncontrados] = await Promise.all([
             Autor.find({}).exec(),
             Genero.find({}).exec()
      ]);
    
      if (autoresEncontrados === null) {
        const err = new Error("autoresEncontrados not found");
        err.status = 404;
        return next(err);
      }

      res.render("livro_criar_pagina", {
          titulo: "Criar Livro",
          autores: autoresEncontrados,
          generos: autoresEncontrados
      });
  }
  catch (err) {
      console.log(err);
  }
});

router.post('/livro/criar', async (req, res, next) => {
    if (!Array.isArray(req.body.genero)) {
        req.body.genero =
          typeof req.body.genero === "undefined" ? [] : [req.body.genero];
    }    

    const livro = new Livro({
        titulo: req.body.tituloLivro,
        autor: req.body.autor,
        sumario: req.body.sumario,
        isbn: req.body.isbn,
        generos: req.body.genero
    });

    try{
      const livroSave = await livro;
      res.redirect('/livro/detalhes/' + livroSave._id);   
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});


router.get('/livros', async (req, res, next) => {
    try{
      const lista_livrosRecuperado = await Livro.find({})
        .populate("autor")  
        .populate("generos")  
        .exec();
  
        res.render('livro_detalhes_pagina', { titulo: 'Lista de Livros', detalhes: "lista_livrosRecuperado", listaExiste: true });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});

router.get('/livro/ordenar', async (req, res, next) => {
    try {
      const lista_livrosRecuperado = await Livro.find({}, "titulo")
        .sort({ titulo: 1 })
        .populate("autor")  
        .populate("generos")  
        .exec();
  
        res.render('livro_detalhes_pagina', { titulo: 'Lista de Livros', detalhes: lista_livrosRecuperado, listaExiste: true });
    }
    catch(err){
      err.stack;
      return next(err);
    }    
  });

router.get('/livro/detalhes/:id', async (req, res, next) => {
    try{
      const livroRecuperado = await Livro.findById(id)
        .populate("autor")  
        .populate("generos")  
        .exec();
  
        if (livroRecuperado === null) {
          const err = new Error("livroRecuperado not found");
          err.status = 404;
          return next(err);
        }
  
        console.log(livroRecuperado);
        res.render('livro_detalhes_pagina', { titulo: 'Detalhes do Livro', detalhes: livroRecuperado, listaExiste: false });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
  });

router.get('/livro/detalhes/titulo/:titulo', async (req, res, next) => {
    try{
      const livroRecuperado = await Livro.find({titulo: req.params.titulo})
        .populate("autor")  
        .populate("generos")  
        .exec();
  
        if (livroRecuperado === null) {
          const err = new Error("livroRecuperado not found");
          err.status = 404;
          return next(err);
        }
  
        res.render('livro_detalhes_pagina', { titulo: 'Detalhes do Livro', detalhes: livroRecuperado, listaExiste: true });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
  });  


router.get('/livro/deletar', async (req, res, next) => {
    try{
      const lista_livrosRecuperado = await Livro.find({}).exec();
      res.render('livro_deletar_pagina', { titulo: 'Lista de Livros - Deletar', detalhes: lista_livrosRecuperado });
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});  

router.get('/livro/deletar/:id', async function (req, res, next) {
    try{
      const livroRecuperado = await Livro.findById(req.params.id).exec();
  
        if (livroRecuperado === null) {
          const err = new Error("livroRecuperado not found");
          err.status = 404;
          return next(err);
        }
        
        const resultLivroDeletado = await resultLivroDeletado.deleteOne(); 
        res.redirect('/livro/deletar');
    }
    catch(err){
      err.stack;
      return next(err);
    }  
});  


module.exports = router; 