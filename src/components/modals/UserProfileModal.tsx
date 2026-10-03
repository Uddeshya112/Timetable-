import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetable } from '../../context/TimetableContext';
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  KeyRound,
  GraduationCap,
  BookOpen,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Save,
  Activity,
  Layers,
  Smartphone,
  Fingerprint,
  RotateCcw,
  Bell
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSwitchAccount?: () => void;
}

export function UserProfileModal({ isOpen, onClose, onOpenSwitchAccount }: UserProfileModalProps) {
  const {
    currentUser,
    currentInstitution,
    currentMembership,
    currentRole,
    userPermissions,
    allPermissions,
    allSessions,
    updateUserProfile,
    revokeSession,
    currentWorkspace,
    authorizedWorkspaces,
    switchWorkspace,
  } = useAuth();

  const { courses, sessions, auditLogs } = useTimetable();

  const [activeTab, setActiveTab] = useState<'identity' | 'academic' | 'rbac' | 'security' | 'audit'>('identity');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [officeLocationInput, setOfficeLocationInput] = useState(currentUser?.officeLocation || '');
  const [officeHoursInput, setOfficeHoursInput] = useState(currentUser?.officeHours || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      phone: phoneInput.trim(),
      officeLocation: officeLocationInput.trim(),
      officeHours: officeHoursInput.trim(),
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Find user's teaching or enrolled sessions
  const userSessions = sessions.filter(
    s => s.facultyId === currentUser.id || s.facultyId === 'fac-sharma' || s.sectionId === currentUser.sectionId
  );

  // Filter audit logs initiated by this user
  const userAuditLogs = auditLogs.filter(
    l => l.userId === currentUser.id || l.userId === 'coordinator'
  ).slice(0, 6);

  const activeUserSession = allSessions.find(s => s.userId === currentUser.id && !s.isRevoked) || allSessions[0];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Institutional Banner Header */}
        <div className="relative bg-gradient-to-r from-zinc-900 via-red-950/30 to-zinc-900 p-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-red-600/40 shadow-lg shadow-red-950"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-red-900/40 text-red-200 flex items-center justify-center font-bold text-2xl border border-red-700/40">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-zinc-900" title="Active DPDPA Verified Session" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/60 text-red-300 border border-red-800/60">
                    {currentRole?.name || 'Institutional Member'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> {currentUser.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-red-400" />
                    <span>{currentInstitution.name} ({currentInstitution.code})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-mono text-zinc-300">{currentUser.email}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-zinc-800/80 -mb-6 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('identity')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'identity'
                  ? 'border-red-600 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Identity & Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'academic'
                  ? 'border-red-600 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Academic & Load</span>
            </button>

            <button
              onClick={() => setActiveTab('rbac')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'rbac'
                  ? 'border-red-600 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>RBAC Permissions ({userPermissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'border-red-600 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Security & Sessions</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'border-red-600 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Audit Provenance</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Institutional profile preferences updated successfully.</span>
            </div>
          )}

          {/* TAB 1: IDENTITY & CONTACT */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Profile & Contact Information
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Official institutional profile for {currentUser.name}
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => {
                      setPhoneInput(currentUser.phone || '');
                      setOfficeLocationInput(currentUser.officeLocation || '');
                      setOfficeHoursInput(currentUser.officeHours || '');
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Contact Info</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  {authorizedWorkspaces.length > 1 && (
                    <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-2.5">
                      <div className="text-[10px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                        Authorized Workspaces ({authorizedWorkspaces.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {authorizedWorkspaces.map(ws => (
                          <button
                            key={ws}
                            onClick={() => {
                              switchWorkspace(ws);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              currentWorkspace === ws
                                ? 'bg-red-700 text-white font-semibold shadow-sm'
                                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
                            }`}
                          >
                            <span>{ws === 'CR' ? 'Class Representative' : `${ws} Portal`}</span>
                            {currentWorkspace === ws && <span className="ml-1.5 text-[10px] opacity-80">(Active)</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Organizational Placement
                    </span>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Primary Department</span>
                        <span className="font-semibold text-slate-200">
                          {currentUser.department || 'Computer Science & Engineering'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Institutional Tenant</span>
                        <span className="font-semibold text-slate-200">
                          {currentInstitution.name} ({currentInstitution.code})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Specialization / Domain</span>
                        <span className="font-semibold text-slate-200">
                          {currentUser.specialization || 'Academic Optimization & Engineering'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Contact & Office Availability
                    </span>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Institutional Email</span>
                        <span className="font-mono font-semibold text-slate-200">{currentUser.email}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Contact Telephone</span>
                        <span className="font-semibold text-slate-200">{currentUser.phone || '+91 11 2948 1000'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Office Room Location</span>
                        <span className="font-semibold text-slate-200">{currentUser.officeLocation || 'Faculty Enclave, Block A'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Office / Advisory Hours</span>
                        <span className="font-semibold text-indigo-300">{currentUser.officeHours || 'Mon & Wed 14:00 - 16:00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="p-5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 space-y-4">
                  <div className="font-bold text-white text-xs">Edit Contact & Office Information</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-medium">Telephone Number</label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="+91 98110 00000"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-medium">Office Room / Chamber</label>
                      <input
                        type="text"
                        value={officeLocationInput}
                        onChange={e => setOfficeLocationInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="Block A, Room 402"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] text-slate-300 font-medium">Advisory / Office Hours</label>
                      <input
                        type="text"
                        value={officeHoursInput}
                        onChange={e => setOfficeHoursInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="Mon & Thu 14:00 - 16:00"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Updates</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Student Identification Cards if applicable */}
              {currentUser.rollNumber && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Student Enrollment Credentials
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Roll Number</span>
                      <span className="font-mono font-bold text-white">{currentUser.rollNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Academic Batch</span>
                      <span className="font-mono font-bold text-white">{currentUser.batch}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Class Section</span>
                      <span className="font-mono font-bold text-white">CSE-A (Semester 5)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CR Status</span>
                      <span className="font-bold text-cyan-300">
                        {currentRole?.code === 'CLASS_REPRESENTATIVE' ? 'Active CR' : 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACADEMIC & TEACHING LOAD */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Academic Teaching Load & Curriculum Mapping
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Real-time workload adherence compliant with UGC Regulations (Assoc. Prof 14h / Asst. Prof 16h)
                </p>
              </div>

              {/* UGC Norm Workload Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Direct Weekly Teaching</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">12 / 14 hrs</span>
                  <span className="text-[10px] text-slate-500 block mt-1">UGC Ceiling: 14 hrs/wk</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Protected Research Free-Time</span>
                  <span className="text-2xl font-bold font-mono text-indigo-400">6 hrs / wk</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Reserved against solver</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Free-Slot Marketplace</span>
                  <span className="text-2xl font-bold font-mono text-cyan-400">Active</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Voluntary tutorials</span>
                </div>
              </div>

              {/* Assigned Subjects / Active Timetable Sessions */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">
                  Assigned Course Offerings & Timetable Routine
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {courses.slice(0, 4).map(course => (
                    <div
                      key={course.id}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{course.code}: {course.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Credits: {course.credits} · Weekly Lectures: {course.requiredLecturesPerWeek}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[10px]">
                        Sem 5
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RBAC PERMISSIONS */}
          {activeTab === 'rbac' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Effective Role-Based Access Control (RBAC)
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Role: <span className="font-bold text-indigo-300">{currentRole?.name}</span> ({currentRole?.code})
                  </p>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  {userPermissions.length} Active Grants
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allPermissions.map(perm => {
                  const isGranted = userPermissions.includes(perm.code);

                  return (
                    <div
                      key={perm.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                        isGranted
                          ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                          : 'bg-slate-950/30 border-slate-800/40 text-slate-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs font-bold ${isGranted ? 'text-white' : 'text-slate-500'}`}>
                            {perm.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {perm.description}
                        </p>
                        <span className="text-[9px] font-mono text-slate-500 block pt-0.5">
                          {perm.code}
                        </span>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isGranted ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 block" title="Granted" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700 block" title="Restricted" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & SESSIONS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Active Session Cache & Enterprise Security
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  High-speed session validation via Redis-style fast store with instant revocation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">
                    Active JWT / Session Token
                  </span>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Token ID:</span>
                      <span className="text-slate-200 font-bold">{activeUserSession.token.slice(0, 16)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Authentication IP:</span>
                      <span className="text-slate-200">{currentUser.ipAddress || '192.168.10.45'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Created:</span>
                      <span className="text-slate-200">{new Date(activeUserSession.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-400 font-bold">
                        {activeUserSession.isRevoked ? 'REVOKED' : 'VALID / ACTIVE'}
                      </span>
                    </div>
                  </div>

                  {!activeUserSession.isRevoked && (
                    <button
                      onClick={() => revokeSession(activeUserSession.id)}
                      className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors mt-2"
                    >
                      Revoke Active Session Token
                    </button>
                  )}
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                    Enterprise SSO & 2FA Status
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Institutional SSO</span>
                      <span className="font-semibold text-slate-200">
                        {currentUser.ssoProvider || 'Google Workspace SAML'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Two-Factor Authentication (2FA)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Fingerprint className="h-3.5 w-3.5" /> Enforced
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">DPDPA 2023 Compliance</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">
                  Automated Disruption Alert Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>Email Broadcasts</span>
                    <span className="text-emerald-400 font-mono font-bold">Enabled</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>In-App Recovery Alerts</span>
                    <span className="text-emerald-400 font-mono font-bold">Enabled</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>Urgent SMS (Freeze &lt;24h)</span>
                    <span className="text-emerald-400 font-mono font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT PROVENANCE */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Immutable Institutional Audit Trail
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Record of changes, solver executions, and approvals committed by this account.
                </p>
              </div>

              <div className="space-y-2">
                {userAuditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-300 text-[11px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-slate-500">User ID: {currentUser.id}</span>
            <span>·</span>
            <span>Last Login: {new Date(currentUser.lastLoginAt).toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSwitchAccount && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSwitchAccount();
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              >
                Switch Account / Role
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
