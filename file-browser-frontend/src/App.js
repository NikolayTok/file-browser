import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileBrowser from './FileBrowser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<FileBrowser />} />
      </Routes>
    </Router>
  );
};

export default App;
