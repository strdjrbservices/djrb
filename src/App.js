import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hold from './hold.js'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hold />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;