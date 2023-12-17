const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Dummy book data
const books = [
  { id: 1, title: 'HTML/CSS', author: 'Author 1', reviews: 'good' },
  { id: 2, title: 'Css Exercise', author: 'Author 2' , reviews: ''},
  { id: 3, title: 'HTML Exercise', author: 'Author 3', reviews: '' },
  { id: 4, title: 'js from 0 to hert', author: 'Author 4', reviews: '' },
  { id: 5, title: 'js Exercise', author: 'Author 5' , reviews: ''},
  { id: 6, title: 'Mysql/nosql differences application', author: 'Author 6', reviews: '' },
  { id: 7, title: 'Mysql/nosql Exercise', author: 'Author 7' , reviews: ''},
  { id: 8, title: 'php  from 0 to hert', author: 'Author 8' , reviews: ''},
  { id: 9, title: 'php Exercise', author: 'Author 9' , reviews: ''},
  { id: 7, title: 'larave 0 to hero', author: 'Author 7' , reviews: ''},
  { id: 10, title: 'How to become developer', author: 'Author 7' ,review:["this book foucs more on the most important thing you should foucs on to become good develooper"]},

];

// Endpoint to get the book list
app.get('/books/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find((b) => b.id.toString() === isbn);
  
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    res.json(book);
  });
//   Endpoint to return author name
app.get('/books/Author/:author', (req, res) => {
    const { author } = req.params;
    const book_author = books.filter((book) => book.author === author);
  
    if (book_author===0) {
      return res.status(404).json({ error: 'Book author not found' });
    }
  
    res.json(book_author);
  });

//   Endpoint to return book title
app.get('/books/Title/:Title', (req, res) => {
    const { Title } = req.params;
    const book_Title = books.filter((book) => book.title === Title);
  
    if (book_Title===0) {
      return res.status(404).json({ error: 'Book Title not found' });
    }
  
    res.json(book_Title);
  }); 
//   veiw book based on review
function getBookReviewById(id) {
    return new Promise((resolve, reject) => {
      const review = books.find((r) => r.id === Number(id));
  
      if (review) {
        resolve(review);
      } else {
        reject(new Error('Book review not found'));
      }
    });
  }
  
  app.get('/books/:id/review', async (req, res) => {
    const bookId = req.params.id;
  
    try {
      const review = await getBookReviewById(bookId);
      res.json(review);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Book review not found' });
    }
  });
// Register new user
app.use(bodyParser.json());

const users = [];

// Endpoint to handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

    const newUser = { username, password };
  users.push(newUser);

  res.json({ message: 'User registered successfully', user: newUser });
});
// login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.json({ message: 'Logged in successfully' });
  } else {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
});
// Endpoint to add review 
app.post('/books/:id/review', (req, res) => {
  const bookId = parseInt(req.params.id);
  const review = req.query.review;

  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  book.reviews = review;
  res.json({ message: 'Review added/modified successfully', book });
});
// Task 9: Delete book review added by that particular user
app.delete('/books/:id/review', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the book has a review
  if (!book.reviews) {
    return res.status(404).json({ error: 'Review not found for this book' });
  }

  // Clear the review for the book
  book.reviews = '';

  res.json({ message: 'Review deleted successfully', book });
});
// Endpoint to get all books using async callback function
app.get('/books', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    res.json(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Async function to get all books
async function getAllBooks() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
      resolve(books);
    }, 1000); 
  });
}
// Endpoint to search by ISBN using Promises
app.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  searchByISBN(isbn)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Promise function to search by ISBN
function searchByISBN(isbn) {
  return new Promise((resolve) => {
     const book = books.find((b) => b.id.toString() === isbn);
    resolve(book);
  });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
