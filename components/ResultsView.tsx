import React, { useState, useEffect } from 'react';
import { GeminiResponse, SystemIssue } from '../types';
import { CheckCircle, AlertTriangle, Zap, Server, Shield, HardDrive, Wifi, Lock, Package, CheckSquare, Square, Play, Info } from 'lucide-react';

interface ResultsViewProps {
  data: GeminiResponse | null;
  onFix: (selectedIssues: SystemIssue[]) => void;
  isFixing: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, onFix, isFixing }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data?.issues) {
      const allIds = data.issues.map(i => i.id);
      setSelectedIds(new Set(allIds));
    }
  }, [data]);

  if (!data) return null;

  const toggleIssue = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === data.issues.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(data.issues.map(i => i.id)));
  };

  const handleFixClick = () => {
    const selectedIssues = data.issues.filter(i => selectedIds.has(i.id));
    onFix(selectedIssues);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'text-cyber-danger border-cyber-danger bg-cyber-danger/10';
      case 'High': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-cyber-warning border-cyber-warning bg-cyber-warning/10';
      default: return 'text-cyber-success border-cyber-success bg-cyber-success/10';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'Storage': return <HardDrive className="w-4 h-4" />;
      case 'Network': return <Wifi className="w-4 h-4" />;
      case 'Performance': return <Zap className="w-4 h-4" />;
      case 'Privacy': return <Lock className="w-4 h-4" />;
      case 'Apps': return <Package className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-700 pb-20">
      
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-cyber-panel border border-cyber-border p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="text-cyber-warning w-5 h-5" />
            Executive System Audit
          </h2>
          <p className="text-gray-400 leading-relaxed font-light mb-4">
            {data.analysisSummary}
          </p>
          {/* Tips Integrated Here */}
           <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
             <span className="text-xs text-cyber-primary font-bold uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3 h-3" /> Key Recommendation
             </span>
             <p className="text-sm text-gray-300 italic">"{data.maintenanceTips[0]}"</p>
           </div>
        </div>
        
        <div className="bg-cyber-panel border border-cyber-border p-6 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
           <span className="text-gray-500 text-xs mb-1 uppercase tracking-wider">System Health Index</span>
           <span className={`text-6xl font-bold font-mono ${data.healthScore < 70 ? 'text-cyber-warning' : 'text-cyber-success'}`}>
             {data.healthScore}
           </span>
           <div className="w-full bg-black h-2 rounded-full mt-4 overflow-hidden border border-white/5">
             <div className="h-full bg-gradient-to-r from-cyber-danger via-cyber-warning to-cyber-success" style={{ width: `${data.healthScore}%` }}></div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center bg-cyber-dark p-4 rounded-lg border border-cyber-border sticky top-20 z-40 backdrop-blur-md shadow-lg">
        <button 
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {selectedIds.size === data.issues.length ? <CheckSquare className="w-5 h-5 text-cyber-primary" /> : <Square className="w-5 h-5" />}
          <span className="font-medium">{selectedIds.size === data.issues.length ? 'Deselect All' : 'Select All'}</span>
        </button>
        <div className="text-sm font-mono text-cyber-primary">
          {data.issues.length} Issues Found
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 gap-3">
        {data.issues.map((issue) => (
          <div 
            key={issue.id}
            onClick={() => toggleIssue(issue.id)}
            className={`
              relative p-5 rounded-lg border transition-all cursor-pointer group
              ${selectedIds.has(issue.id) 
                ? 'bg-cyber-panel border-cyber-primary/50' 
                : 'bg-cyber-panel/40 border-cyber-border hover:bg-cyber-panel/60'}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 transition-transform duration-200 ${selectedIds.has(issue.id) ? 'scale-110' : ''}`}>
                 {selectedIds.has(issue.id) 
                   ? <CheckCircle className="w-5 h-5 text-cyber-primary fill-cyber-primary/10" /> 
                   : <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-gray-400"></div>
                 }
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                  <h3 className="font-bold text-gray-200 text-lg">{issue.title}</h3>
                  <div className="flex items-center gap-2">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityColor(issue.severity)}`}>
                       {issue.severity}
                     </span>
                     <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-white/5 uppercase">
                       {getCategoryIcon(issue.category)} {issue.category}
                     </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{issue.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-cyber-black/95 backdrop-blur-xl border-t border-cyber-border p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-gray-400">
                Generate fix protocol for <span className="text-white font-bold">{selectedIds.size}</span> modules.
              </p>
            </div>
            
            <button
            onClick={handleFixClick}
            disabled={isFixing || selectedIds.size === 0}
            className={`
                flex items-center justify-center gap-3 px-8 py-3 rounded-md font-bold text-sm uppercase tracking-wide transition-all w-full md:w-auto
                ${isFixing || selectedIds.size === 0 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-cyber-primary hover:bg-blue-400 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105'}
            `}
            >
              {isFixing ? (
                <>
                  <Zap className="animate-spin w-4 h-4" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Generate Fix Script
                </>
              )}
            </button>
        </div>
      </div>

    </div>
  );
};

export default ResultsView;