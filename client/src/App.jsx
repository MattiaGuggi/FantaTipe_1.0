/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Formation from './components/Formation';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { UserProvider } from './assets/UserContext';
import FloatingShapes from './assets/FloatingShapes';
import Search from './components/Search';
import Users from './components/Users';
import EmailVerificationPage from './components/EmailVerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Games from './components/Games';
import Demo from './games/Demo';
import GuessWho from './games/GuessWho';
import VirtualPlayers from './games/VirtualPlayers';
import TreasureHunt from './games/TreasureHunt';
import HotGame from './games/HotGame';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Room from './components/Room';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [room, setRoom] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  const handleSignup = () => {
    setIsAuthenticated(true);
  }

  const redirectToLogin = () => {
    setIsAuthenticated(false);
  };

  return (
    <UserProvider>
      <Router>
        <div className='relative w-full h-full text-center flex justify-center items-center flex-col overflow-hidden
        bg-gradient-to-br from-indigo-950 via-violet-950 to-violet-900'>
          <FloatingShapes color="bg-indigo-700" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
          <FloatingShapes color="bg-indigo-700" size="w-48 h-48" top="70%" left="80%" delay={5}/>
          <FloatingShapes color="bg-indigo-700" size="w-32 h-32" top="65%" left="10%" delay={2}/>
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/email-verification" element={<EmailVerificationPage onSignup={handleSignup}/>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            </Routes>
          ) : (
            <>
              <Navbar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search className='fixed top-20 w-[450px] xs:w-64'/>} />
                <Route path="/formation" element={<Formation />} />
                <Route path="/games" element={<Games />} />
                <Route path="/profile" element={<Profile redirectToLogin={redirectToLogin}/>} />
                <Route path="/profile/:username" element={<Users />} />
                <Route path="/treasure-hunt" element={<TreasureHunt />} />
                <Route path="/virtual-players" element={<VirtualPlayers />} />
                <Route path="/demo" element={<Demo isGameStarted={isGameStarted} setIsGameStarted={setIsGameStarted} />} />
                <Route path="/guess-who" element={<GuessWho />} />
                <Route path="/hot-game" element={<HotGame />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/join-room" element={<JoinRoom setRoom={setRoom} />} />
                <Route path="/:key" element={<Room roomId={room} setIsGameStarted={setIsGameStarted}/>} />
                <Route path="*" element={<Home />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
