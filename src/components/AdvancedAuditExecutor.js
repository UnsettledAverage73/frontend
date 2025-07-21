import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronDown, ChevronRight, HardDrive, Server, Zap, Clock, Loader } from 'lucide-react';
import { Button } from "./button";
import { Switch } from "./ui/switch";
import { cn } from "../lib/utils";
import Progress from "./ui/progress";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://his-2k24.onrender.com';

// Tesla-inspired color palette
const colors = {
  primary: '#e82127', // Tesla red
  secondary: '#393c41', // Tesla dark gray
  accent: '#5c5e62', // Tesla light gray
  background: '#f4f4f4',
  text: '#171a20',
  success: '#00a32e',
  warning: '#ff9f1c',
  danger: '#e82127',
  info: '#3e6ae1'
};

// Backup Panel Component with enhanced UI
const BackupPanel = ({ 
  isOpen, 
  onClose, 
  backups,
  onViewBackup,
  onCreateBackup,
  onRestoreBackup
}) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <HardDrive className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900">System Backups</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateBackup}
            className="text-xs"
          >
            Create Backup
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-auto h-[calc(100vh-120px)]">
        {backups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Server className="h-10 w-10 text-gray-300 mb-3" />
            <h3 className="text-gray-500 font-medium">No backups available</h3>
            <p className="text-gray-400 text-sm mt-1">Create your first backup to get started</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateBackup}
              className="mt-4"
            >
              Create Backup
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Backup #{backup.id.slice(-4)}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {new Date(backup.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(backup.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {backup.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 hover:bg-gray-100"
                        onClick={() => onViewBackup(backup.id)}
                      >
                        Details
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        onClick={() => onRestoreBackup(backup.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdvancedAuditExecutor = () => {
  const [auditList, setAuditList] = useState([]);
  const [selectedAudits, setSelectedAudits] = useState([]);
  const [executionLogs, setExecutionLogs] = useState('');
  const [auditResults, setAuditResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDryRun, setIsDryRun] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Backup-related states
  const [backups, setBackups] = useState([]);
  const [isBackupPanelOpen, setIsBackupPanelOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});

  // Device-related states
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  // Fetch audits from backend on mount
  useEffect(() => {
    setExecutionLogs('Fetching audit scripts from server...\n');
    fetch(`${BACKEND_URL}/expert/audits`)
      .then(res => res.json())
      .then(data => {
        setAuditList(data.audits || []);
        setExecutionLogs(prev => prev + `Loaded ${data.audits?.length || 0} audit scripts\n`);
      })
      .catch(err => {
        console.error('Failed to fetch audits:', err);
        setExecutionLogs(prev => prev + `Error fetching audits: ${err.message}\n`);
      });
  }, []);

  // Fetch devices from backend on mount
  useEffect(() => {
    setExecutionLogs('Fetching connected devices...\n');
    fetch(`${BACKEND_URL}/devices`)
      .then(res => res.json())
      .then(data => {
        let devices = data.devices || [];
        // Ensure "This Server" is always present
        if (!devices.some(d => d.id === 'local')) {
          devices = [
            { id: 'local', name: 'This Server', ip: '127.0.0.1', status: 'connected', type: 'local' },
            ...devices
          ];
        }
        setDeviceList(devices);
        setExecutionLogs(prev => prev + `Found ${devices.length} devices\n`);
      })
      .catch(err => {
        console.error('Failed to fetch devices:', err);
        setExecutionLogs(prev => prev + `Error fetching devices: ${err.message}\n`);
      });
  }, []);

  // Create backup
  const createBackup = async () => {
    const backupId = `backup-${Date.now()}`;
    const newBackup = {
      id: backupId,
      timestamp: new Date().toISOString(),
      description: `Backup of ${selectedAudits.length} audit scripts`,
      stats: {
        audits: selectedAudits.length,
        devices: selectedDevices.length
      }
    };

    setExecutionLogs(prev => prev + '\nCreating system backup...\n');
    setIsExecuting(true);
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBackups(prev => [newBackup, ...prev]);
      setExecutionLogs(prev => prev + `✅ Backup created successfully (ID: ${backupId})\n`);
      setIsExecuting(false);
      
      return backupId;
    } catch (error) {
      setExecutionLogs(prev => prev + `❌ Error creating backup: ${error.message}\n`);
      setIsExecuting(false);
      throw error;
    }
  };

  // Restore backup
  const restoreBackup = async (backupId) => {
    setExecutionLogs(prev => prev + `\nRestoring backup ${backupId}...\n`);
    setIsExecuting(true);
    
    try {
      // Simulate restore
      await new Promise(resolve => setTimeout(resolve, 1200));
      setExecutionLogs(prev => prev + `✅ Backup ${backupId} restored successfully\n`);
      setIsExecuting(false);
    } catch (error) {
      setExecutionLogs(prev => prev + `❌ Error restoring backup: ${error.message}\n`);
      setIsExecuting(false);
    }
  };

  // View backup details
  const handleViewBackup = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      setExecutionLogs(prev => prev + `\nViewing backup details for ${backupId}\n`);
    }
  };

  // Build directory tree structure from audit paths
  const auditTree = useMemo(() => {
    const root = {};
    auditList.forEach(({ path, name }) => {
      const parts = path.replace(/^rhel\/v8\//, '').split('/');
      let node = root;
      parts.forEach((part, idx) => {
        if (idx === parts.length - 1) {
          // It's a file
          if (!node.files) node.files = [];
          node.files.push({ name, path });
        } else {
          // It's a directory
          if (!node[part]) node[part] = {};
          node = node[part];
        }
      });
    });
    return root;
  }, [auditList]);

  // Toggle folder expansion state
  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Check if folder is expanded
  const isFolderExpanded = (path) => {
    return !!expandedFolders[path];
  };

  // Check if all files in a folder are selected
  const areAllFilesSelected = (files) => {
    return files.every(file => selectedAudits.includes(file.path));
  };

  // Toggle selection of all files in a folder
  const toggleSelectAll = (files) => {
    const allSelected = areAllFilesSelected(files);
    setSelectedAudits(prev => {
      if (allSelected) {
        // Deselect all
        return prev.filter(item => !files.some(file => file.path === item));
      } else {
        // Select all
        const newSelections = files.map(file => file.path).filter(path => !prev.includes(path));
        return [...prev, ...newSelections];
      }
    });
  };

  // Render directory tree recursively
  const renderTree = (node, parentPath = '') => {
    const directories = Object.entries(node)
      .filter(([key]) => key !== 'files')
      .sort(([a], [b]) => a.localeCompare(b));

    const files = node.files || [];

    return (
      <ul className="space-y-1">
        {directories.map(([dir, subNode]) => {
          const folderPath = parentPath ? `${parentPath}/${dir}` : dir;
          const subFiles = subNode.files || [];
          const isExpanded = isFolderExpanded(folderPath);
          
          return (
            <li key={folderPath} className="pl-2">
              <div className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded">
                <button
                  type="button"
                  onClick={() => toggleFolder(folderPath)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFolder(folderPath)}
                  className="text-sm font-medium text-gray-700 flex-1 text-left truncate"
                >
                  {dir}
                </button>
                {subFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(subFiles)}
                    className="text-xs px-2 py-0.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
                  >
                    {areAllFilesSelected(subFiles) ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              {isExpanded && (
                <div className="pl-4 border-l border-gray-200 ml-1">
                  {renderTree(subNode, folderPath)}
                  {files.length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {files.map(file => (
                        <li key={file.path} className="pl-2">
                          <label className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedAudits.includes(file.path)}
                              onChange={e => {
                                setSelectedAudits(prev =>
                                  e.target.checked
                                    ? [...prev, file.path]
                                    : prev.filter(item => item !== file.path)
                                );
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span
                              className={`text-sm ${
                                selectedAudits.includes(file.path)
                                  ? 'font-medium text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {file.name}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Execute audits
  const executeAudits = async (devices) => {
    if (devices.length === 0) {
      setExecutionLogs(prev => prev + '\n❌ No devices selected for execution\n');
      return;
    }

    if (selectedAudits.length === 0) {
      setExecutionLogs(prev => prev + '\n❌ No audits selected for execution\n');
      return;
    }

    setIsExecuting(true);
    setExecutionLogs(prev => prev + '\nStarting execution process...\n');
    setProgress(0);
    setAuditResults([]);

    try {
      // Create backup first
      await createBackup();
      
      setExecutionLogs(prev => prev + `\nExecuting ${selectedAudits.length} audits on ${devices.length} devices...\n`);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10) + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      const response = await fetch(`${BACKEND_URL}/expert/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audits: selectedAudits,
          dry_run: isDryRun,
          devices: devices
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      setAuditResults(data.results || []);
      setExecutionLogs(prev => prev + '✅ Execution completed successfully\n');
    } catch (error) {
      setExecutionLogs(prev => prev + `❌ Error during execution: ${error.message}\n`);
      setAuditResults(prev => [...prev, {
        name: 'Execution Error',
        status: 'failed',
        details: error.message
      }]);
      setProgress(100);
    } finally {
      setIsExecuting(false);
    }
  };

  // Open device selection modal
  const openDeviceModal = () => {
    setShowDeviceModal(true);
  };

  // Calculate execution summary
  const executionSummary = useMemo(() => {
    if (auditResults.length === 0) return null;
    
    const successCount = auditResults.filter(r => r.status === 'success').length;
    const warningCount = auditResults.filter(r => r.status === 'warning').length;
    const errorCount = auditResults.filter(r => r.status === 'error').length;
    
    return {
      success: successCount,
      warning: warningCount,
      error: errorCount,
      total: auditResults.length
    };
  }, [auditResults]);

  return (
    <div className="bg-white min-h-screen">
      {/* Backup Panel */}
      <BackupPanel 
        isOpen={isBackupPanelOpen}
        onClose={() => setIsBackupPanelOpen(false)}
        backups={backups}
        onViewBackup={handleViewBackup}
        onCreateBackup={createBackup}
        onRestoreBackup={restoreBackup}
      />

      {/* Device Selection Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-900">Select Target Devices</h2>
              </div>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDevices.length === deviceList.length}
                    onChange={e => setSelectedDevices(e.target.checked ? deviceList.map(d => d.id) : [])}
                    className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All Devices</span>
                </label>
              </div>
              
              <ul className="space-y-3">
                {deviceList.map(device => (
                  <li key={device.id}>
                    <label className={`flex items-start gap-3 p-2 rounded ${device.status !== 'connected' ? 'opacity-60' : 'hover:bg-gray-50'}`}>
                      <input
                        type="checkbox"
                        disabled={device.status !== 'connected'}
                        checked={selectedDevices.includes(device.id)}
                        onChange={e => {
                          setSelectedDevices(prev =>
                            e.target.checked
                              ? [...prev, device.id]
                              : prev.filter(id => id !== device.id)
                          );
                        }}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {device.name}
                            {device.type === 'local' && (
                              <span className="ml-2 text-xs text-red-500">(This Server)</span>
                            )}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            device.status === 'connected' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {device.status === 'connected' ? 'Connected' : 'Offline'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          IP: {device.ip}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDeviceModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeviceModal(false);
                  executeAudits(selectedDevices);
                }}
                disabled={selectedDevices.length === 0 || isExecuting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  selectedDevices.length === 0 || isExecuting
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isExecuting ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Executing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {isDryRun ? 'Run Simulation' : 'Execute Now'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Audit Executor</h1>
            <p className="text-sm text-gray-500 mt-1">
              Execute security audits across your infrastructure with precision control
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsBackupPanelOpen(true)}
              className="flex items-center gap-2 border-gray-300"
            >
              <HardDrive className="h-4 w-4" />
              Backups ({backups.length})
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Selection Panel */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden lg:col-span-1">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Audit Selection</h2>
              <p className="text-xs text-gray-500 mt-1">
                {selectedAudits.length} audits selected
              </p>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={isDryRun}
                    onCheckedChange={setIsDryRun}
                    className="data-[state=checked]:bg-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Dry Run Mode
                  </span>
                </label>
                
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {isDryRun ? 'Simulation Active' : 'Live Mode'}
                </span>
              </div>
            </div>
            
            <div className="overflow-auto h-[calc(100vh-380px)] p-4">
              {auditList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Loader className="h-8 w-8 animate-spin mb-3" />
                  <p>Loading audit scripts...</p>
                </div>
              ) : (
                renderTree(auditTree)
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={openDeviceModal}
                disabled={selectedAudits.length === 0 || isExecuting}
                className={`w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
                  selectedAudits.length === 0 || isExecuting
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isExecuting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    {isDryRun ? 'Run Simulation' : 'Execute Audits'}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Execution Logs Panel */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden lg:col-span-1">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Execution Logs</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-auto h-[calc(100vh-380px)]">
              <div className="p-4">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">
                  {executionLogs || <span className="text-gray-400">No execution logs yet. Select audits and execute to see logs.</span>}
                </pre>
              </div>
            </div>
            
            {isExecuting && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Loader className="h-4 w-4 animate-spin text-red-500" />
                  <div className="flex-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {progress}% complete
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Results Panel */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden lg:col-span-1">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Execution Results</h2>
                {executionSummary && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {executionSummary.success} Passed
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      {executionSummary.warning} Warnings
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      {executionSummary.error} Failed
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-auto h-[calc(100vh-380px)] p-4">
              {auditResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Clock className="h-8 w-8 mb-3" />
                  <p>No results yet. Execute audits to see results.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditResults.map((result, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {result.script}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {result.device} • {result.duration || '0ms'}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : result.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status || 'unknown'}
                        </span>
                      </div>
                      
                      {result.summary && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">Summary:</div>
                          <div className={`text-xs p-2 rounded ${
                            result.status === 'success'
                              ? 'bg-green-50 text-green-700'
                              : result.status === 'warning'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {result.summary}
                          </div>
                        </div>
                      )}
                      
                      {result.log && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">Details:</div>
                          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                            {result.log}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAuditExecutor;