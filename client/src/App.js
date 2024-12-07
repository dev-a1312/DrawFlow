import React from 'react';
import './App.css'; // For styling
import Whiteboard from './components/Whiteboard'; // Import the Whiteboard component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DrawFlow</h1>
      </header>
      <main>
        <Whiteboard />
      </main>
    </div>
  );
}

export default App;
