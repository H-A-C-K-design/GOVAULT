import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/dataService';
import type { UserProfile } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminRegistrationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionStatus, setActionStatus] = useState<'approved' | 'rejected' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const users = await DataService.getAllUsers();
      setRequests(users.filter(u => u.accountStatus === 'pending'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmAction = async (reason?: string) => {
    if (!selectedUser || !actionStatus || !currentUser) return;
    try {
      await DataService.updateOfficerStatus(selectedUser.uid, actionStatus, currentUser, reason);
      setModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-amber-500" />
          <span>Officer Registration Approvals Queue</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verify identity credentials and authorize new officer account access requests.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading pending requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No pending registration requests"
          description="All officer onboarding applications have been verified and processed."
        />
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.uid} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{req.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    PENDING APPROVAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>Employee ID: <strong className="font-mono text-gov-600 dark:text-gov-400">{req.employeeId}</strong></p>
                  <p>Official Email: <strong>{req.officialEmail}</strong></p>
                  <p>Department: <strong>{req.departmentName}</strong></p>
                  <p>Designation: <strong>{req.designation}</strong></p>
                  <p>Office Branch: <strong>{req.officeBranch}</strong></p>
                  <p>Submitted: <strong>{new Date(req.createdAt).toLocaleString()}</strong></p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => { setSelectedUser(req); setActionStatus('rejected'); setModalOpen(true); }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                >
                  Reject Request
                </button>

                <button
                  onClick={() => { setSelectedUser(req); setActionStatus('approved'); setModalOpen(true); }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Approve Officer
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={actionStatus === 'approved' ? 'Approve Officer Account' : 'Reject Officer Request'}
        message={actionStatus === 'approved' ? `Approve officer ${selectedUser?.fullName} for deployment into ${selectedUser?.departmentName}?` : `Reject registration request for ${selectedUser?.fullName}?`}
        type={actionStatus === 'approved' ? 'info' : 'danger'}
        requireReason={actionStatus === 'rejected'}
      />

    </div>
  );
};
