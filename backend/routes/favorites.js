const express = require('express');

function findUser(users, username) {
  return users.find(u => u.username === username);
}

function findBook(books, bookId) {
  return books.find(book => book.id === bookId);
}

function createFavoritesRouter({ usersFile, booksFile, readJSON, writeJSON, authenticateToken }) {
  const router = express.Router();

  router.get('/', authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = findUser(users, req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = readJSON(booksFile);
    const favorites = books.filter(b => user.favorites.indexOf(b.id) !== -1);
    res.json(favorites);
  });

  router.post('/', authenticateToken, (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID required' });
    const users = readJSON(usersFile);
    const user = findUser(users, req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const books = readJSON(booksFile);
    const book = findBook(books, bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (user.favorites.indexOf(bookId) !== -1) {
      return res.status(409).json({ message: 'Book already in favorites' });
    }
    user.favorites.push(bookId);
    writeJSON(usersFile, users);
    res.status(201).json({ message: 'Book added to favorites', book });
  });

  router.delete('/', authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = findUser(users, req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.favorites = [];
    writeJSON(usersFile, users);
    res.status(200).json({ message: 'Favorites cleared' });
  });

  router.delete('/:bookId', authenticateToken, (req, res) => {
    const users = readJSON(usersFile);
    const user = findUser(users, req.user.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(id => id !== req.params.bookId);
    if (user.favorites.length === initialLength) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    writeJSON(usersFile, users);
    res.status(200).json({ message: 'Book removed from favorites' });
  });

  return router;
}

module.exports = createFavoritesRouter;
