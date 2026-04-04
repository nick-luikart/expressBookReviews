const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.query.username;
    let password = req.query.password;

    if (username !== null && password !== null) {
        let username_not_used = true;
        if(users.length > 0) {
            for (let i = 0; i <= users.length; i++) {
                if (users[i].username === username) {
                    username_not_used = false;
                }
            }
        }
        if (username_not_used) {
            users.push({
                "username": req.query.username,
                "password": req.query.password
            });
            res.send("New user: " + req.query.username + " added.");
        } else {
            return res.status(403).json({ message: "Username is unavailable." });
        }
    } else {
        return res.status(403).json({ message: "Username or password not entered. "});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    const authors_books = [];
    for (let i in books) {
        if (books[i].author == author) {
            authors_books.push(books[i]);
        }
    }
    res.send(JSON.stringify(authors_books,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    const title_books = [];
    for (let i in books) {
        if (books[i].title == title) {
            title_books.push(books[i]);
        }
    }
    res.send(JSON.stringify(title_books,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
