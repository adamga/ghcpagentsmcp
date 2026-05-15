
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks } from '../store/booksSlice';
import { addFavorite, fetchFavorites } from '../store/favoritesSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BookList.module.css';
import EmptyState from './EmptyState';

const BookList = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(state => state.books.items);
  const status = useAppSelector(state => state.books.status);
  const token = useAppSelector(state => state.user.token);
  const navigate = useNavigate();
  const favorites = useAppSelector(state => state.favorites.items);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchBooks({ search, sort, order: 'asc' }));
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate, search, sort]);

  const handleAddFavorite = async (bookId) => {
    if (!token) {
      navigate('/');
      return;
    }
    await dispatch(addFavorite({ token, bookId }));
    dispatch(fetchFavorites(token));
  };

  if (status === 'failed') return <div>Failed to load books.</div>;

  return (
    <div>
      <h2>Books</h2>
      <div className={styles.toolbar}>
        <label>
          Search
          <input
            name="book-search"
            type="search"
            placeholder="Search by title or author"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </label>
      </div>
      {status === 'loading' && <div className={styles.status}>Loading...</div>}
      {books.length === 0 ? (
        <EmptyState>
          <p>No books available.</p>
          <p>Try another search or check back later.</p>
        </EmptyState>
      ) : (
        <div className={styles.bookGrid}>
          {books.map(book => {
            const isFavorite = favorites.some(fav => fav.id === book.id);
            return (
              <div className={styles.bookCard + ' ' + styles.bookCardWithHeart} key={book.id}>
                {isFavorite && (
                  <span className={styles.favoriteHeart} title="In Favorites">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#e25555" stroke="#e25555" strokeWidth="1.5">
                      <path d="M12 21s-6.2-5.2-8.4-7.4C1.2 11.2 1.2 8.1 3.1 6.2c1.9-1.9 5-1.9 6.9 0l2 2 2-2c1.9-1.9 5-1.9 6.9 0 1.9 1.9 1.9 5 0 6.9C18.2 15.8 12 21 12 21z"/>
                    </svg>
                  </span>
                )}
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookAuthor}>by {book.author}</div>
                <button
                  className={styles.simpleBtn}
                  onClick={() => handleAddFavorite(book.id)}
                  disabled={isFavorite}
                  aria-label={isFavorite ? `${book.title} is already in favorites` : `Add ${book.title} to favorites`}
                  title={isFavorite ? 'Already in favorites' : 'Add to favorites'}
                >
                  {isFavorite ? 'In Favorites' : 'Add to Favorites'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookList;
