import React from 'react';
import type { ApprovalWorkflowStep, DocumentStatus } from '../../types';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

interface WorkflowStepperProps {
  currentStatus: DocumentStatus;
  workflowSteps: ApprovalWorkflowStep[];
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentStatus, workflowSteps }) => {
  const stages: { label: string; key: ApprovalWorkflowStep['stage'] }[] = [
    { label: 'Upload', key: 'Uploaded' },
    { label: 'Verification', key: 'Verification' },
    { label: 'Department Review', key: 'Review' },
    { label: 'Final Approval', key: 'Approval' },
    { label: 'Archived', key: 'Archived' }
  ];

  const getStageIndex = (status: DocumentStatus) => {
    switch (status) {
      case 'Draft': return 0;
      case 'Submitted': return 1;
      case 'Under Review': return 2;
      case 'Changes Requested': return 2;
      case 'Approved': return 3;
      case 'Rejected': return 3;
      case 'Archived': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>Official Workflow Progression</span>
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-gov-100 dark:bg-gov-950 text-gov-800 dark:text-gov-300 border border-gov-300 dark:border-gov-800">
          Status: {currentStatus}
        </span>
      </div>

      <div className="relative">
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === 'Approved');
            const isCurrent = idx === currentIndex && currentStatus !== 'Approved';
            const isRejected = idx === currentIndex && currentStatus === 'Rejected';
            const isChanges = idx === currentIndex && currentStatus === 'Changes Requested';

            const stepRecord = workflowSteps.find(w => w.stage === stage.key);

            return (
              <div key={stage.key} className="flex sm:flex-col items-start sm:items-center sm:text-center space-x-3 sm:space-x-0">
                
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                      : isRejected
                      ? 'bg-rose-600 text-white ring-4 ring-rose-100 dark:ring-rose-950'
                      : isChanges
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950'
                      : isCurrent
                      ? 'bg-gov-600 text-white ring-4 ring-gov-100 dark:ring-gov-950 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isRejected ? (
                    <XCircle className="w-5 h-5" />
                  ) : isChanges ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="mt-0 sm:mt-3">
                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-gov-600 dark:text-gov-400' : 'text-slate-900 dark:text-white'}`}>
                    {stage.label}
                  </h4>
                  {stepRecord ? (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {stepRecord.actorName} ({stepRecord.actorRole})
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {idx > currentIndex ? 'Pending stage' : 'Awaiting action'}
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Workflow Action History</h4>
        <div className="space-y-3">
          {workflowSteps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-gov-500 mt-1.5 shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{step.actorName} ({step.actorRole})</span>
                  <span className="text-[10px] text-slate-400">{new Date(step.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">Action: <span className="uppercase text-[11px] font-bold text-gov-600 dark:text-gov-400">{step.action.replace('_', ' ')}</span></p>
                {step.remarks && <p className="text-slate-500 italic mt-1 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">"{step.remarks}"</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
