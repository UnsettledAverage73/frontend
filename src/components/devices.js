import React, { useState, useCallback } from 'react';

const Devices = () => {
  const devices = [
    { id: 1, name: "Workstation-01", status: "Connected", ip: "192.168.1.101", lastCheck: "2024-03-03 12:00" },
    { id: 2, name: "Server-DB-01", status: "Connected", ip: "192.168.1.102", lastCheck: "2024-03-03 11:45" },
    { id: 3, name: "Laptop-Dev-01", status: "Offline", ip: "192.168.1.103", lastCheck: "2024-03-02 15:30" },
    { id: 4, name: "Printer-Office-01", status: "Connected", ip: "192.168.1.104", lastCheck: "2024-03-03 11:50" },
    { id: 5, name: "Router-Main", status: "Connected", ip: "192.168.1.1", lastCheck: "2024-03-03 12:00" },
    { id: 6, name: "Firewall-Edge", status: "Connected", ip: "192.168.1.4", lastCheck: "2024-03-03 12:00" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Connected Devices</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className="bg-gray-800 rounded-lg p-4"
            >
              <h3 className="font-semibold text-lg">{device.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  Status: {' '}
                  <span className={device.status === "Connected" ? "text-green-500" : "text-red-500"}>
                    {device.status}
                  </span>
                </p>
                <p className="text-sm text-gray-400">IP: {device.ip}</p>
                <p className="text-sm text-gray-400">Last Check: {device.lastCheck}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Devices;