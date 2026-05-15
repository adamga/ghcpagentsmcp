import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '../config/api';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (filters = {}) => {
  const res = await fetch(apiUrl('/books', filters));
  if (!res.ok) throw new Error('Failed to load books');
  return res.json();
});

const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], status: 'idle', total: 0 },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, state => { state.status = 'loading'; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || action.payload;
        state.total = action.payload.total ?? state.items.length;
      })
      .addCase(fetchBooks.rejected, state => { state.status = 'failed'; });
  },
});

export default booksSlice.reducer;
