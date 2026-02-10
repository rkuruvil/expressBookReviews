const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  if(username && password) {
    if(users.some(user=> user.username=== username)) {
        return res.status(403).json({ message: "User not valid" });
    }else {
        users.push({"username": username, "password": password});
        return res.status(200).json({ message: "User is registered" });
    }
  } else {
    return res.status(403).json({ message: "User not valid" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn;
  book = books[isbn];
  return res.send(JSON.stringify(book, null, 4));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  author = req.params.author;
  const bookObj = Object.values(books).find(book => book.author === author);
  return res.send(JSON.stringify(bookObj, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  title = req.params.title;
  const bookObj = Object.values(books).find(book => book.title === title);
  return res.send(JSON.stringify(bookObj, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
