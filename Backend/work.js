const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'book_reviews'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));

// Set up routes
  app.get('/', (req, res) => {
    if (req.session.reader ) {
      res.sendFile(__dirname + '/views/home.html');
    } else if(req.session.author){
      res.sendFile(__dirname + '/views/authorPage.html');
    }else {
      res.sendFile(__dirname + '/views/login.html');
    }
  });

app.post('/login', (req, res) => {
  const { username, password, type } = req.body;

  // Validate login credentials (insecure, for demonstration purposes only)
  if (type === 'reader' && username === 'reader' && password === 'password') {
    req.session.reader = true;
  } else if (type === 'author' && username === 'author' && password === 'password') {
    req.session.author = true;
    //res.redirect('/authorPage');
  } else {
    res.redirect('/');
    return;
  }

  res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/addReview', (req, res) => {
  const { title, author, publication, genre, review, rating } = req.body;
  //const userId = req.session.reader ? 'reader' : 'author';

  // Store data in the database 
  const query = 'INSERT INTO reviews (title, author, publication, genre, review, rating) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, author, publication, genre, review, rating], (err) => {
    if (err) {
      console.error('Error storing review:', err);
      res.status(500).send('Error storing review');
      return;
    }
    res.redirect('/');
  });
});

app.post('/authorDetails', (req, res) => {
  const authorName = req.body.authorName;

  // Fetch author's book details from the database
  const query = 'SELECT title, review FROM reviews WHERE author = ?';
  db.query(query, [authorName], (err, results) => {
    if (err) {
      console.error('Error fetching author details:', err);
      res.status(500).send('Error fetching author details');
      return;
    }
    res.json(results);
  });
});

app.get('/myReviews', (req, res) => {
  // const userId = req.session.reader ? 'reader' : 'author';

  //Fetch reviews from the database for the logged-in user
  const query = 'SELECT * FROM reviews ORDER BY rating DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).send('Error fetching reviews');
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
