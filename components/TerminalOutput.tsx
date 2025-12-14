import React, { useEffect, useRef } from 'react';

interface TerminalOutputProps {
  logs: string[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full bg-[#0c0c0c] border border-gray-800 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] opacity-90">
      <div className="text-gray-500 mb-2 select-none">Microsoft Windows [Version 10.0.19045.3693]</div>
      <div className="text-gray-500 mb-4 select-none">(c) SystemCore Corporation. All rights reserved.</div>
      
      {logs.map((log, index) => (
        <div key={index} className="mb-1 break-words leading-tight">
          <span className="text-gray-500 mr-2 select-none">{new Date().toLocaleTimeString('en-US', {hour12: false})}</span>
          <span className="text-cyber-primary font-bold mr-2">root@syscore:~$</span>
          <span className="text-gray-300 font-medium">{log}</span>
        </div>
      ))}
      
      <div className="flex items-center animate-pulse mt-2">
        <span className="text-cyber-primary font-bold mr-2">root@syscore:~$</span>
        <span className="w-2 h-4 bg-cyber-primary block"></span>
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default TerminalOutput;