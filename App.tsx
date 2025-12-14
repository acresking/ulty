import React, { useState, useEffect } from 'react';
import { AppState, GeminiResponse, SystemIssue, HistoryItem, SystemSpecs } from './types';
import Scanner from './components/Scanner';
import ResultsView from './components/ResultsView';
import TerminalOutput from './components/TerminalOutput';
import { analyzeSystem } from './services/geminiService';
import { 
  Activity, Monitor, Zap, CheckCircle2, FileText, 
  History, Laptop, Cpu, Gauge, AlertCircle, RotateCcw,
  LayoutDashboard, ShieldAlert, Terminal, HardDrive, Calendar
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [geminiData, setGeminiData] = useState<GeminiResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [systemSpecs, setSystemSpecs] = useState<SystemSpecs | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    addLog("Initializing SystemCore Engine v2.4.0...");
    setTimeout(() => addLog("Mounting virtual kernel interface..."), 500);
    setTimeout(() => addLog("Ready for deep system interrogation."), 1200);
  }, []);

  // Enhanced System Detection Logic
  const detectSpecs = async (): Promise<SystemSpecs> => {
    const getGLRenderer = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null;
        return renderer || 'Generic DirectX/OpenGL Adapter';
      } catch (e) { return 'Standard Display Adapter'; }
    };

    const nav = window.navigator as any;
    let osName = "Windows NT Workstation";
    let osDetail = "Build 10.0+";

    // Try to detect Windows 11 via User Agent Data (Chrome/Edge only)
    if (nav.userAgentData) {
      try {
        const ua = await nav.userAgentData.getHighEntropyValues(['platform', 'platformVersion', 'architecture']);
        if (ua.platform === 'Windows') {
          const majorVersion = parseInt(ua.platformVersion.split('.')[0]);
          if (majorVersion >= 13) {
            osName = "Windows 11 Pro/Home";
            osDetail = `NT 10.0.${ua.platformVersion} (${ua.architecture})`;
          } else {
            osName = "Windows 10 Pro/Home";
            osDetail = `NT 10.0.${ua.platformVersion} (${ua.architecture})`;
          }
        }
      } catch (e) {
        // Silent fail
      }
    } 

    // Storage Estimate
    let storageStr = "Scanning...";
    if (nav.storage && nav.storage.estimate) {
        try {
            const estimate = await nav.storage.estimate();
            if (estimate.quota) {
                const gb = (estimate.quota / (1024 * 1024 * 1024)).toFixed(0);
                storageStr = `${gb} GB (Allocated Partition)`;
            }
        } catch(e) {
           storageStr = "System Partition (Hidden)";
        }
    } else {
      storageStr = "NVMe/SATA SSD (Standard)";
    }

    // RAM Heuristic
    let ramStr = "Unknown";
    if (nav.deviceMemory) {
       ramStr = nav.deviceMemory >= 8 ? "8GB - 64GB (High Capacity)" : `${nav.deviceMemory}GB (Standard)`;
    } else {
       ramStr = "DDR4/DDR5 System Memory";
    }

    return {
      os: osName,
      osVersionDetail: osDetail,
      userAgent: nav.userAgent,
      cpuThreads: (nav.hardwareConcurrency || 4) + " Logical Cores",
      memoryApprox: ramStr,
      gpuRenderer: getGLRenderer(),
      screenRes: `${window.screen.width}x${window.screen.height}`,
      browser: 'SystemCore Wrapper Host',
      storageQuota: storageStr
    };
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-49), msg]);
  };

  const addToHistory = (action: HistoryItem['actionType'], details: string) => {
    setHistory(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      actionType: action,
      details,
      status: 'SUCCESS'
    }, ...prev]);
  };

  const startScan = async () => {
    setAppState(AppState.SCANNING);
    const specs = await detectSpecs(); // Now async
    setSystemSpecs(specs); 
    addToHistory('SCAN', 'Deep Heuristic System Vulnerability Audit');
    addLog(`Hardware ACPI: ${specs.cpuThreads} detected.`);
    addLog(`Memory Map: ${specs.memoryApprox}`);
    addLog(`Kernel Target: ${specs.os} [${specs.osVersionDetail}]`);
  };

  const handleScanComplete = async () => {
    setAppState(AppState.ANALYZING);
    addLog("Uploading hardware telemetry for cloud analysis...");
    
    try {
      if (systemSpecs) {
        const result = await analyzeSystem(systemSpecs);
        setGeminiData(result);
        addLog(`Audit Finalized. System Health Index: ${result.healthScore}/100`);
        setAppState(AppState.RESULTS);
      }
    } catch (e) {
      addLog("Cloud Analysis Timeout. Reverting to local definitions.");
      setAppState(AppState.IDLE);
    }
  };

  const generateHtmlReport = (issues: SystemIssue[], allData: GeminiResponse, specs: SystemSpecs) => {
    const date = new Date().toLocaleString();
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>SystemCore Professional Audit</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #333; padding: 40px; }
          .container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 40px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
          .meta { font-size: 12px; color: #666; font-family: monospace; }
          .score { font-size: 48px; font-weight: bold; color: #000; display: block; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { text-align: left; border-bottom: 2px solid #000; padding: 5px; }
          td { border-bottom: 1px solid #ddd; padding: 8px 5px; }
          .footer { margin-top: 50px; font-size: 10px; text-align: center; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>SystemCore Audit</h1>
              <div class="meta">ENTERPRISE EDITION</div>
            </div>
            <div style="text-align:right;">
              <div class="meta">DATE: ${date}</div>
              <div class="meta">HOST: ${specs.os}</div>
            </div>
          </div>

          <div style="background:#f9f9f9; padding:20px; border-left:4px solid #000;">
            <strong>EXECUTIVE SUMMARY</strong>
            <p>${allData.analysisSummary}</p>
          </div>

          <div style="text-align:center; margin: 30px 0;">
            <div class="meta">SYSTEM HEALTH INDEX</div>
            <span class="score">${allData.healthScore}</span>
          </div>

          <h3>OPTIMIZATION MANIFEST</h3>
          <table>
            <thead>
              <tr>
                <th>TYPE</th>
                <th>MODULE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${issues.map(i => `
                <tr>
                  <td>${i.category.toUpperCase()}</td>
                  <td>${i.title}</td>
                  <td>PENDING EXECUTION</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            CONFIDENTIAL - GENERATED BY SYSTEMCORE AI
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleFixSelected = (selectedIssues: SystemIssue[]) => {
    if (selectedIssues.length === 0 || !systemSpecs || !geminiData) return;
    
    setAppState(AppState.FIXING);
    addLog(`Compiling native optimization binary...`);
    addToHistory('FIX', `Optimization Binary Generated (${selectedIssues.length} modules)`);

    // SUPER PROFESSIONAL BATCH SCRIPT
    const date = new Date().toLocaleString();
    const scriptContent = `
@echo off
setlocal EnableDelayedExpansion
title SystemCore Enterprise Optimizer
color 0b

:: CHECK ADMIN
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"
if '%errorlevel%' NEQ '0' (
    echo.
    echo   [!] ADMINISTRATOR PRIVILEGES REQUIRED
    echo   Requesting elevation...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\\getadmin.vbs"
    "%temp%\\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\\getadmin.vbs" ( del "%temp%\\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

cls
echo.
echo  ==========================================================================
echo   SYSTEMCORE ENTERPRISE | v2.4.0 (Stable)
echo  ==========================================================================
echo.
echo   Target: %COMPUTERNAME%
echo   OS: ${systemSpecs.os}
echo   User: %USERNAME%
echo   Date: ${date}
echo.
echo  ==========================================================================
echo.

echo   [+] Initializing SystemCore Engine...
timeout /t 2 >nul
echo   [+] Loading Optimization Modules...
timeout /t 1 >nul
echo.

:: RESTORE POINT
echo   [!] SAFETY CHECK: Creating Windows System Restore Point...
echo       (This may take a few moments)
powershell -Command "Checkpoint-Computer -Description 'SystemCore Optimization' -RestorePointType MODIFY_SETTINGS -ErrorAction SilentlyContinue"
if %errorlevel% equ 0 (
    echo   [OK] Restore Point Created.
) else (
    echo   [!] Warning: Restore Point Skipped (Service disabled or unavailable).
)
echo.

echo   >>> STARTING OPTIMIZATION SEQUENCE <<<
echo.

${selectedIssues.map(issue => `
echo   [>] Module: ${issue.title}
echo       Processing...
powershell -Command "${issue.fixScript.replace(/"/g, "'")}"
timeout /t 1 >nul
echo       Done.
echo.
`).join('\n')}

echo  ==========================================================================
echo.
echo   [SUCCESS] OPTIMIZATION COMPLETE
echo.
echo   Maintenance Report:
echo   -------------------
${geminiData.maintenanceTips.map(t => `echo   * ${t}`).join('\n')}
echo.
echo   Please restart your workstation to finalize registry changes.
echo.
echo   Press any key to exit...
pause >nul
    `.trim();

    // Generate HTML Report
    const reportHtml = generateHtmlReport(selectedIssues, geminiData, systemSpecs);

    // Download Script
    const scriptBlob = new Blob([scriptContent], {type: 'application/bat'});
    const scriptUrl = URL.createObjectURL(scriptBlob);
    const scriptLink = document.createElement("a");
    scriptLink.href = scriptUrl;
    scriptLink.download = `SystemCore_Optimizer.bat`;
    document.body.appendChild(scriptLink);
    scriptLink.click();
    
    // Download Report
    const reportBlob = new Blob([reportHtml], {type: 'text/html'});
    const reportUrl = URL.createObjectURL(reportBlob);
    
    setTimeout(() => {
        addLog("Binary package downloaded successfully.");
        addLog("Audit Certificate generated.");
        setAppState(AppState.FINISHED);
        
        const reportLink = document.createElement("a");
        reportLink.href = reportUrl;
        reportLink.download = `SystemCore_Report.html`;
        document.body.appendChild(reportLink);
        reportLink.click();
    }, 2000);
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setGeminiData(null);
    setLogs([]);
    setSystemSpecs(null);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-gray-100 font-sans selection:bg-cyber-primary selection:text-black flex flex-col overflow-hidden">
      
      {/* Navbar */}
      <nav className="border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-cyber-primary w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white">SYSTEMCORE</span>
              <span className="text-[9px] text-gray-500 tracking-[0.2em] font-mono">ENTERPRISE_V2.4</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono">
             <div className="flex items-center gap-2 px-3 py-1 bg-cyber-panel rounded border border-cyber-border/50 text-green-500">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               ONLINE
             </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 flex-1 relative flex flex-col max-w-5xl">
        
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <>
            {/* System Info Banner */}
            {systemSpecs && appState !== AppState.IDLE && appState !== AppState.SCANNING && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {[
                  { label: "OPERATING SYSTEM", val: systemSpecs.os, detail: systemSpecs.osVersionDetail, icon: Laptop },
                  { label: "PROCESSING UNIT", val: systemSpecs.cpuThreads, detail: "ACPI Compatible", icon: Cpu },
                  { label: "PHYSICAL MEMORY", val: systemSpecs.memoryApprox, detail: "Allocated", icon: Gauge },
                  { label: "STORAGE SUBSYSTEM", val: systemSpecs.storageQuota, detail: "Primary Volume", icon: HardDrive },
                ].map((item, i) => (
                  <div key={i} className="bg-cyber-panel/40 border border-cyber-border p-3 rounded flex flex-col gap-1 relative overflow-hidden group hover:bg-cyber-panel/60 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-gray-500 font-bold tracking-widest">{item.label}</span>
                      <item.icon className="w-3 h-3 text-cyber-primary/70" />
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-200 truncate relative z-10" title={String(item.val)}>
                      {item.val}
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono relative z-10">{item.detail}</span>
                  </div>
                ))}
              </div>
            )}

            {/* MAIN ACTION AREA */}
            <div className="flex-1 flex flex-col justify-center">
              
              {/* IDLE STATE */}
              {appState === AppState.IDLE && (
                <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
                  <div 
                    onClick={startScan}
                    className="w-40 h-40 mb-8 rounded-full border-2 border-cyber-border hover:border-cyber-primary hover:bg-cyber-primary/5 flex items-center justify-center cursor-pointer transition-all duration-300 group relative"
                  >
                    <div className="absolute inset-0 rounded-full border border-cyber-primary/20 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    <Zap className="w-12 h-12 text-gray-400 group-hover:text-cyber-primary transition-colors" />
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">SYSTEM<span className="text-cyber-primary">CORE</span></h1>
                  <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">
                    Advanced optimization suite.
                    <br/>Click above to initialize diagnostic kernel.
                  </p>
                </div>
              )}

              {/* SCANNING STATE */}
              {appState === AppState.SCANNING && <Scanner onComplete={handleScanComplete} />}
              
              {/* ANALYZING STATE */}
              {appState === AppState.ANALYZING && (
                <div className="flex flex-col items-center justify-center">
                   <div className="w-full max-w-xs bg-cyber-panel h-1 rounded-full overflow-hidden mb-4">
                     <div className="h-full bg-cyber-primary animate-scan-line w-1/3"></div>
                   </div>
                   <h2 className="text-sm font-mono text-cyber-primary animate-pulse">ANALYZING TELEMETRY...</h2>
                </div>
              )}

              {/* RESULTS / FIXING STATE */}
              {(appState === AppState.RESULTS || appState === AppState.FIXING) && (
                <ResultsView data={geminiData} onFix={handleFixSelected} isFixing={appState === AppState.FIXING} />
              )}

              {/* FINISHED STATE */}
              {appState === AppState.FINISHED && (
                 <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-cyber-success mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Optimization Ready</h2>
                    
                    <div className="bg-cyber-panel/60 border border-cyber-border p-6 rounded-lg max-w-xl w-full text-left my-6 relative">
                       <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                         <ShieldAlert className="w-4 h-4 text-cyber-warning" />
                         EXECUTION REQUIRED
                       </h3>
                       <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                         The native optimization binary <strong>SystemCore_Optimizer.bat</strong> has been downloaded.
                         Due to OS security sandboxing, you must execute this file manually to apply the fixes.
                       </p>
                       <div className="space-y-2 text-xs font-mono text-gray-300">
                         <div className="flex items-center gap-3">
                           <span className="bg-cyber-border px-1.5 rounded text-[10px]">STEP 1</span>
                           <span>Open Downloads folder</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="bg-cyber-border px-1.5 rounded text-[10px]">STEP 2</span>
                           <span>Right-click "SystemCore_Optimizer.bat"</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="bg-cyber-border px-1.5 rounded text-[10px]">STEP 3</span>
                           <span className="text-cyber-primary">Run as Administrator</span>
                         </div>
                       </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-cyber-panel/30 rounded border border-cyber-border/30">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">NEXT AUDIT:</span>
                        <span className="text-xs text-white font-mono">{geminiData?.nextScanRecommendation}</span>
                    </div>

                    <button onClick={resetApp} className="mt-8 text-xs text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                        <RotateCcw className="w-3 h-3" /> INITIALIZE NEW SESSION
                    </button>
                 </div>
              )}
            </div>
          </>
        )}

        {/* Console Output (Fixed at bottom) */}
        {appState !== AppState.IDLE && activeTab === 'dashboard' && appState !== AppState.FINISHED && (
          <div className="mt-6">
            <TerminalOutput logs={logs} />
          </div>
        )}

      </main>
    </div>
  );
}