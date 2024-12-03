import React, { useState, useCallback } from 'react';
import { Switch } from './switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';

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

const AdvancedAuditExecutor = () => {
  const [selectedAudits, setSelectedAudits] = useState([]);
  const [executionLogs, setExecutionLogs] = useState('');
  const [auditResults, setAuditResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDryRun, setIsDryRun] = useState(false);
  const [backups, setBackups] = useState([]);
  const [currentBackupId, setCurrentBackupId] = useState(null);
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRollbackInProgress, setIsRollbackInProgress] = useState(false);

  // Handle audit selection
  const handleAuditSelect = (scriptName) => {
    setSelectedAudits(prev => {
      if (prev.includes(scriptName)) {
        return prev.filter(name => name !== scriptName);
      } else {
        return [...prev, scriptName];
      }
    });
  };

  // Create backup
  const createBackup = async () => {
    setIsBackupInProgress(true);
    setExecutionLogs(prev => prev + '\nCreating system backup...\n');

    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backupId = Date.now().toString();
      const newBackup = {
        id: backupId,
        timestamp: new Date().toISOString(),
        scripts: selectedAudits,
        state: 'Complete',
        description: `Backup before executing: ${selectedAudits.join(', ')}`
      };

      setBackups(prev => [...prev, newBackup]);
      setCurrentBackupId(backupId);
      setExecutionLogs(prev => prev + `Backup created successfully. Backup ID: ${backupId}\n`);
      
      return backupId;
    } catch (error) {
      setExecutionLogs(prev => prev + `Error creating backup: ${error.message}\n`);
      throw error;
    } finally {
      setIsBackupInProgress(false);
    }
  };

  // Rollback to backup
  const performRollback = async (backupId) => {
    setIsRollbackInProgress(true);
    setExecutionLogs(prev => prev + `\nInitiating rollback to backup ${backupId}...\n`);

    try {
      // Simulate rollback process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const backup = backups.find(b => b.id === backupId);
      setExecutionLogs(prev => prev + 
        `Rolling back the following scripts:\n${backup.scripts.join('\n')}\n` +
        `Restoring system state from backup...\n` +
        `Verifying system integrity...\n` +
        `Rollback completed successfully.\n`
      );

      // Clear current results after rollback
      setAuditResults([]);
      setProgress(0);
    } catch (error) {
      setExecutionLogs(prev => prev + `Error during rollback: ${error.message}\n`);
    } finally {
      setIsRollbackInProgress(false);
    }
  };

  // Simulate dry run execution
  const simulateDryRun = async (auditName) => {
    return {
      status: 'simulated',
      details: `Dry run simulation for ${auditName}:\n` +
        `- Command validation: OK\n` +
        `- Required permissions: Verified\n` +
        `- Estimated execution time: 2-3 seconds\n` +
        `- Target resources: Identified\n` +
        `- Backup requirement: Yes\n` +
        `No actual changes will be made to the system.`
    };
  };

  // Execute selected audits
  const executeAudits = async () => {
    setExecutionLogs('');
    setAuditResults([]);
    setProgress(0);

    const mode = isDryRun ? 'DRY RUN' : 'LIVE';
    setExecutionLogs(`Starting ${mode} execution...\n`);

    try {
      // Create backup before execution (unless it's a dry run)
      if (!isDryRun) {
        await createBackup();
      }

      for (let i = 0; i < selectedAudits.length; i++) {
        const auditName = selectedAudits[i];
        setExecutionLogs(prev => prev + `\nExecuting ${auditName}...\n`);

        try {
          if (isDryRun) {
            const dryRunResult = await simulateDryRun(auditName);
            setExecutionLogs(prev => prev + dryRunResult.details + '\n');
            setAuditResults(prev => [...prev, {
              name: auditName,
              status: dryRunResult.status,
              details: dryRunResult.details
            }]);
          } else {
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                if (Math.random() < 0.1) {
                  reject(new Error('Audit failed'));
                } else {
                  resolve();
                }
              }, 1000);
            });

            const passed = Math.random() < 0.7;
            const status = passed ? 'passed' : 'failed';
            
            setExecutionLogs(prev => prev + `${auditName} ${status}\n`);
            setAuditResults(prev => [...prev, {
              name: auditName,
              status,
              details: passed ? 'All checks passed' : 'Some checks failed'
            }]);
          }
        } catch (error) {
          setExecutionLogs(prev => prev + `Error executing ${auditName}: ${error.message}\n`);
          setAuditResults(prev => [...prev, {
            name: auditName,
            status: 'error',
            details: `Execution failed: ${error.message}`
          }]);
        }

        setProgress(((i + 1) / selectedAudits.length) * 100);
      }
    } catch (error) {
      setExecutionLogs(prev => prev + `Execution failed: ${error.message}\n`);
    }
  };

  // Render backup list
  const renderBackups = () => {
    if (backups.length === 0) {
      return <p className="text-gray-500 italic">No backups available</p>;
    }

    return backups.map(backup => (
      <div key={backup.id} className="border rounded p-2 mb-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Backup ID: {backup.id}</div>
            <div className="text-sm text-gray-600">
              {new Date(backup.timestamp).toLocaleString()}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button 
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                disabled={isRollbackInProgress}
              >
                Rollback
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Rollback</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to rollback to this backup? This will revert all changes made after this backup was created.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => performRollback(backup.id)}>
                  Confirm Rollback
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm mt-1">{backup.description}</div>
      </div>
    ));
  };

  // Render tree structure
  const renderAuditTree = () => {
    return auditDirectories.map(dir => (
      <div key={dir.name} className="ml-4">
        <div className="font-semibold">{dir.name}</div>
        {dir.subDirectories.map(subDir => (
          <div key={subDir.name} className="ml-4">
            <div className="font-medium">{subDir.name}</div>
            {subDir.scripts
              .filter(script => script.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(script => (
                <div key={script} className="ml-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAudits.includes(script)}
                    onChange={() => handleAuditSelect(script)}
                    className="mr-2"
                  />
                  <span>{script}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Audit Executor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Audit Selection Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Select Audits</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isDryRun}
                onCheckedChange={setIsDryRun}
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
            disabled={selectedAudits.length === 0 || isBackupInProgress || isRollbackInProgress}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isDryRun ? "Run Simulation" : "Execute"} ({selectedAudits.length})
          </button>
        </div>

        {/* Execution Logs Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Execution Logs</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded h-96 overflow-auto">
            {executionLogs}
          </pre>
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

        {/* Backups Panel */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">System Backups</h2>
          <div className="space-y-2 overflow-auto max-h-96">
            {renderBackups()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAuditExecutor;
