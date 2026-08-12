import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { DataService } from '../services/dataService';
import type { GovernmentDocument, Department } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidentialityBadge } from '../components/common/ConfidentialityBadge';
import { EmptyState } from '../components/common/EmptyState';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    DataService.getDepartmentsList().then(setDepartments);
    DataService.getDocumentsList().then(setDocuments);
  }, []);

  const results = documents.filter(doc => {
    if (selectedDept !== 'all' && doc.departmentId !== selectedDept) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.tags.some(t => t.toLowerCase().includes(q)) ||
      doc.ownerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-gov-600 dark:text-gov-400" />
          <span>Global Search Interface</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search document numbers, keywords, officer names, departments, and tags across official records.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type document title, number (DOC-2026-...), tags, or officer name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"
            autoFocus
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Filter by Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="all">All Categories</option>
              <option value="Policy">Policy</option>
              <option value="Circular">Circular</option>
              <option value="Order">Order</option>
              <option value="Gazette">Gazette</option>
              <option value="Report">Report</option>
              <option value="Financial">Financial</option>
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="No search results"
          description={`No records found matching "${query}". Try adjusting your keywords or filters.`}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500">Found {results.length} record(s)</p>
          {results.map(doc => (
            <div key={doc.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-gov-600 dark:text-gov-400">{doc.documentNumber}</span>
                  <StatusBadge status={doc.status} size="sm" />
                  <ConfidentialityBadge level={doc.confidentiality} />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{doc.description}</p>
              </div>

              <Link
                to={`/documents/${doc.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shrink-0 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
