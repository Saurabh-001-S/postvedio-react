
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from "./Pages/Home";

const App = () => {
  return (
        <Router>
          <Routes>
           <Route path="/" element={<Home />} />
          </Routes>
        </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);