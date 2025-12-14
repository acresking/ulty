import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, HardDrive, Activity, Wifi, Database, Search, Lock } from 'lucide-react';

interface ScannerProps {
  onComplete: () => void;
}

const steps = [
  "Initializing Kernel Hooks...",
  "Mounting File System Access...",
  "Mapping MFT Structure...",
  "Scanning Process Threads...",
  "Auditing CPU Interrupts...",
  "Verifying RAM Segments...",
  "Searching Registry Hives...",
  "Locating Junk Artifacts...",
  "Optimizing Network Stack...",
  "Analyzing Security Policies...",
  "Checking Telemetry Outbound...",
  "Verifying Driver Signatures...",
  "Finalizing Heuristic Score...",
  "Compiling Audit Report..."
];

const Scanner: React.FC<ScannerProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalDuration = 6000;
    const intervalTime = 50;
    const stepsCount = totalDuration / intervalTime;
    let currentStepCount = 0;

    const interval = setInterval(() => {
      currentStepCount++;
      const newProgress = Math.min((currentStepCount / stepsCount) * 100, 100);
      setProgress(newProgress);

      const stepIndex = Math.floor((newProgress / 100) * (steps.length - 1));
      setCurrentStep(stepIndex);

      if (currentStepCount >= stepsCount) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-8 space-y-10 animate-in fade-in zoom-in duration-500">
      
      {/* Central HUD */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer Rings */}
        <div className="absolute inset-0 border border-cyber-border/50 rounded-full scale-110"></div>
        <div className="absolute inset-0 border border-cyber-primary/20 rounded-full scale-125 animate-pulse"></div>
        
        {/* Spinning Rings */}
        <div 
            className="absolute inset-0 border-4 border-t-cyber-primary border-r-transparent border-b-cyber-primary border-l-transparent rounded-full animate-spin"
            style={{ animationDuration: '3s' }}
        ></div>
        <div 
            className="absolute inset-4 border-2 border-t-transparent border-r-cyber-secondary border-b-transparent border-l-cyber-secondary rounded-full animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        ></div>

        {/* Center Display */}
        <div className="flex flex-col items-center z-10 bg-cyber-black/50 backdrop-blur-sm p-6 rounded-full border border-white/5">
          <span className="text-6xl font-mono font-bold text-white tabular-nums tracking-tighter">
            {Math.round(progress)}
            <span className="text-xl text-cyber-primary">%</span>
          </span>
          <span className="text-[10px] text-cyber-primary uppercase tracking-[0.2em] mt-2 animate-pulse">
            Deep Scan
          </span>
        </div>
      </div>

      {/* Progress Bar & Log */}
      <div className="w-full space-y-3 max-w-lg">
        <div className="flex justify-between items-center text-xs text-cyber-primary font-mono h-6 uppercase tracking-wider">
          <span className="truncate flex items-center gap-2">
            <Search className="w-3 h-3 animate-bounce" />
            {steps[currentStep]}
          </span>
        </div>
        
        <div className="h-1 bg-cyber-panel rounded-full overflow-hidden w-full relative">
           {/* Moving gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent animate-scan-line"
          ></div>
          <div 
            className="h-full bg-gradient-to-r from-cyber-secondary to-cyber-primary transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Grid Status Icons */}
      <div className="grid grid-cols-4 gap-4 w-full mt-4">
        {[
          { Icon: Cpu, color: 'text-cyber-warning', label: 'CPU' },
          { Icon: Database, color: 'text-cyber-primary', label: 'MEM' },
          { Icon: ShieldCheck, color: 'text-cyber-success', label: 'SEC' },
          { Icon: Wifi, color: 'text-cyber-secondary', label: 'NET' },
        ].map(({ Icon, color, label }, idx) => (
          <div key={idx} className="bg-cyber-panel/50 p-4 rounded-lg border border-cyber-border flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-b ${color.replace('text-', 'from-')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <Icon className={`w-6 h-6 ${color} transition-transform group-hover:scale-110`} />
            
            {/* Fake mini-graph */}
            <div className="flex items-end gap-0.5 h-3 mt-1">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-1 bg-gray-700 rounded-sm animate-pulse`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i*0.1}s` }}></div>
               ))}
            </div>
            
            <span className="text-[10px] text-gray-500 font-mono font-bold">{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Scanner;