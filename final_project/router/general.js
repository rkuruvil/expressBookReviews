const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(400).json({message: "username and password required"});
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(JSON.stringify(book, null, 4));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookObj = Object.values(books).find(book => book.author === author);
  return res.send(JSON.stringify(bookObj, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookObj = Object.values(books).find(book => book.title === title);
  return res.send(JSON.stringify(bookObj, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.send(books[isbn].reviews);
});

// with async await #Task 10
public_users.get("/", (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books available");
      }
    });
  
    getBooks
      .then(data => res.json(data))
      .catch(err => res.status(500).json({ error: err }));
  });
// with async await #Task 11
public_users.get("/isbn/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  
    getBookByISBN
      .then(book => res.json(book))
      .catch(err => res.status(404).json({ error: err }));
  });

// with async await #Task 12
public_users.get("/author/:author", (req, res) => {
    const { author } = req.params;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        book => book.author === author
      );
  
      result.length
        ? resolve(result)
        : reject("Author not found");
    });
  
    getBooksByAuthor
      .then(data => res.json(data))
      .catch(err => res.status(404).json({ error: err }));
  });

  // with async await #Task 13
  public_users.get("/title/:title", (req, res) => {
    const { title } = req.params;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        book => book.title === title
      );
  
      result.length
        ? resolve(result)
        : reject("Title not found");
    });
  
    getBooksByTitle
      .then(data => res.json(data))
      .catch(err => res.status(404).json({ error: err }));
  });
module.exports.general = public_users;
