import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Bell,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Building,
  User,
  ArrowRight
} from 'lucide-react';

interface AcademicInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcademicInboxModal({ isOpen, onClose }: AcademicInboxModalProps) {
  const { notifications, markNotificationRead, setActiveView } = useTimetable();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full flex flex-col max-h-[550px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Academic Inbox & Dispatch Center
            </h3>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-800">
          {notifications.map(notif => {
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`py-3.5 first:pt-0 last:pb-0 space-y-1.5 cursor-pointer transition-colors ${
                  !notif.read ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        notif.category === 'Critical'
                          ? 'bg-rose-500'
                          : notif.category === 'Warning'
                          ? 'bg-amber-500'
                          : notif.category === 'Success'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <span className="font-bold text-xs text-white">
                      {notif.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-4">
                  {notif.message}
                </p>

                {notif.actionable && (
                  <div className="pl-4 pt-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                        onClose();
                        setActiveView('recovery');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Review in Recovery Engine</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No unread academic alerts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
