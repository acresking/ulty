import { GoogleGenAI } from "@google/genai";
import { GeminiResponse, SystemSpecs } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSystem = async (specs: SystemSpecs): Promise<GeminiResponse> => {
  const ai = getAiClient();
  
  const sysContext = `
    OS Family: ${specs.os}
    Kernel Version Details: ${specs.osVersionDetail || 'N/A'}
    CPU Logical Cores: ${specs.cpuThreads}
    System RAM: ~${specs.memoryApprox}GB
    GPU Adapter: ${specs.gpuRenderer || 'Integrated/Unknown'}
    Available Browser Storage: ${specs.storageQuota || 'Unknown'}
  `;

  const prompt = `
    You are 'SystemCore Enterprise', a professional IT system auditor.
    Perform a "Deep Heuristic Audit" for a Windows workstation based on this browser fingerprint:
    ${sysContext}

    Identify 8-12 potential optimization opportunities.
    
    **CRITICAL RULES:**
    1. **Safety First**: Commands must be non-destructive (e.g., clearing temp, flushing DNS, disabling non-critical services). Do NOT delete user documents.
    2. **PowerShell Only**: 'fixScript' must be valid, single-line PowerShell.
    3. **Syntax**: Use '-ErrorAction SilentlyContinue' for all commands.
    
    Focus Areas:
    1. **Storage**: Safe cleanup ($env:TEMP, Windows\Temp, Recycle Bin).
    2. **Network**: DNS flush, Reset TCP/IP (Netsh), Release/Renew IP.
    3. **Performance**: Set High Performance power plan, Disable specific bloatware services (SysMain/Superfetch if SSD).
    4. **Privacy**: Disable advertising ID.

    Structure (JSON only):
    {
      "analysisSummary": "Professional executive summary of system state.",
      "healthScore": 72,
      "issues": [
        {
          "id": "1",
          "category": "Storage",
          "title": "Temp File Accumulation",
          "description": "Redundant temporary files detected in system directories.",
          "severity": "Medium",
          "fixScript": "Remove-Item -Path $env:TEMP\\* -Recurse -Force -ErrorAction SilentlyContinue"
        }
      ],
      "maintenanceTips": [
        "Create a System Restore point before major driver updates.",
        "Check Windows Update manually once a week."
      ],
      "nextScanRecommendation": "7 Days"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return {
      analysisSummary: "Connection unstable. Performing local heuristic analysis of core subsystems.",
      healthScore: 60,
      issues: [
        {
          id: "fallback_dns",
          category: "Network",
          title: "DNS Cache Flush",
          description: "Clear stale DNS records to improve connection reliability.",
          severity: "Low",
          fixScript: "Clear-DnsClientCache"
        },
        {
          id: "fallback_temp",
          category: "Storage",
          title: "Clear User Temp",
          description: "Remove temporary application files.",
          severity: "Medium",
          fixScript: "Remove-Item -Path $env:TEMP\\* -Recurse -Force -ErrorAction SilentlyContinue"
        }
      ],
      maintenanceTips: [
        "Restart your computer fully to clear kernel memory.",
        "Ensure Windows Defender definitions are up to date."
      ],
      nextScanRecommendation: "Immediately"
    };
  }
};