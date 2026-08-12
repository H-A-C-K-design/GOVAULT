import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Eye } from 'lucide-react';
import { DataService } from '../services/dataService';
import type { GovernmentDocument } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { EmptyState } from '../components/common/EmptyState';

export const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<GovernmentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getDocumentsList().then(docs => {
      setTasks(docs.filter(d => d.status === 'Submitted' || d.status === 'Under Review' || d.status === 'Changes Requested'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-500" />
          <span>My Review & Approval Tasks</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Documents assigned for technical verification, departmental review, or executive sign-off.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading pending task assignments...</div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No pending tasks assigned"
          description="You have completed all pending document review and approval assignments."
          actionText="View Document Registry"
          actionLink="/documents"
        />
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-gov-600 dark:text-gov-400">{task.documentNumber}</span>
                  <StatusBadge status={task.status} size="sm" />
                  <PriorityBadge priority={task.priority} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{task.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{task.description}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>Dept: <strong className="text-slate-700 dark:text-slate-300">{task.departmentName}</strong></span>
                  <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{task.ownerName}</strong></span>
                </div>
              </div>

              <Link
                to={`/documents/${task.id}`}
                className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>Review & Authorize</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
