import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "./button";
import { Switch } from "./ui/switch";
import { cn } from "../lib/utils";

const auditDirectories = [
  { 
    name: 'Network Security', 
    subDirectories: [
      {
        name: 'Firewall',
        scripts: ['network_chk_firewall.js', 'network_scan_ports.js']
      },
      {
        name: 'Encryption',
        scripts: ['network_chk_encryption.js']
      }
    ]
  },
  { 
    name: 'User Access', 
    subDirectories: [
      {
        name: 'Permissions',
        scripts: ['user_chk_permissions.js', 'user_validate_roles.js']
      },
      {
        name: 'Authentication',
        scripts: ['user_chk_2fa.js']
      }
    ]
  }
];

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
  const [selectedAudits, setSelectedAudits] = useState([]);
  const [executionLogs, setExecutionLogs] = useState('');
  const [auditResults, setAuditResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDryRun, setIsDryRun] = useState(false);
  
  // Backup-related states
  const [backups, setBackups] = useState([]);
  const [isBackupPanelOpen, setIsBackupPanelOpen] = useState(false);

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

  // Render Audit Tree (existing method)
  const renderAuditTree = () => {
    return auditDirectories.map((dir) => {
      const subDirs = dir.subDirectories.filter((subDir) =>
        subDir.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return (
        <div key={dir.name} className="mb-4">
          <h3 className="font-bold text-lg">{dir.name}</h3>
          {subDirs.map((subDir) => (
            <div key={subDir.name} className="ml-4">
              <h4 className="font-medium text-md">{subDir.name}</h4>
              <ul className="ml-4">
                {subDir.scripts.map((script) => (
                  <li key={script}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAudits.includes(script)}
                        onChange={(e) => handleAuditSelection(script, e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="text-sm">{script}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    });
  };

  // Handle audit selection toggle
  const handleAuditSelection = (script, isChecked) => {
    setSelectedAudits((prev) =>
      isChecked ? [...prev, script] : prev.filter((item) => item !== script)
    );
  };

  // Execute audits
  const executeAudits = async () => {
    // Create backup before execution
    await createBackup();

    setExecutionLogs((prev) => prev + '\nExecuting selected audits...\n');
    setProgress(0);
    setAuditResults([]);

    try {
      const totalAudits = selectedAudits.length;
      for (let i = 0; i < totalAudits; i++) {
        const audit = selectedAudits[i];
        
        // Simulate audit execution
        setExecutionLogs((prev) => prev + `Running: ${audit}\n`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Update progress and logs
        const status = isDryRun ? 'simulated' : 'passed';
        setAuditResults((prev) => [...prev, {
          name: audit,
          status: status,
          details: isDryRun ? 'Simulated audit execution' : 'Audit passed successfully'
        }]);
        
        setExecutionLogs((prev) => prev + `Completed: ${audit}\n`);
        setProgress(((i + 1) / totalAudits) * 100);
      }

      setExecutionLogs((prev) => prev + (isDryRun 
        ? 'Simulation completed successfully.\n' 
        : 'All audits executed successfully.\n')
      );
    } catch (error) {
      setExecutionLogs((prev) => prev + `Error during execution: ${error.message}\n`);
      setAuditResults((prev) => [...prev, {
        name: 'Execution Error',
        status: 'failed',
        details: error.message
      }]);
    } finally {
      setProgress(100);
    }
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
                onChange={(e) => setIsDryRun(e.target.checked)}
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="overflow-auto max-h-96">
            {renderAuditTree()}
          </div>
          <button
            onClick={executeAudits}
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
            {auditResults.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  result.status === 'passed' ? 'bg-green-100' :
                  result.status === 'failed' ? 'bg-red-100' :
                  result.status === 'simulated' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.name}</span>
                  <span>{result.status.toUpperCase()}</span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-line">{result.details}</p>
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
