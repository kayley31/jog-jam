import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CreatePlaylist from '../Components/CreatePlaylist';


// Set up a mock Redux store
const mockStore = configureStore([]);
const initialState = {
  genres: { genres: [], status: 'succeeded', error: null },
  recommendations: { recommendations: [], status: 'idle', error: null },
};
const store = mockStore(initialState);

// Testing to see if CreatePlaylist renders on page
test('Renders CreatePlaylist component', () => {
  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Check if "Tempo" text is in the document, indicating the component has rendered
  expect(screen.getByText('Tempo')).toBeInTheDocument();
});


// Testing to see if genres are fetched after component has rendered
test('Fetch genres when CreatePlaylist is rendered', () => {
  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Expect the store to have dispatched the 'genres/loading' action
  expect(store.getActions()).toContainEqual({
    type: 'genres/loading',
  });
});


test('Tempo category state updates on dropdown change', () => {
  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Simulate user changing the tempo category
  const tempoDropdown = screen.getByTestId('tempo-dropdown');
  fireEvent.change(tempoDropdown, { target: { value: 'jogging' } });

  // Check if "Jog" option is selected
  const joggingOption = screen.getByText('Jog');
  expect(joggingOption.selected).toBeTruthy();
});


test('Recommendations are requested after user selects preferences', () => {
  
  const store = mockStore({
    genres: { genres: ['rock', 'pop'], status: 'succeeded', error: null },
    recommendations: { recommendations: [], status: 'idle', error: null },
  });
  
  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Simulate user selects 'jogging' for tempo and 'rock' for genre
  const tempoDropdown = screen.getByTestId('tempo-dropdown');
  fireEvent.change(tempoDropdown, { target: { value: 'jogging' } });
  const genresDropdown = screen.getByTestId('genres-dropdown');
  fireEvent.change(genresDropdown, { target: { value: 'rock' } });

  // Simulate user clicks to generate recommendations based on selected preferences
  fireEvent.click(screen.getByText(/Generate Recommendations/i));

  // Expect the store to have dispatched the 'recommendations/loading' action
  expect(store.getActions()).toContainEqual({
    type: 'recommendations/loading',
  });

  // Simulate that recommendations have been received
  store.dispatch({ 
    type: 'recommendations/received',
    payload: [{
      id: 1,
      name: 'Track1',
      artists: [{ name: 'Artist1' }],
      album: { images: [{ url: 'url1' }] },
      external_urls: { spotify: 'spotifyUrl' },
    }],
  });

  // Check if the expected action has been dispatched
  expect(store.getActions()).toContainEqual({
    type: 'recommendations/received',
    payload: [{
      id: 1,
      name: 'Track1',
      artists: [{ name: 'Artist1' }],
      album: { images: [{ url: 'url1' }] },
      external_urls: { spotify: 'spotifyUrl' },
    }],
  });
});


test('Displays error message when API call fails', () => {
  // Create a store with an error state
  const errorState = {
    ...initialState,
    genres: {
      ...initialState.genres,
      status: 'failed',
      error: 'Failed to fetch',
    },
  };
  const errorStore = mockStore(errorState);

  // Render the component with the error store
  render(
    <Provider store={errorStore}>
      <CreatePlaylist />
    </Provider>,
  );

  // Check if "Failed to fetch" error message is in the document
  expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
});


test('Alerts when tempo category is not selected', () => {
  window.alert = jest.fn();

  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  const genresDropdown = screen.getByTestId('genres-dropdown');
  fireEvent.change(genresDropdown, { target: { value: 'rock' } });

  const generateButton = screen.getByText(/Generate Recommendations/i);
  fireEvent.click(generateButton);

  expect(window.alert).toHaveBeenCalledWith('Please select a tempo category');
});


test('Alert for missing genre or artist input', () => {
  window.alert = jest.fn();

  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  const tempoDropdown = screen.getByTestId('tempo-dropdown');
  fireEvent.change(tempoDropdown, { target: { value: 'average' } });

  const generateButton = screen.getByText(/Generate Recommendations/i);
  fireEvent.click(generateButton);

  expect(window.alert).toHaveBeenCalledWith(
    'Please select a genre or enter an artist name.',
  );
});


test('Renders Create Playlist button after generating recommendations', () => {

  // Create a store with mock data for recommendations
  const store = mockStore({
    genres: { genres: ['rock', 'pop'], status: 'succeeded', error: null },
    recommendations: {
      recommendations: [
        {
          id: 1,
          name: 'Track1',
          artists: [{ name: 'Artist1' }],
          album: { images: [{ url: 'url1' }] },
          external_urls: { spotify: 'spotifyUrl' },
        },
      ],
      status: 'succeeded',
      error: null,
    },
  });

  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Check if "Create Playlist" button is in the document
  expect(screen.getByText(/Create Playlist/i)).toBeInTheDocument();
});


test('dispatches addPlaylist action on playlist creation', () => {

  // Create a store with mock data for recommendations
  const store = mockStore({
    genres: { genres: ['rock', 'pop'], status: 'succeeded', error: null },
    recommendations: {
      recommendations: [
        {
          id: 1,
          name: 'Track1',
          artists: [{ name: 'Artist1' }],
          album: { images: [{ url: 'url1' }] },
          external_urls: { spotify: 'spotifyUrl' },
        },
      ],
      status: 'succeeded',
      error: null,
    },
  });

  render(
    <Provider store={store}>
      <CreatePlaylist />
    </Provider>,
  );

  // Simulate user interactions for creating a playlist
  fireEvent.change(screen.getByTestId('playlist-name-input'), {
    target: { value: 'My Playlist' },
  });
  fireEvent.click(screen.getByText(/Create Playlist/i));

  // Expect the store to have dispatched the 'playlists/add' action
  expect(store.getActions()).toContainEqual({
    type: 'playlists/add',
    payload: {
      name: 'My Playlist',
      tracks: store.getState().recommendations.recommendations,
    },
  });
});