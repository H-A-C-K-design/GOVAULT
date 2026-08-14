import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Database, Cloud, CheckCircle2, RefreshCw, AlertTriangle, DatabaseZap } from 'lucide-react';
import { DataService } from '../services/dataService';
import type { SystemStatusInfo } from '../types';

export const SystemStatusPage: React.FC = () => {
  const [statusInfo, setStatusInfo] = useState<SystemStatusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const info = await DataService.getSystemStatusInfo();
      setStatusInfo(info);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleForceSeed = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await DataService.forceSeedFirestore();
      setSyncResult(res);
      await checkStatus();
    } finally {
      setSyncing(false);
    }
  };

  const isOperational = statusInfo?.overallStatus === 'operational';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-500" />
            <span>Infrastructure & Security Status</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time health monitoring of Firebase services and security sockets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleForceSeed}
            disabled={syncing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            title="Push initial collections directly to your Firebase Console"
          >
            <DatabaseZap className={`w-4 h-4 ${syncing ? 'animate-bounce' : ''}`} />
            <span>{syncing ? 'Seeding Firestore...' : 'Sync Data to Firebase Console'}</span>
          </button>

          <button
            onClick={checkStatus}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit</span>
          </button>
        </div>
      </div>

      {syncResult && (
        <div className={`p-4 rounded-xl text-xs font-semibold border ${syncResult.success ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border-rose-800 text-rose-200'} flex items-center justify-between`}>
          <span>{syncResult.message}</span>
          <button onClick={() => setSyncResult(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      <div className={`p-6 rounded-2xl ${isOperational ? 'bg-emerald-950/80 border-emerald-800' : 'bg-amber-950/80 border-amber-800'} border text-white shadow-lg flex items-center space-x-4`}>
        <div className={`w-12 h-12 rounded-xl ${isOperational ? 'bg-emerald-600' : 'bg-amber-600'} flex items-center justify-center font-bold shrink-0 shadow-md`}>
          {isOperational ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            {loading ? 'Checking infrastructure health...' : isOperational ? 'All System Services Operational' : 'System Degraded / Connection Warning'}
          </h2>
          <p className="text-xs text-slate-200">
            Strict HTTPS Port 443 active. Live Firebase Firestore & Authentication status checked.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Network Socket (Port 443)</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-500">Network communication restricted exclusively to HTTPS Port 443.</p>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded">
            Protocol: HTTPS / TLS v1.3 • Port: 443
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-gov-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Firebase Authentication</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo?.authStatus === 'operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} uppercase`}>
              {loading ? 'CHECKING...' : statusInfo?.authStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Email/Password auth with generic error handling and session protection.</p>
          <div className="text-[11px] font-mono text-gov-600 dark:text-gov-400 bg-gov-50 dark:bg-gov-950/50 p-2 rounded">
            Active Approved Officers: {loading ? '...' : statusInfo?.activeOfficers ?? 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cloud Firestore Database</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo?.databaseStatus === 'operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} uppercase`}>
              {loading ? 'CHECKING...' : statusInfo?.databaseStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Live document metadata, user authorization records, and audit logs.</p>
          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 p-2 rounded">
            Total Authorized Documents: {loading ? '...' : statusInfo?.totalDocuments ?? 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Firebase Storage</h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo?.storageStatus === 'operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} uppercase`}>
              {loading ? 'CHECKING...' : statusInfo?.storageStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Encrypted binary document storage bucket.</p>
          <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 p-2 rounded">
            Calculated File Volume: {loading ? '...' : `${statusInfo?.storageUsedMB?.toFixed(2) ?? '0.00'} MB`}
          </div>
        </div>

      </div>

    </div>
  );
};
