import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Search } from 'lucide-react';
import { DataService } from '../../services/dataService';
import type { GovernmentDocument } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfidentialityBadge } from '../../components/common/ConfidentialityBadge';

export const AdminDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    DataService.getDocumentsList().then(setDocuments);
  }, []);

  const filtered = documents.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.documentNumber.toLowerCase().includes(query.toLowerCase()) ||
    d.departmentName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-gov-600 dark:text-gov-400" />
          <span>System Documents Monitoring</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Executive monitoring across all departmental document repositories.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all system documents..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Doc Number & Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Confidentiality</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] font-bold text-gov-600 dark:text-gov-400 block">{doc.documentNumber}</span>
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">{doc.departmentName}</td>
                  <td className="px-4 py-3"><ConfidentialityBadge level={doc.confidentiality} /></td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="px-3 py-1.5 rounded bg-gov-600 text-white font-bold hover:bg-gov-500 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
