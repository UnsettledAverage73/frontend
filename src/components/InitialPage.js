import React, { useState, Suspense } from 'react';
import { History, Laptop2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { history } from './history'
import { devices } from './devices'


// Lazy load the AdvancedAuditExecutor component
const AdvancedAuditExecutor = React.lazy(() => import('./AdvancedAuditExecutor'));

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

// Sidebar component
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-2 p-4">
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-white/10"
        onClick={() => navigate('/history')}
      >
        <History className="mr-2 h-4 w-4" />
        History
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-white/10"
        onClick={() => navigate('/devices')}
      >
        <Laptop2 className="mr-2 h-4 w-4" />
        Devices
      </Button>
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
        <div className="flex h-14 items-center px-4">
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold flex items-center justify-center">
              <Shield className="mr-2 h-6 w-6" />
              CIS Audit Executor
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Hidden on mobile */}
        <aside className="hidden md:flex w-[300px] flex-col border-r border-white/10 bg-black/40">
          <Sidebar onDevicesClick={() => setDevicesOpen(true)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6">
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <Button variant="default" size="lg" className="w-[250px] bg-blue-800 hover:bg-blue-900">
              Complete Checks
            </Button>
            <Button variant="default" size="lg" className="w-[250px] bg-green-800 hover:bg-green-900">
              Complete Fix
            </Button>
            <Button
              variant="default"
              size="lg"
              className="w-[250px] bg-purple-800 hover:bg-purple-900"
              onClick={handleExpertModeToggle}
            >
              Enter Expert Mode
            </Button>
          </div>
        </main>
      </div>

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