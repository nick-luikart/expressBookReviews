const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let valid_user = users.filter((user) => {
        if (user.username === username && user.password === password) {
            return user;
        }
    });
    if (valid_user.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "error logging in "});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid login: check username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book_to_review = books[req.params.isbn - 1];
    // get session and username stored in session
    let user = req.user;
    // check if user has posted a review on specified book
    let user_has_review = false;
    let review_to_update;
    if (book_to_review.reviews.length > 0) {
        for (let i in book_to_review.reviews) {
            if(book_to_review.reviews[i].username === user) {
                user_has_review = true;
                review_to_update = book_to_review.reviews[i];
                break;
            }
        }
    }
    // add or modify review data on specified book
    if (!user_has_review) {
        let new_review = {
            username: user,
            review: req.query.review
        }
        book_to_review.reviews.push(new_review);
        return res.status(200).send("User " + user + " review for book " + book_to_review.title + " successfully added.");
    } else {
        review_to_update.review = req.query.review;
        return res.status(200).send("User " + user + " review for book " + book_to_review.title + " successfully updated.");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // get book data to access
    // get session and username stored in session
    // filter reviews for specified book by user
    // delete review on specified book written by user
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
