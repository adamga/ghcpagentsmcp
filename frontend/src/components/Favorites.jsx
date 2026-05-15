import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearFavorites, fetchFavorites, removeFavorite } from '../store/favoritesSlice';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const status = useAppSelector(state => state.favorites.status);
  const token = useAppSelector(state => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Failed to load favorites.</div>;

  const handleRemoveFavorite = async (bookId) => {
    await dispatch(removeFavorite({ token, bookId }));
  };

  const handleClearFavorites = async () => {
    await dispatch(clearFavorites(token));
  };

  return (
    <div>
      <h2>My Favorite Books</h2>
      {favorites.length === 0 ? (
        <EmptyState>
          <p>No favorite books yet.</p>
          <p>
            Go to the <a href="/books" onClick={e => { e.preventDefault(); navigate('/books'); }}>book list</a> to add some!
          </p>
        </EmptyState>
      ) : (
        <>
          <button type="button" onClick={handleClearFavorites}>Clear All Favorites</button>
          <ul>
            {favorites.map(book => (
              <li key={book.id}>
                <strong>{book.title}</strong> by {book.author}
                <button type="button" onClick={() => handleRemoveFavorite(book.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Favorites;
