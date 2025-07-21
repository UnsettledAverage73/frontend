import React, { useState, useEffect } from 'react';

const API_URL = 'https://his-2k24.onrender.com/history'; // Change if backend runs elsewhere

const History = ({ refreshTrigger }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistoryData(Array.isArray(data) ? data : (data.history || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]); // fetch on mount and when refreshTrigger changes

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Audit History <span className="text-xs text-gray-400">(Realtime)</span></h1>
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {historyData.map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.action}</h3>
                  <p className="text-gray-400 mt-1">{item.details}</p>
                  <p className="text-gray-400 mt-1">System: {item.system}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${
                    item.status === "Completed" ? "text-green-500" : "text-red-500"
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">{item.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;