const express = require('express');
const DEFAULT_BOOK_LIMIT = 100;

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function createBooksRouter({ booksFile, readJSON }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    let books = readJSON(booksFile);
    const search = normalizeQuery(req.query.search);
    const sort = ['title', 'author'].includes(req.query.sort) ? req.query.sort : null;
    const order = req.query.order === 'desc' ? 'desc' : 'asc';
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = parsePositiveInteger(req.query.limit, DEFAULT_BOOK_LIMIT);

    if (search) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
      );
    }

    if (sort) {
      books = [...books].sort((a, b) => {
        const comparison = a[sort].localeCompare(b[sort]);
        return order === 'desc' ? -comparison : comparison;
      });
    }

    const total = books.length;
    const start = (page - 1) * limit;
    res.json({
      items: books.slice(start, start + limit),
      total,
      page,
      limit,
    });
  });

  return router;
}

module.exports = createBooksRouter;
