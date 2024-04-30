const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/book');



router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.getAllBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.post('/:id', auth, multer, bookCtrl.createBook);  // a corriger
router.post('/:id/rating', auth, multer, bookCtrl.rateBook); // a corriger
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

//router.get('/', auth, stuffCtrl.getAllThings);
//router.post('/', auth, multer, stuffCtrl.createThing);
//router.get('/:id', auth, stuffCtrl.getOneThing);
//router.put('/:id', auth, multer, stuffCtrl.modifyThing);
//router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;