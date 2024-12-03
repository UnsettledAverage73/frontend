import React from 'react';
import InitialPage from './components/InitialPage';
import AdvancedAuditExecutor from './components/AdvancedAuditExecutor';
import History from './components/history'
import Devices from './components/devices'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/history" element={<History />} />
         <Route path="/devices" element={<Devices />} />
        <Route path="/advanced-audit" element={<AdvancedAuditExecutor />} />
      </Routes>
    </Router>
  );
}

export default App;
