import React, { useState } from 'react';
import { Laptop2, Shield, History } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { useNavigate } from 'react-router-dom';

// Device grid component
const DevicesGrid = () => {
  const devices = [
    { id: 1, name: "Workstation-01", status: "Connected", ip: "192.168.1.101" },
    { id: 2, name: "Server-DB-01", status: "Connected", ip: "192.168.1.102" },
    { id: 3, name: "Laptop-Dev-01", status: "Offline", ip: "192.168.1.103" },
    { id: 4, name: "Printer-Office-01", status: "Connected", ip: "192.168.1.104" },
    { id: 5, name: "NAS-Storage-01", status: "Connected", ip: "192.168.1.105" },
    { id: 6, name: "Router-Main", status: "Connected", ip: "192.168.1.1" },
    { id: 7, name: "Switch-Floor1", status: "Connected", ip: "192.168.1.2" },
    { id: 8, name: "AP-Conference", status: "Connected", ip: "192.168.1.3" },
    { id: 9, name: "Firewall-Edge", status: "Connected", ip: "192.168.1.4" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <div key={device.id} className="bg-black/10 p-4 rounded-lg border border-white/10">
          <h3 className="font-semibold text-white">{device.name}</h3>
          <p className="text-sm">Status: <span className={device.status === "Connected" ? "text-green-500" : "text-red-500"}>{device.status}</span></p>
          <p className="text-sm text-gray-400">{device.ip}</p>
        </div>
      ))}
    </div>
  );
};

// Main Initial Page component
const InitialPage = () => {
  const navigate = useNavigate();
  const [expertMode, setExpertMode] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);

  const handleExpertModeToggle = () => {
    if (!expertMode) {
      navigate('/advanced-audit');
    }
    setExpertMode(!expertMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="relative flex h-14 items-center justify-center px-4 sm:px-10">
          {/* Left: Button group, absolutely positioned */}
          <div className="absolute left-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/history')}
            >
              <History className="mr-2 h-10 w-4" />
              History
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/devices')}
            >
              <Laptop2 className="mr-2 h-4 w-4" />
              Devices
            </Button>
          </div>
          {/* Center: Heading */}
          <h1 className="text-xl font-bold flex items-center justify-center mx-auto">
            <Shield className="mr-2 h-6 w-6" />
            CIS Audit Executor
          </h1>
          {/* Right: Empty, for symmetry if needed */}
          <div className="w-32" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          <Button
            variant="default"
            size="lg"
            className="w-full bg-blue-800 hover:bg-blue-900"
          >
            Complete Checks
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-full bg-purple-800 hover:bg-purple-900"
            onClick={handleExpertModeToggle}
          >
            Enter Expert Mode
          </Button>
        </div>
      </main>

      {/* Devices Dialog */}
      <Dialog open={devicesOpen} onOpenChange={setDevicesOpen}>
        <DialogContent className="sm:max-w-[900px] bg-black text-white">
          <DialogHeader>
            <DialogTitle>Connected Devices</DialogTitle>
            <DialogDescription className="text-gray-400">
              Overview of all devices connected to the network
            </DialogDescription>
          </DialogHeader>
          <DevicesGrid />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InitialPage;

