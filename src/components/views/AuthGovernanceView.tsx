import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetable } from '../../context/TimetableContext';
import {
  ShieldCheck,
  Building,
  KeyRound,
  UserCheck,
  Users,
  Lock,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Terminal,
  Activity
} from 'lucide-react';

export function AuthGovernanceView() {
  const {
    allUsers,
    allMemberships,
    allRoleAssignments,
    allRoles,
    allPermissions,
    allSessions,
    currentInstitution,
    currentUser,
    updateUserRole,
    addRoleAssignment,
    revokeSession,
  } = useAuth();

  const [newEmail, setNewEmail] = useState('');
  const [newRoleId, setNewRoleId] = useState('role-faculty');
  const [newNotes, setNewNotes] = useState('');

  // Role change modal state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<string>('role-hod');
  const [roleChangeReason, setRoleChangeReason] = useState<string>('Promoted by College Academic Council');
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    addRoleAssignment(newEmail.trim(), newRoleId, newNotes.trim());
    setNewEmail('');
    setNewNotes('');
  };

  const handleExecuteRoleChange = () => {
    if (!editingUserId) return;
    updateUserRole(editingUserId, selectedNewRole, roleChangeReason);
    setShowRoleModal(false);
    setEditingUserId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Production Identity & Access Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Central Users, Memberships & Pre-Authorized RBAC
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Production college-wide authentication: Single centralized user table (`auth.users`), college-aware memberships (`auth.memberships`), pre-authorized onboarding directory (`auth.role_assignments`), and fast Redis session cache.
        </p>
      </div>

      {/* Three Database Schemas Blueprint (Section 12) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Institutional 3-Schema Relational Architecture</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            PostgreSQL Authoritative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-indigo-400 flex items-center justify-between">
              <span>schema: auth</span>
              <span className="text-[10px] text-slate-500">Security Layer</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• auth.users (central accounts)</li>
              <li>• auth.memberships (college-aware)</li>
              <li>• auth.roles & permissions</li>
              <li>• auth.role_assignments (pre-auth)</li>
              <li>• auth.sessions (fast cache)</li>
              <li>• auth.audit_logs (who/what/when)</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-cyan-400 flex items-center justify-between">
              <span>schema: academic</span>
              <span className="text-[10px] text-slate-500">Digital Twin</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• academic.institutions</li>
              <li>• academic.campuses & depts</li>
              <li>• academic.programs & semesters</li>
              <li>• academic.courses & credits</li>
              <li>• academic.sections & batches</li>
              <li>• academic.enrollments</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>schema: timetable</span>
              <span className="text-[10px] text-slate-500">Solver Engine</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• timetable.rooms & labs</li>
              <li>• timetable.time_slots</li>
              <li>• timetable.sessions</li>
              <li>• timetable.versions (snapshots)</li>
              <li>• timetable.constraints & locks</li>
              <li>• timetable.recovery_tasks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Grid: Central Users & Pre-Authorized Email Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Central auth.users Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Central Users & Institutional Memberships (`auth.users`)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Institution: {currentInstitution.name} ({currentInstitution.code})
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">{allUsers.length} Accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Assigned Role</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allUsers.map(user => {
                    const membership = allMemberships.find(
                      m => m.userId === user.id && m.institutionId === currentInstitution.id
                    );
                    const role = allRoles.find(r => r.id === membership?.roleId);

                    return (
                      <tr key={user.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white text-xs">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {user.id}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-300">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            role?.code === 'COORDINATOR'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : role?.code === 'HOD'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : role?.code === 'FACULTY'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : role?.code === 'COLLEGE_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {role?.name || 'Student'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> ACTIVE
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setSelectedNewRole(membership?.roleId === 'role-faculty' ? 'role-hod' : 'role-faculty');
                              setShowRoleModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors border border-slate-700"
                          >
                            Change Role
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Redis Sessions Cache (Section 6, 13) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  <span>Active Session Cache (`auth.sessions`)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  High-speed session validation layer. Invalidation triggers instant logout on administrative role mutation.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {allSessions.filter(s => !s.isRevoked).length} Active Tokens
              </span>
            </div>

            <div className="space-y-2">
              {allSessions.map(session => {
                const user = allUsers.find(u => u.id === session.userId);
                const role = allRoles.find(r => r.id === session.roleId);

                return (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      session.isRevoked
                        ? 'bg-rose-500/5 border-rose-500/20 text-slate-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{user?.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({role?.name})</span>
                        {session.isRevoked ? (
                          <span className="text-[10px] font-mono text-rose-400 font-bold">REVOKED</span>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">VALID</span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Token: {session.token.slice(0, 16)}... · Expires: {new Date(session.expiresAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {!session.isRevoked && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="px-2.5 py-1 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        Revoke Token
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Pre-Authorized Email Directory (Section 4 & 8) */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-indigo-400" />
                <span>Pre-Authorized Staff Directory (`auth.role_assignments`)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Prevents arbitrary role self-selection. When staff register, system looks up explicit role assignments.
              </p>
            </div>

            {/* Add Pre-Authorized Email Form */}
            <form onSubmit={handleAddAssignment} className="space-y-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-200">
                Pre-Authorize Privileged Staff
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Institutional Email</label>
                <input
                  type="email"
                  placeholder="e.g. new.professor@apex.edu.in"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Pre-Approved Role</label>
                <select
                  value={newRoleId}
                  onChange={e => setNewRoleId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  {allRoles.filter(r => r.code !== 'STUDENT').map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Notes / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Assistant Professor (Networks Lab)"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Pre-Authorize Email</span>
              </button>
            </form>

            {/* List of Pre-Authorized Emails */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Current Authorizations
              </span>
              {allRoleAssignments.map(ra => {
                const role = allRoles.find(r => r.id === ra.roleId);

                return (
                  <div
                    key={ra.id}
                    className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-200 text-[11px] font-semibold">
                        {ra.email}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        ra.status === 'CLAIMED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {ra.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Role: <strong className="text-slate-300">{role?.name}</strong></span>
                      {ra.notes && <span className="truncate max-w-[120px]">{ra.notes}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Role Change Modal (Section 9) */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-950/90 z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-bold text-white">Administrative Membership Role Change</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updating a user's role immediately invalidates their active session token in the session cache, requires re-authorization, and records an immutable audit entry (Section 9).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Select New Role</label>
                <select
                  value={selectedNewRole}
                  onChange={e => setSelectedNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                >
                  {allRoles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Reason for Role Adjustment</label>
                <input
                  type="text"
                  value={roleChangeReason}
                  onChange={e => setRoleChangeReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRoleChange}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Execute & Invalidate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
