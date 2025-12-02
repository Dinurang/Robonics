import { useState } from 'react'
import RobonicsLogo from '../assets/logo.png'
import './App.css'

function App() {
 
  return (
    <div className="App">
      {/* Header Section with Logo */}
      <header className="App-header">
        <div className="logo-container">
          <img 
            src={RobonicsLogo} 
            alt="Robonics Logo" 
            className="logo"
          />
          <h1>Robonics</h1>
        </div>
        <p className="tagline">
          Design Innovate Engineer
        </p>
      </header>

      {/* Main Content */}
      <main className="App-main">
        <div className="card">
          <h2>Welcome to Robonics</h2>
          <p>
            This is your starting point for building amazing robotics applications with React & Vite.
          </p>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Robonics. All rights reserved.</p>
        <p className="footer-note">
          Built with ❤️ using Vite + React
        </p>
      </footer>
    </div>
  )
}

export default App