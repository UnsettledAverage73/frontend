import React from 'react';
import InitialPage from './components/InitialPage';
import AdvancedAuditExecutor from './components/AdvancedAuditExecutor';
import history from './components/history'
import devices from './components/devices'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/history" element={<history />} />
         <Route path="/devices" element={<devices />} />
        <Route path="/advanced-audit" element={<AdvancedAuditExecutor />} />
      </Routes>
    </Router>
  );
}

export default App;
