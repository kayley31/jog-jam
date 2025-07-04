import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NewPlaylist from '../Components/NewPlaylist';

const mockStore = configureStore([]);
const initialState = {
  playlists: {
    playlists: [
      {
        name: 'Playlist A',
        tracks: [
          {
            id: 1,
            name: 'Track 1',
            artists: [{ name: 'Artist 1' }],
            album: { images: [{ url: 'url1' }] },
            external_urls: { spotify: 'spotifyUrl' },
          },
        ],
      },
    ],
  },
};
const store = mockStore(initialState);

test('Renders playlists and opens popup', () => {
    render(
      <Provider store={store}>
        <NewPlaylist />
      </Provider>
    );

  // Check if playlist is rendered
  expect(screen.getByText('Playlist A')).toBeInTheDocument();

  // Open playlist
  fireEvent.click(screen.getByText('Playlist A'));

  // Check if popup is rendered
  expect(screen.getByText('Track 1')).toBeInTheDocument();
});