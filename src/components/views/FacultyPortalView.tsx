import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { TIME_SLOTS } from '../../lib/initialData';
import { DayOfWeek } from '../../types';
import {
  UserSquare2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  Coffee,
  Microscope,
  Lock,
  Plus
} from 'lucide-react';

export function FacultyPortalView() {
  const {
    facultyMembers,
    selectedFacultyId,
    setSelectedFacultyId,
    sessions,
    courses,
    sections,
    rooms,
    recoveryOpportunities,
    scheduleMakeup,
    declineOpportunity,
    claimMarketplaceSlot,
    setFacultyProtectedSlot,
    cancelSession,
  } = useTimetable();

  const currentFaculty = facultyMembers.find(f => f.id === selectedFacultyId) || facultyMembers[0];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  // Daily schedule for current faculty on selected day
  const dailySessions = sessions.filter(
    s => s.facultyId === currentFaculty.id && s.day === selectedDay
  );

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleProtectedToggle = (periodId: string, reason: 'Research' | 'Lunch' | 'Personal' | 'Department' | 'Meeting') => {
    setFacultyProtectedSlot(currentFaculty.id, selectedDay, periodId, reason);
  };

  const handleExecuteCancel = () => {
    if (!sessionToCancel) return;
    cancelSession(sessionToCancel, cancellationReason || 'Academic Symposium Attendance');
    setShowCancelModal(false);
    setSessionToCancel(null);
    setCancellationReason('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Faculty Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            {currentFaculty.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentFaculty.designation} · Department of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFacultyId}
            onChange={e => setSelectedFacultyId(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-red-600 font-medium"
          >
            {facultyMembers.map(f => (
              <option key={f.id} value={f.id}>
                Switch Faculty: {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* UGC Workload Balance Banner */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-200">
              UGC Direct Teaching & Workload Balance
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Cap: {currentFaculty.maxDirectTeachingHours} hrs/week · 40 hrs total workload
          </span>
        </div>

        {/* Workload Breakdown Items */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs">
          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Direct Teaching</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">14 hrs</span>
            <span className="text-[10px] text-emerald-400">Within Limit</span>
          </div>

          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Tutorials</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">2 hrs</span>
            <span className="text-[10px] text-zinc-500">Standard</span>
          </div>

          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Laboratory</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">2 hrs</span>
            <span className="text-[10px] text-zinc-500">Lab 301</span>
          </div>

          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Consultation</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">2 hrs</span>
            <span className="text-[10px] text-zinc-500">Office Hours</span>
          </div>

          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Research & PhD</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">6 hrs</span>
            <span className="text-[10px] text-red-400">Protected</span>
          </div>

          <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 block text-[11px]">Committees</span>
            <span className="text-base font-bold font-mono text-zinc-100 mt-0.5 block">1 hr</span>
            <span className="text-[10px] text-zinc-500">Dept Council</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Routine Matrix & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Routine Matrix */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {/* Day Selector */}
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>Routine: {selectedDay}</span>
              </div>

              <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedDay === d
                        ? 'bg-red-700 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Time Slots */}
            <div className="divide-y divide-zinc-800/80">
              {TIME_SLOTS.map(slot => {
                const isLunch = slot.id === 'ts-5';
                const session = dailySessions.find(s => s.timeSlotId === slot.id);
                const protectedBlock = currentFaculty.preferences.protectedSlots.find(
                  ps => ps.day === selectedDay && ps.periodId === slot.id
                );

                if (isLunch) {
                  return (
                    <div key={slot.id} className="p-3 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-mono">{slot.label}</span>
                      <span>Institutional Lunch Hour</span>
                      <span className="text-[10px] font-mono text-zinc-600">Protected</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot.id}
                    className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors ${
                      session?.status === 'Cancelled'
                        ? 'bg-red-950/20'
                        : protectedBlock
                        ? 'bg-zinc-950/60'
                        : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-zinc-400 w-32 shrink-0">
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>

                    <div className="flex-1">
                      {session ? (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-zinc-100 flex items-center gap-2">
                              <span>{courses.find(c => c.id === session.courseId)?.code}</span>
                              <span>·</span>
                              <span>{sections.find(s => s.id === session.sectionId)?.name}</span>
                              {session.status === 'Cancelled' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60 font-mono">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              {rooms.find(r => r.id === session.roomId)?.name}
                            </div>
                          </div>

                          {session.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                setSessionToCancel(session.id);
                                setShowCancelModal(true);
                              }}
                              className="px-2 py-1 bg-zinc-900 hover:bg-red-950/60 hover:text-red-300 text-zinc-400 border border-zinc-800 hover:border-red-800/50 rounded text-xs transition-colors"
                            >
                              Cancel Class
                            </button>
                          )}
                        </div>
                      ) : protectedBlock ? (
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-medium">
                            Protected Slot: {protectedBlock.reason}
                          </span>
                          <button
                            onClick={() => handleProtectedToggle(slot.id, 'Research')}
                            className="text-[11px] text-zinc-500 hover:text-zinc-300"
                          >
                            Release
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 italic">Free Period</span>
                          <button
                            onClick={() => handleProtectedToggle(slot.id, 'Research')}
                            className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-[11px] border border-zinc-800 transition-colors"
                          >
                            + Protect
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Makeup Proposals & Marketplace */}
        <div className="space-y-4">
          {/* Active Makeup Proposal Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                Makeup Proposal Ready
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div>
              <h4 className="font-semibold text-sm text-zinc-100">
                DBMS Lecture Recovery (CSE-A)
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Cancelled session on Monday. Ideal consensus slot found with 47/52 students free.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Proposed Slot:</span>
                <span className="font-semibold text-emerald-400">96% Match</span>
              </div>
              <div className="font-mono font-medium text-zinc-200">
                Thursday 11:00 – 12:00 (Room 204)
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => scheduleMakeup('rec-opp-01')}
                className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Accept Slot</span>
              </button>

              <button
                onClick={() => declineOpportunity('rec-opp-01')}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg text-xs font-medium border border-zinc-800 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>

          {/* Free-Slot Marketplace */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h4 className="font-semibold text-zinc-200">
                Slot Exchange
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">Voluntary</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-200">CS501 Tutorial (CSE-B)</div>
                  <div className="text-[11px] text-zinc-400">Friday 10–11 · Room 104</div>
                </div>
                <button
                  onClick={() => claimMarketplaceSlot('CS501', 'sec-cse-b', 'Friday', 'ts-3', 'tut-104', 'Tutorial')}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded text-xs font-medium border border-zinc-800"
                >
                  Claim
                </button>
              </div>

              <div className="p-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-200">Project Mentoring (CSE-C)</div>
                  <div className="text-[11px] text-zinc-400">Wednesday 15–16 · Lab 301</div>
                </div>
                <button
                  onClick={() => claimMarketplaceSlot('CS501', 'sec-cse-a', 'Wednesday', 'ts-8', 'lab-301', 'Practical')}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded text-xs font-medium border border-zinc-800"
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-base font-semibold text-zinc-100">Cancel Teaching Session</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enrolled students will be alerted and a pending makeup opportunity will be queued automatically.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Reason for Cancellation</label>
              <input
                type="text"
                placeholder="e.g. Attending AICTE National Review Panel, Medical emergency"
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
