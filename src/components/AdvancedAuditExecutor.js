import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "./button";
import { Switch } from "./ui/switch";
import { cn } from "../lib/utils";

// Backup Panel Component
const BackupPanel = ({ 
  isOpen, 
  onClose, 
  backups,
  onViewBackup 
}) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-80 bg-zinc-950 text-zinc-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">System Backups</h2>
          <Switch className="data-[state=checked]:bg-pink-400" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-64px)]">
        {backups.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            No backups available
          </div>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.id}
              className="p-4 border-b border-zinc-800 relative group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Backup</span>
                    <span className="text-sm text-zinc-400">
                      {new Date(backup.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1">
                    {backup.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="secondary" 
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                      onClick={() => onViewBackup?.(backup.id)}
                    >
                      Restore
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700"
                    >
                      Details
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            </div>
          ))
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
    fetch('http://localhost:8000/expert/audits')
      .then(res => res.json())
      .then(data => setAuditList(data.audits || []))
      .catch(err => console.error('Failed to fetch audits:', err));
  }, []);

  // Fetch devices from backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/devices')
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
      })
      .catch(err => console.error('Failed to fetch devices:', err));
  }, []);

  // Create backup
  const createBackup = async () => {
    const backupId = Date.now().toString();
    const newBackup = {
      id: backupId,
      timestamp: new Date().toISOString(),
      description: `Backup of ${selectedAudits.length} audit scripts`
    };

    setExecutionLogs(prev => prev + '\nCreating system backup...\n');
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBackups(prev => [...prev, newBackup]);
      setExecutionLogs(prev => prev + `Backup created successfully. ID: ${backupId}\n`);
      
      return backupId;
    } catch (error) {
      setExecutionLogs(prev => prev + `Error creating backup: ${error.message}\n`);
      throw error;
    }
  };

  // View backup details
  const handleViewBackup = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      alert(`Backup Details:\nID: ${backup.id}\nTimestamp: ${backup.timestamp}\nDescription: ${backup.description}`);
    }
  };

  // Render Audit List from backend
  const renderAuditList = () => {
    const filtered = auditList.filter(audit =>
      audit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <ul>
        {filtered.map(audit => (
          <li key={audit.path}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAudits.includes(audit.path)}
                onChange={e => {
                  setSelectedAudits(prev =>
                    e.target.checked
                      ? [...prev, audit.path]
                      : prev.filter(item => item !== audit.path)
                  );
                }}
                className="form-checkbox"
              />
              <span className="text-sm">{audit.name}</span>
            </label>
          </li>
        ))}
      </ul>
    );
  };

  // Execute audits (update to use selectedAudits paths)
  const executeAudits = async (devices) => {
    await createBackup();
    setExecutionLogs(prev => prev + '\nExecuting selected audits...\n');
    setProgress(0);
    setAuditResults([]);
    try {
      const response = await fetch('http://localhost:8000/expert/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audits: selectedAudits,
          dry_run: isDryRun,
          devices: devices // send selected device IDs to backend
        })
      });
      const data = await response.json();
      setAuditResults(data.results || []);
      setExecutionLogs(prev => prev + 'Execution finished.\n');
      setProgress(100);
    } catch (error) {
      setExecutionLogs(prev => prev + `Error during execution: ${error.message}\n`);
      setAuditResults(prev => [...prev, {
        name: 'Execution Error',
        status: 'failed',
        details: error.message
      }]);
      setProgress(100);
    }
  };

  function buildTree(audits) {
    const root = {};
    audits.forEach(({ path, name }) => {
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
  }

  function toggleFolder(path) {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  }

  function isFolderExpanded(path) {
    return !!expandedFolders[path];
  }

  function areAllFilesSelected(files) {
    return files.every(file => selectedAudits.includes(file.path));
  }

  function toggleSelectAll(files) {
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
  }

  function renderTree(node, parentPath = '') {
    return (
      <ul>
        {Object.entries(node)
          .filter(([key]) => key !== 'files')
          .map(([dir, subNode]) => {
            const folderPath = parentPath ? `${parentPath}/${dir}` : dir;
            const files = subNode.files || [];
            return (
              <li key={folderPath} className="ml-2">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <span onClick={() => toggleFolder(folderPath)}>
                    {isFolderExpanded(folderPath) ? '▼' : '▶'}
                  </span>
                  <span className="font-bold" onClick={() => toggleFolder(folderPath)}>
                    {dir}
                  </span>
                  {files.length > 0 && (
                    <button
                      type="button"
                      className="text-xs px-2 py-1 border rounded ml-2"
                      onClick={() => toggleSelectAll(files)}
                    >
                      {areAllFilesSelected(files) ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                {isFolderExpanded(folderPath) && (
                  <div className="ml-4">
                    {renderTree(subNode, folderPath)}
                    {files.length > 0 && (
                      <ul>
                        {files.map(file => (
                          <li key={file.path} className="ml-2">
                            <label className="flex items-center space-x-2">
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
                                className="form-checkbox"
                              />
                              <span
                                className={`text-sm ${selectedAudits.includes(file.path) ? 'font-semibold text-green-700' : ''}`}
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
  }

  const auditTree = buildTree(auditList);

  const openDeviceModal = () => {
    setShowDeviceModal(true);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Backup Panel */}
      <BackupPanel 
        isOpen={isBackupPanelOpen}
        onClose={() => setIsBackupPanelOpen(false)}
        backups={backups}
        onViewBackup={handleViewBackup}
      />

      {showDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select Devices</h2>
            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={selectedDevices.length === deviceList.length}
                  onChange={e => setSelectedDevices(e.target.checked ? deviceList.map(d => d.id) : [])}
                />
                <span className="ml-2">All Devices</span>
              </label>
              <ul>
                {deviceList.map(device => (
                  <li key={device.id}>
                    <label className={`flex items-center ${device.status !== 'connected' ? 'opacity-50' : ''}`}>
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
                      />
                      <span className="ml-2">
                        {device.name} ({device.ip})
                        {device.type === 'local' && <span className="ml-1 text-blue-600">(This Server)</span>}
                        {device.status === 'connected' ? (
                          <span className="ml-2 text-green-600">● Connected</span>
                        ) : (
                          <span className="ml-2 text-red-600">● Not Connected</span>
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeviceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  setShowDeviceModal(false);
                  executeAudits(selectedDevices);
                }}
                disabled={selectedDevices.length === 0}
              >
                Run on Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Advanced Audit Executor</h1>
        
        {/* Backup Button */}
        <Button 
          variant="outline"
          onClick={() => setIsBackupPanelOpen(true)}
          className="flex items-center gap-2"
        >
          Backups ({backups.length})
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Audit Selection Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Select Audits</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isDryRun}
                onChange={e => setIsDryRun(e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-sm">
                Dry Run Mode {isDryRun ? "(Enabled)" : "(Disabled)"}
              </span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search audits..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="overflow-auto max-h-96">
            {renderTree(auditTree)}
          </div>
          <button
            onClick={openDeviceModal}
            disabled={selectedAudits.length === 0}
            className={`w-full mt-4 px-4 py-2 rounded ${
              selectedAudits.length === 0 
              ? 'bg-gray-300 text-gray-600' 
              : 'bg-green-500 text-white'
            }`}
          >
            {isDryRun ? "Run Simulation" : "Execute"} ({selectedAudits.length})
          </button>
        </div>

        {/* Execution Logs Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Execution Logs</h2>
          <div className="overflow-auto max-h-96 bg-gray-100 p-2 rounded border">
            <pre className="text-sm whitespace-pre-wrap">{executionLogs || 'No logs available yet.'}</pre>
          </div>
        </div>

        {/* Results Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div className="space-y-2 overflow-auto max-h-96">
            {auditResults.map((result, idx) => (
              <div key={idx} className="mb-4">
                <div className="font-bold">{result.device} - {result.script}</div>
                <div className="text-xs bg-gray-100 p-2 rounded border mt-1">
                  <pre>{result.log}</pre>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Summary:</span>
                  <pre className="text-green-700">{result.summary}</pre>
                </div>
              </div>
            ))}
          </div>
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded">
                <div
                  className="bg-blue-500 rounded h-2 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-center mt-1">{Math.round(progress)}% Complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAuditExecutor;
