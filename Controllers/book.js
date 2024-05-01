const Book = require('../models/Book');
const fs = require('fs');


exports.getAllBook = (req, res, next) => {
  Book.find() 
      .then((books) => {
          res.status(200).json(books);
      })
      .catch((error) => {
          res.status(404).json({ error: error });
      });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
      _id: req.params.id
    }).then(
      (book) => {
        res.status(200).json(book);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };


  exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    
  
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      averageRating: bookObject.ratings[0].grade
    });

    book.save()
      .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
      .catch(error => { res.status(400).json( { error })})
};


  

exports.rateBook = async (req, res) => {
  const { id } = req.params;
  const { userId, grade } = req.body;

  try {
    // Vérifie si le livre existe
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Ajoute l'évaluation au livre
    book.ratings.push({ userId, grade });

    // Recalcule la moyenne des évaluations
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
    book.averageRating = sumRatings / totalRatings;

    // Enregistre les modifications
    await book.save();

    res.status(201).json({ message: "Évaluation ajoutée avec succès.", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'évaluation." });
  }
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

 exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

