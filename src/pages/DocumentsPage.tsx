import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Plus, 
  Grid, 
  List as ListIcon, 
  Eye
} from 'lucide-react';
import { DataService } from '../services/dataService';
import type { GovernmentDocument, Department } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidentialityBadge } from '../components/common/ConfidentialityBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard, SkeletonTable } from '../components/common/SkeletonLoader';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [docs, depts] = await Promise.all([
          DataService.getDocumentsList(),
          DataService.getDepartmentsList()
        ]);
        setDocuments(docs);
        setDepartments(depts);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredDocs = documents.filter(doc => {
    if (selectedDept !== 'all' && doc.departmentId !== selectedDept) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = doc.title.toLowerCase().includes(q);
      const matchesNum = doc.documentNumber.toLowerCase().includes(q);
      const matchesOwner = doc.ownerName.toLowerCase().includes(q);
      const matchesTag = doc.tags.some(t => t.toLowerCase().includes(q));
      return matchesTitle || matchesNum || matchesOwner || matchesTag;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Official Document Registry</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, inspect, and track government orders, circulars, and policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/documents/upload"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition-all border border-gov-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Document Number (DOC-2026-...), Title, Tag, or Officer name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-end sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-gov-600 dark:text-gov-400 shadow-xs' : 'text-slate-500'}`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-gov-600 dark:text-gov-400 shadow-xs' : 'text-slate-500'}`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Department Filter</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">All Categories</option>
              <option value="Policy">Policy</option>
              <option value="Circular">Circular</option>
              <option value="Order">Order</option>
              <option value="Gazette">Gazette</option>
              <option value="Report">Report</option>
              <option value="Memo">Memo</option>
              <option value="Financial">Financial</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status Filter</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

      </div>

      {loading ? (
        viewMode === 'table' ? <SkeletonTable rows={6} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )
      ) : filteredDocs.length === 0 ? (
        <EmptyState
          title="No documents match your query"
          description="Try clearing your search query or selecting a different department filter."
          actionText="Clear Filters"
          onActionClick={() => { setSearchQuery(''); setSelectedDept('all'); setSelectedCategory('all'); setSelectedStatus('all'); }}
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Doc Number & Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Confidentiality</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] font-bold text-gov-600 dark:text-gov-400 block">{doc.documentNumber}</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</span>
                      <span className="text-[10px] text-slate-400">By {doc.ownerName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                      {doc.category}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {doc.departmentName}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={doc.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <ConfidentialityBadge level={doc.confidentiality} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-gov-600 text-white font-bold hover:bg-gov-500 transition-colors shadow-xs"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-gov-600 dark:text-gov-400">{doc.documentNumber}</span>
                  <StatusBadge status={doc.status} size="sm" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{doc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <ConfidentialityBadge level={doc.confidentiality} />
                  <PriorityBadge priority={doc.priority} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{doc.departmentName}</span>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="font-bold text-gov-600 dark:text-gov-400 hover:underline flex items-center gap-1"
                  >
                    View Record →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
