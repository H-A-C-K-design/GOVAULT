import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Eye, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import type { 
  GovernmentDocument, 
  DocumentVersion, 
  ApprovalWorkflowStep, 
  DocumentStatus 
} from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidentialityBadge } from '../components/common/ConfidentialityBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { WorkflowStepper } from '../components/documents/WorkflowStepper';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SkeletonCard } from '../components/common/SkeletonLoader';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();

  const [document, setDocument] = useState<GovernmentDocument | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [workflows, setWorkflows] = useState<ApprovalWorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'versions'>('preview');

  const [modalAction, setModalAction] = useState<DocumentStatus | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const [doc, verList, wfList] = await Promise.all([
          DataService.getDocumentById(id),
          DataService.getDocumentVersions(id),
          DataService.getDocumentWorkflows(id)
        ]);
        setDocument(doc);
        setVersions(verList);
        setWorkflows(wfList);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  }

  if (!document) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Document Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested document record does not exist or has been archived.</p>
        <button onClick={() => navigate('/documents')} className="mt-4 px-4 py-2 bg-gov-600 text-white rounded-lg text-xs font-bold">
          Return to Documents
        </button>
      </div>
    );
  }

  const isReviewerOrAdmin = hasRole(['super_admin', 'department_admin', 'reviewer']);
  const canApprove = isReviewerOrAdmin && (document.status === 'Submitted' || document.status === 'Under Review');

  const handleStatusChangeConfirm = async (reason?: string) => {
    if (!modalAction || !currentUser) return;
    try {
      const updated = await DataService.updateDocumentStatus(document.id, modalAction, reason || 'Action taken', currentUser);
      setDocument(updated);
      const wfList = await DataService.getDocumentWorkflows(document.id);
      setWorkflows(wfList);
    } catch (err: any) {
      alert(err.message || 'Workflow update failed');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>

        <div className="flex items-center space-x-3">
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={document.fileName}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF ({(document.fileSize / (1024 * 1024)).toFixed(2)}MB)</span>
          </a>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-gov-600 dark:text-gov-400">{document.documentNumber}</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{document.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={document.status} size="lg" />
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          {document.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
            <span className="font-bold text-slate-900 dark:text-white mt-1 block">{document.departmentName}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
            <span className="font-bold text-slate-900 dark:text-white mt-1 block">{document.category}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidentiality</span>
            <div className="mt-1"><ConfidentialityBadge level={document.confidentiality} /></div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Priority</span>
            <div className="mt-1"><PriorityBadge priority={document.priority} /></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center space-x-4">
            <span>Owner: <strong className="text-slate-800 dark:text-slate-200">{document.ownerName}</strong></span>
            <span>Current Version: <strong className="text-gov-600 dark:text-gov-400">v{document.currentVersion}.0</strong></span>
          </div>
          <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
        </div>

      </div>

      <WorkflowStepper currentStatus={document.status} workflowSteps={workflows} />

      {canApprove && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Administrative Approval Action Required</span>
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              As an authorized Reviewer/Administrator, review this file and grant official sign-off or request revisions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setModalAction('Changes Requested'); setModalOpen(true); }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm"
            >
              Request Changes
            </button>
            <button
              onClick={() => { setModalAction('Rejected'); setModalOpen(true); }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
            >
              Reject Document
            </button>
            <button
              onClick={() => { setModalAction('Approved'); setModalOpen(true); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              Grant Approval
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'border-gov-600 text-gov-600 dark:text-gov-400 bg-slate-50 dark:bg-slate-850'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Document Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`px-6 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'versions'
                ? 'border-gov-600 text-gov-600 dark:text-gov-400 bg-slate-50 dark:bg-slate-850'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Version History ({versions.length})</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center py-16">
                <FileText className="w-16 h-16 text-gov-600 dark:text-gov-400 mx-auto mb-3" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{document.fileName}</h4>
                <p className="text-xs text-slate-500 mt-1">Official Document File Container ({(document.fileSize / (1024 * 1024)).toFixed(2)} MB)</p>
                <div className="mt-4">
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gov-600 text-white font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Open & Download Document File</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map(v => (
                <div key={v.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gov-600 dark:text-gov-400">Version {v.versionNumber}.0</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{v.changeDescription}</p>
                    <span className="text-[10px] text-slate-400">Uploaded by {v.uploadedByName} on {new Date(v.createdAt).toLocaleString()}</span>
                  </div>
                  <a
                    href={v.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-gov-100 dark:bg-gov-950 text-gov-700 dark:text-gov-300 font-bold hover:underline"
                  >
                    Download v{v.versionNumber}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleStatusChangeConfirm}
        title={`Confirm Document ${modalAction}`}
        message={`Are you sure you want to mark document ${document.documentNumber} as ${modalAction}?`}
        confirmText={`Set Status to ${modalAction}`}
        type={modalAction === 'Approved' ? 'info' : 'danger'}
        requireReason={modalAction === 'Rejected' || modalAction === 'Changes Requested'}
      />

    </div>
  );
};
