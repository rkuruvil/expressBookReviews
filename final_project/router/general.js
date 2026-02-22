const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const BOOKS_API = "https://reenikuruvil-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai"; 

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
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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

// with async await #Task 10
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_API}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// with async await #Task 11
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const response = await axios.get(`${BOOKS_API}/isbn/${isbn}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ error: "ISBN not found" });
  }
});

// with async await #Task 12
public_users.get("/author/:author", async (req, res) => {
    try {
      const { author } = req.params;
      const response = await axios.get(`${BOOKS_API}/author/${author}`);
      res.json(response.data);
    } catch (err) {
      res.status(404).json({ error: "Author not found" });
    }
  });

  // with async await #Task 13
public_users.get("/title/:title", async (req, res) => {
    try {
      const { title } = req.params;
      const response = await axios.get(`${BOOKS_API}/title/${title}`);
      res.json(response.data);
    } catch (err) {
      res.status(404).json({ error: "Title not found" });
    }
  });
module.exports.general = public_users;
