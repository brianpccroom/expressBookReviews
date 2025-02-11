const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered!"});
    } else {
      return res.status(404).json({message: "User already exists with that username"});
    }
  } 
  return res.status(404).json({message: "Unable to register. Unknown error."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            res.send(JSON.stringify(books,null,4));},
            1000);
        });

  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) =>{
    
    const isbn = req.params.isbn;

    const bookFromISBN = (isbn) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const book = books.find((b) => b.isbn === ISBN);
            if(book){
              resolve(book);
            }else{
              reject(new Error("Book with specified ISBN not found"));
            }},1000);
        });    
    }
    bookFromISBN(isbn).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book with specified ISBN not found"})
    });
      
    //await res.send(books[ISBN]);    
   
   });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {

  //using promises
  const author = req.params.author;
  const bookFromAuthor = (auth) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.author === auth);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Author not found"));
            }},3000);
        });
    }
    bookFromAuthor(author).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(404).json({error:"Author not found"})
    });

});


// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  const title = req.params.title;
  const bookFromTitle = (booktitle) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.title === booktitle);
            if(filteredbooks > 0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Title not found"));
            }},3000);
        }); 
    }
    bookFromTitle(title).then((new_books) =>{
      res.json(new_books);
    }).catch((err)=>{
      res.status(404).json({error:"Title not found"})
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
