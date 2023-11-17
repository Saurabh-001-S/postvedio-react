
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from "./Pages/Home";
import Screenrecoding from "./Component/Screenrecoding";
import Recodings from "./Component/Recodings";

const App = () => {
  return (
        // <Router>
        //   <Routes>
        //    <Route path="/" element={<Home />} />
        //   </Routes>
        // </Router>
        // <Home />
        // <Screenrecoding />
        <Recodings />
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
