const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //include book model from book folder

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
}

  /* GET all books */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [[ "createdAt", "DESC" ]]}); // pulls ALL books from Article model, and returns then im descending order
    res.render("books/index", { books, title: "All Books" }); //passes all db data to books/index 
}));

  /* Display new books form*/
router.get('/new', asyncHandler(async (req, res) => {
    res.render("books/new-book", { book: {}, title: "New Book"});
}));

/* Posts a new book to the database */
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body); // takes the request response object and passes it to create()
        res.redirect("/books");
    } catch (error) { // If the error caught by catch is a SequelizeValidationError, re-render the books/new view ("New Book" form), passing in the errors to display
        if(error.name === 'SequelizeValidationError') { //check error type
            console.log(req.body)
            book = await Book.build(req.body);
            res.render("books/new-book", {book, errors: error.errors})
        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
    }
}));

/* Shows book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id); 
    if(book){ // if the article exists, render the books/update-book view 
        res.render("books/update-book", {book, title: `Update Book - ${book.title}`}) //takes returned data to pass database data and title to render book/update-book
    } else { //otherwise, show a 404 error 
      error.status = 404;
      throw error;    
    }
}));

/* Updates book info in the database */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect("/books");
        } else {
            throw error;
        }
     } catch (error) {
         console.log(error.name);
         console.log(req.params.id);
            if(error.name === "SequelizeValidationError") {
                book = await Book.build(req.body);
                book.id = req.params.id;
                res.render(`books/update-book`, {book, errors: error.errors, title: 'Update Book' })
            } else {
                throw error;
            }
        }
}));

/* Deletes a book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
    const book = await Book.findByPk(req.params.id)
    if(book){
      await book.destroy();
      res.redirect("/books");
    } else {
      const error = new Error('The book you are looking for does not exist!')
      error.status = 404;
      throw error;
    }
  }));

  module.exports = router;