import React, { useState, useEffect } from 'react';
import './App.css';
import CreatePlaylist from './Components/CreatePlaylist';
import About from './Components/About';
import Header from './Components/Navbar';
import Footer from './Components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import NewPlaylist from './Components/NewPlaylist';
import Home from './Webpages/Home';
import MyPlaylists from './Webpages/MyPlaylists';
import CreatePlaylists from './Webpages/CreatePlaylists';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
          <Header />
          <div className="Body">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/new-playlist" element={<NewPlaylist />} />
              <Route path="/my" element={<MyPlaylists />} /> 
              <Route path="/create" element={<CreatePlaylists />} /> 
            </Routes>
          </div>
          <div className='footer'>
            <Footer />
          </div>
      </div>
    </Router>
  );

}

export default App;