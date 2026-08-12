import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import type { SystemNotification } from '../types';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    if (currentUser) {
      DataService.getUserNotifications(currentUser.uid).then(setNotifications);
    }
  }, [currentUser]);

  const handleMarkAsRead = async (id: string) => {
    await DataService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System notices, document status updates, and registration approvals.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No notifications in your inbox</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-5 text-xs transition-colors flex items-start justify-between gap-4 ${
                n.read ? 'bg-white dark:bg-slate-900' : 'bg-gov-50/60 dark:bg-gov-950/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h3>
                  {!n.read && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gov-600 text-white">NEW</span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{n.message}</p>
                <div className="flex items-center space-x-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                  {n.link && (
                    <Link to={n.link} className="text-gov-600 dark:text-gov-400 font-bold hover:underline">
                      View Document →
                    </Link>
                  )}
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 text-xs shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
