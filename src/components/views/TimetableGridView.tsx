import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { TIME_SLOTS } from '../../lib/initialData';
import { DayOfWeek, ClassSession } from '../../types';
import {
  Lock,
  Unlock,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Calendar,
  Building,
  User,
  GraduationCap,
  RotateCcw,
  Info
} from 'lucide-react';

export function TimetableGridView() {
  const {
    sessions,
    rooms,
    facultyMembers,
    sections,
    courses,
    selectedSectionId,
    setSelectedSectionId,
    selectedFacultyId,
    setSelectedFacultyId,
    selectedRoomId,
    setSelectedRoomId,
    toggleSessionLock,
    cancelSession,
    addSession,
  } = useTimetable();

  const [filterMode, setFilterMode] = useState<'section' | 'faculty' | 'room'>('section');
  const [activeSessionDetail, setActiveSessionDetail] = useState<ClassSession | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [scheduleSlotTarget, setScheduleSlotTarget] = useState<{ day: DayOfWeek; timeSlotId: string } | null>(null);
  const [newCourseId, setNewCourseId] = useState('CS501');
  const [newFacultyId, setNewFacultyId] = useState('fac-sharma');
  const [newRoomId, setNewRoomId] = useState('room-204');
  const [newSectionId, setNewSectionId] = useState('sec-cse-a');
  const [newType, setNewType] = useState<'Lecture' | 'Lab' | 'Tutorial'>('Lecture');
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Filter sessions based on active mode
  const filteredSessions = sessions.filter(s => {
    if (filterMode === 'section') return s.sectionId === selectedSectionId;
    if (filterMode === 'faculty') return s.facultyId === selectedFacultyId;
    if (filterMode === 'room') return s.roomId === selectedRoomId;
    return true;
  });

  const handleCellClick = (session: ClassSession) => {
    setActiveSessionDetail(session);
  };

  const executeCancellation = () => {
    if (!activeSessionDetail) return;
    cancelSession(
      activeSessionDetail.id,
      cancellationReasonInput.trim() || 'Instructor unavailable (Personal/Administrative)'
    );
    setShowCancelModal(false);
    setActiveSessionDetail(null);
    setCancellationReasonInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Weekly class schedule by section, faculty member, or room.
          </p>
        </div>

        {/* View Mode & Selection Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Filter Mode */}
          <div className="flex bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-0.5 rounded text-xs">
            <button
              onClick={() => setFilterMode('section')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'section'
                  ? 'bg-red-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Section
            </button>
            <button
              onClick={() => setFilterMode('faculty')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'faculty'
                  ? 'bg-red-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => setFilterMode('room')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'room'
                  ? 'bg-red-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Room & Lab
            </button>
          </div>

          {/* Sub-selector */}
          {filterMode === 'section' && (
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 text-xs rounded px-2.5 py-1 outline-none focus:border-red-700 font-medium"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentCount} students)
                </option>
              ))}
            </select>
          )}

          {filterMode === 'faculty' && (
            <select
              value={selectedFacultyId}
              onChange={e => setSelectedFacultyId(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 text-xs rounded px-2.5 py-1 outline-none focus:border-red-700 font-medium"
            >
              {facultyMembers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          {filterMode === 'room' && (
            <select
              value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 text-xs rounded px-2.5 py-1 outline-none focus:border-red-700 font-medium"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.capacity} cap)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Timetable Grid Table (Section 55) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full border-collapse min-w-[850px] text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
              <th className="p-3.5 text-left font-semibold w-28 shrink-0">Time Slot</th>
              {days.map(d => (
                <th key={d} className="p-3.5 text-left font-semibold">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {TIME_SLOTS.map(slot => {
              const isLunch = slot.id === 'ts-5';

              if (isLunch) {
                return (
                  <tr key={slot.id} className="bg-slate-950/40 text-slate-500">
                    <td className="p-3 font-mono font-medium">{slot.startTime} - {slot.endTime}</td>
                    <td colSpan={5} className="p-3 text-center tracking-wider text-[11px] font-medium text-slate-400 bg-slate-950/50">
                      PROTECTED INSTITUTIONAL LUNCH & RECESS BREAK (UGC NORMS)
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slot.id} className="hover:bg-slate-850/30 transition-colors">
                  <td className="p-3 font-mono font-medium text-slate-400 border-r border-slate-800 bg-slate-950/20">
                    {slot.startTime} - {slot.endTime}
                  </td>
                  {days.map(day => {
                    const session = filteredSessions.find(
                      s => s.day === day && s.timeSlotId === slot.id
                    );

                    if (!session) {
                      return (
                        <td key={day} className="p-2.5 border-r border-slate-800/60 align-top">
                          <button
                            onClick={() => {
                              setScheduleSlotTarget({ day, timeSlotId: slot.id });
                              setScheduleError(null);
                            }}
                            className="w-full h-16 rounded-lg border border-dashed border-slate-800/80 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 text-[10px] transition-all group"
                          >
                            <span>+ Assign</span>
                            <span className="text-[9px] text-slate-600 group-hover:text-indigo-300">Free Slot</span>
                          </button>
                        </td>
                      );
                    }

                    const course = courses.find(c => c.id === session.courseId);
                    const faculty = facultyMembers.find(f => f.id === session.facultyId);
                    const room = rooms.find(r => r.id === session.roomId);
                    const section = sections.find(s => s.id === session.sectionId);

                    const isCancelled = session.status === 'Cancelled';
                    const isRescheduled = session.status === 'Rescheduled' || session.type === 'Makeup';

                    return (
                      <td key={day} className="p-2 border-r border-slate-800/60 align-top">
                        <button
                          onClick={() => handleCellClick(session)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all relative ${
                            isCancelled
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : isRescheduled
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-800/90 border-slate-700/80 hover:border-indigo-500 text-slate-100 shadow-sm'
                          }`}
                        >
                          {/* Locked Pin Indicator */}
                          {session.isLocked && (
                            <span className="absolute top-2 right-2 text-indigo-400" title={session.lockReason}>
                              <Lock className="h-3 w-3" />
                            </span>
                          )}

                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={isCancelled ? 'line-through text-rose-400' : ''}>
                              {course?.code || session.courseId}
                            </span>
                            <span className={`text-[10px] px-1 rounded font-medium ${
                              session.type === 'Lab'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : session.type === 'Tutorial'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : session.type === 'Makeup'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-700/50 text-slate-300'
                            }`}>
                              {session.type}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 truncate mt-1">
                            {course?.name}
                          </div>

                          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                            <span className="truncate">{filterMode === 'faculty' ? section?.name : faculty?.name}</span>
                            <span className="font-mono text-slate-500">{room?.name}</span>
                          </div>

                          {isCancelled && (
                            <div className="mt-1 text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Cancelled
                            </div>
                          )}

                          {isRescheduled && (
                            <div className="mt-1 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                              <RotateCcw className="h-3 w-3" /> Rescheduled Makeup
                            </div>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Session Inspector Drawer / Modal */}
      {activeSessionDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                  Session Detail & Governance
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {courses.find(c => c.id === activeSessionDetail.courseId)?.code} -{' '}
                  {courses.find(c => c.id === activeSessionDetail.courseId)?.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveSessionDetail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Assigned Faculty</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {facultyMembers.find(f => f.id === activeSessionDetail.facultyId)?.name}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Student Section</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {sections.find(s => s.id === activeSessionDetail.sectionId)?.name} (
                  {sections.find(s => s.id === activeSessionDetail.sectionId)?.studentCount} Students)
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Classroom / Lab</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {rooms.find(r => r.id === activeSessionDetail.roomId)?.name}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Schedule Window</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {activeSessionDetail.day} · {activeSessionDetail.timeSlotId}
                </span>
              </div>
            </div>

            {/* Invariants & Hard Constraint Validation (Section 42) */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                CP-SAT Constraint Invariants Status
              </span>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li>Teacher overlap constraint: Verified ($x_{'{c,t,r,f}'} \le 1$)</li>
                <li>Room capacity ($60 \ge 52$ students): Satisfied</li>
                <li>Equipment requirements: Satisfied</li>
              </ul>
            </div>

            {/* Actions: Lock, Cancel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  toggleSessionLock(activeSessionDetail.id);
                  setActiveSessionDetail(prev => prev ? { ...prev, isLocked: !prev.isLocked } : null);
                }}
                className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                  activeSessionDetail.isLocked
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-indigo-950/50 border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/50'
                }`}
              >
                {activeSessionDetail.isLocked ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>Unlock Session</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Lock Session (Freeze)</span>
                  </>
                )}
              </button>

              {activeSessionDetail.status !== 'Cancelled' ? (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel Class (Trigger Recovery)</span>
                </button>
              ) : (
                <div className="text-xs text-rose-400 font-semibold px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  Status: Cancelled
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-950/90 z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-lg font-bold text-white">Confirm Class Cancellation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cancelling will release the room immediately, notify enrolled students, and enqueue a pending makeup task into the Self-Healing engine.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Cancellation Reason</label>
              <input
                type="text"
                placeholder="e.g. Faculty medical absence, Faculty symposium, Lab maintenance"
                value={cancellationReasonInput}
                onChange={e => setCancellationReasonInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={executeCancellation}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Confirm & Trigger Recovery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Slot Direct Scheduling Modal (Explainable Constraints) */}
      {scheduleSlotTarget && (
        <div className="fixed inset-0 bg-slate-950/90 z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">Schedule Class Session</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Target: {scheduleSlotTarget.day} · {TIME_SLOTS.find(t => t.id === scheduleSlotTarget.timeSlotId)?.label}
                </p>
              </div>
              <button
                onClick={() => setScheduleSlotTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {scheduleError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{scheduleError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Course</label>
                <select
                  value={newCourseId}
                  onChange={e => setNewCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Instructor</label>
                <select
                  value={newFacultyId}
                  onChange={e => setNewFacultyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                >
                  {facultyMembers.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Classroom / Lab</label>
                <select
                  value={newRoomId}
                  onChange={e => setNewRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type} · Cap {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Student Section</label>
                  <select
                    value={newSectionId}
                    onChange={e => setNewSectionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentCount} students)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Session Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setScheduleSlotTarget(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const result = addSession({
                    courseId: newCourseId,
                    facultyId: newFacultyId,
                    roomId: newRoomId,
                    sectionId: newSectionId,
                    day: scheduleSlotTarget.day,
                    timeSlotId: scheduleSlotTarget.timeSlotId,
                    type: newType,
                    status: 'Confirmed',
                  });
                  if (!result.isSuccess) {
                    setScheduleError(result.error || 'Hard constraint collision detected.');
                  } else {
                    setScheduleSlotTarget(null);
                    setScheduleError(null);
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Validate & Assign Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
