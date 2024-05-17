import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CreateRoomPage from './CreateRoomPage';
import LoginPage from './LoginPage'
import RoomPage from './RoomPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/CreateRoom" element={<CreateRoomPage />} />
       

        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
