import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/dataService';
import type { UserProfile, Department, UserRole } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminOfficersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [officers, setOfficers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [targetOfficer, setTargetOfficer] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'role' | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('officer');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const [uList, dList] = await Promise.all([
        DataService.getAllUsers(),
        DataService.getDepartmentsList()
      ]);
      setOfficers(uList);
      setDepartments(dList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredOfficers = officers.filter(u => {
    if (selectedDept !== 'all' && u.departmentId !== selectedDept) return false;
    if (selectedStatus !== 'all' && u.accountStatus !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.officialEmail.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q) ||
        u.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleActionConfirm = async (reason?: string) => {
    if (!targetOfficer || !currentUser || !actionType) return;

    if (actionType === 'suspend') {
      await DataService.updateOfficerStatus(targetOfficer.uid, 'suspended', currentUser, reason);
    } else if (actionType === 'activate') {
      await DataService.updateOfficerStatus(targetOfficer.uid, 'approved', currentUser);
    } else if (actionType === 'role') {
      await DataService.updateOfficerRole(targetOfficer.uid, newRole, currentUser);
    }

    setConfirmOpen(false);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Officer Cadre Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, verify, edit roles, suspend, or activate official government officer accounts.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search officer name, email, employee ID (EMP-...), designation..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Officer Name & ID</th>
                <th className="px-4 py-3">Department & Designation</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                    No officers found in database
                  </td>
                </tr>
              ) : (
                filteredOfficers.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{u.fullName}</span>
                      <span className="font-mono text-[10px] text-gov-600 dark:text-gov-400">{u.employeeId} • {u.officialEmail}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{u.departmentName}</span>
                      <span className="text-[10px] text-slate-400">{u.designation}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.accountStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        u.accountStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {u.accountStatus === 'approved' ? (
                        <button
                          onClick={() => { setTargetOfficer(u); setActionType('suspend'); setConfirmOpen(true); }}
                          className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 text-[11px]"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => { setTargetOfficer(u); setActionType('activate'); setConfirmOpen(true); }}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 text-[11px]"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => { setTargetOfficer(u); setActionType('role'); setNewRole(u.role); setConfirmOpen(true); }}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 text-[11px]"
                      >
                        Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleActionConfirm}
        title={actionType === 'suspend' ? 'Confirm Officer Suspension' : actionType === 'activate' ? 'Confirm Account Activation' : 'Update Officer Role'}
        message={actionType === 'suspend' ? `Are you sure you want to suspend officer ${targetOfficer?.fullName}? They will be blocked from system login.` : `Confirm account state change for ${targetOfficer?.fullName}.`}
        type={actionType === 'suspend' ? 'danger' : 'info'}
        requireReason={actionType === 'suspend'}
      />

    </div>
  );
};
