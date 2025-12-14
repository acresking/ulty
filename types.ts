export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  FIXING = 'FIXING',
  FINISHED = 'FINISHED'
}

export interface SystemSpecs {
  os: string;
  osVersionDetail?: string;
  userAgent: string;
  cpuThreads: number | string;
  memoryApprox: number | string;
  gpuRenderer?: string;
  screenRes: string;
  browser: string;
  storageQuota?: string;
}

export interface SystemIssue {
  id: string;
  category: 'Security' | 'Performance' | 'Storage' | 'Privacy' | 'Network' | 'Apps';
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  fixScript: string;
}

export interface HistoryItem {
  timestamp: string;
  actionType: 'SCAN' | 'FIX' | 'REPORT';
  details: string;
  status: 'SUCCESS' | 'PENDING';
}

export interface GeminiResponse {
  analysisSummary: string;
  healthScore: number; // 0-100
  issues: SystemIssue[];
  maintenanceTips: string[];
  nextScanRecommendation: string;
}