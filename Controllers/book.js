
const Book = require('../models/Book');
const url = require('url');
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


exports.createRatingBook = (req, res) => {
  const userId = req.body.userId;
  const grade = req.body.rating;
  Book.findOne({ _id: req.params.id})
      .then((book) => {
          const userRating = book.ratings.find(rating => rating.userId === userId);
          if (userRating) {
             return res.status(400).json({message: "Vous n'êtes pas autorisé à noter ce livre"})
          }
          if (grade < 1 || grade > 5) {
              return res.status(400).json({message: "Votre note n'est pas comprise entre 1 et 5"})
          }
          book.ratings.push({userId, grade });
          const ratingCount = book.ratings.length;
          const ratingSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
          book.averageRating = ratingSum / ratingCount;
          book.averageRating = parseFloat(book.averageRating.toFixed(1));
          book.save()
              .then((book) => {res.status(201).json(book)})
              .catch(() => {res.status(400).json({message: "Votre note n'a pas pu être enregistré"})});
      })
      .catch ((error) => {
          res.status(404).json({error});
      })
};



exports.getBestRatedBooks = async (req, res, next) => {
  try {
    // Récupérer les 3 livres les mieux notés
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des livres les mieux notés." });
  }
};




exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  
  Book.findOne({ _id: req.params.id })
      .then((book) => {
          if (!book) {
              return res.status(404).json({ message: 'Livre non trouvé' });
          }
          // Supprimer l'image précédente si elle existe
          if (book.imageUrl) {
              const imagePath = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${imagePath}`, (error) => {
                  if (error) {
                      console.error('Erreur lors de la suppression de l\'image précédente:', error);
                  }
              });
          }
          
          // Mettre à jour le livre
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet modifié!' }))
              .catch(error => res.status(401).json({ error }));
      })
      .catch((error) => {
          res.status(403).json({ error });
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

