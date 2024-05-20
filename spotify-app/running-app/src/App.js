import React, { useState, useEffect } from 'react';
import './App.css';
import CreatePlaylist from './Components/CreatePlaylist'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
            <CreatePlaylist /> {/* Use your component here */}
        </div>
      </header>
    </div>
  );

}

export default App;