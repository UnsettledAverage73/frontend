import React from 'react';

const History = () => {
  const historyData = [
    {
      id: 1,
      action: "Security Check",
      status: "Completed",
      timestamp: "2024-03-03 14:30:00",
      details: "Full system scan completed successfully",
      system: "Server-DB-01"
    },
    {
      id: 2,
      action: "Vulnerability Fix",
      status: "Failed",
      timestamp: "2024-03-02 09:15:00",
      details: "Critical security patches application failed",
      system: "Laptop-Dev-01"
    },
    {
      id: 3,
      action: "Configuration Audit",
      status: "Completed",
      timestamp: "2024-03-01 16:45:00",
      details: "System configurations verified",
      system: "Router-Main"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Audit History</h1>
        
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