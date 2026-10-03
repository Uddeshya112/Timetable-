import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { TIME_SLOTS } from '../../lib/initialData';
import { DayOfWeek } from '../../types';
import {
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Vote,
  ThumbsUp,
  FileQuestion,
  Send,
  Plus,
  Building,
  UserCheck
} from 'lucide-react';

export function CRPortalView() {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    sessions,
    courses,
    facultyMembers,
    rooms,
    polls,
    votePoll,
    requestStudentMakeup,
  } = useTimetable();

  const currentSection = sections.find(s => s.id === selectedSectionId) || sections[0];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [makeupRequested, setMakeupRequested] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [newPollCourse, setNewPollCourse] = useState('CS501');
  const [newPollProposedSlot, setNewPollProposedSlot] = useState('Thursday 11:00 – 12:00');
  const [pollCreatedSuccess, setPollCreatedSuccess] = useState(false);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const sectionSessions = sessions.filter(
    s => s.sectionId === currentSection.id && s.day === selectedDay
  );

  const activePoll = polls[0];

  const handleRequest = () => {
    requestStudentMakeup('CS501', currentSection.id);
    setMakeupRequested(true);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    setPollCreatedSuccess(true);
    setTimeout(() => {
      setShowPollModal(false);
      setPollCreatedSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
            <Users className="h-3.5 w-3.5" />
            <span>Class Representative (CR) Coordination Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Section {currentSection.name} · CR Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentSection.program} · Semester {currentSection.semester} · {currentSection.studentCount} Registered Cohort Members
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPollModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Consensus Poll</span>
          </button>

          <button
            onClick={handleRequest}
            disabled={makeupRequested}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{makeupRequested ? 'Petition Submitted (47/52)' : 'Submit Makeup Petition'}</span>
          </button>
        </div>
      </div>

      {/* Cohort Stats & Disruption Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400 font-medium">Cohort Size</div>
          <div className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">
            {currentSection.studentCount} Students
          </div>
          <div className="text-[11px] text-zinc-400">Section {currentSection.name} Registered</div>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400 font-medium">Class Attendance Quorum</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            90.4%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Consensus Quorum Valid
          </div>
        </div>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-xs text-zinc-400 font-medium">Pending Syllabus Makeups</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            1
          </div>
          <div className="text-[11px] text-zinc-400">DBMS (CS501) Replacement Ready</div>
        </div>
      </div>

      {/* CR Active Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Section Daily Schedule */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {/* Day Switcher */}
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>Section Schedule: {selectedDay}</span>
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

            {/* Schedule Items */}
            <div className="divide-y divide-zinc-800/80">
              {TIME_SLOTS.map(slot => {
                const isLunch = slot.id === 'ts-5';
                const session = sectionSessions.find(s => s.timeSlotId === slot.id);

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
                        : session?.type === 'Makeup'
                        ? 'bg-emerald-950/20'
                        : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-zinc-400 w-32 shrink-0">
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>

                    <div className="flex-1">
                      {session ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-zinc-100 flex items-center gap-2">
                              <span>{courses.find(c => c.id === session.courseId)?.code}</span>
                              <span>·</span>
                              <span>{courses.find(c => c.id === session.courseId)?.name}</span>
                              {session.status === 'Cancelled' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60 font-mono">
                                  Cancelled
                                </span>
                              )}
                              {session.type === 'Makeup' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
                                  Makeup
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                              <span>{facultyMembers.find(f => f.id === session.facultyId)?.name}</span>
                              <span>·</span>
                              <span>{rooms.find(r => r.id === session.roomId)?.name}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Free Period (Eligible for Makeup Slot)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: CR Consensus & Makeup Poll */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="h-4 w-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-200">
                  Active Consensus Poll
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active</span>
            </div>

            {activePoll && (
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-3 text-xs">
                <div>
                  <div className="font-semibold text-zinc-200">
                    {courses.find(c => c.id === activePoll.courseId)?.code} Makeup Slot Consensus
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {activePoll.question}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Student Quorum ({activePoll.votedStudentsCount}/{currentSection.studentCount} Voted):</span>
                    <span className="font-mono text-zinc-200 font-semibold">
                      {activePoll.options.length} Proposed Slots
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {activePoll.options.map(opt => {
                      const totalVotes = activePoll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                      const percentage = Math.round((opt.votes / totalVotes) * 100);
                      const isSelected = activePoll.userVotedOptionId === opt.id;
                      return (
                        <div key={opt.id} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-300 font-medium">{opt.timeSlotLabel} {opt.isSystemRecommended && <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-800/50 ml-1">Recommended</span>}</span>
                            <span className="text-zinc-400 font-mono">{opt.votes} votes ({percentage}%)</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <button
                            onClick={() => votePoll(activePoll.id, opt.id)}
                            disabled={activePoll.userHasVoted}
                            className={`w-full mt-1 py-1 rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 disabled:opacity-50'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{isSelected ? 'Your Vote' : 'Vote This Slot'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CR Guidelines Note */}
          <div className="p-3.5 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-1.5 text-xs text-zinc-400">
            <div className="font-medium text-zinc-300 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-red-400" />
              <span>CR Delegation Protocol</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              When 75% or more students vote in favor of a slot, the petition is forwarded directly to the Timetable Coordinator for formal room lock-in.
            </p>
          </div>
        </div>
      </div>

      {/* New Poll Modal */}
      {showPollModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-base font-semibold text-zinc-100">Launch New Section Consensus Poll</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Propose a replacement slot to your cohort to measure availability consensus.
            </p>

            <form onSubmit={handleCreatePoll} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Course</label>
                <select
                  value={newPollCourse}
                  onChange={e => setNewPollCourse(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-red-600"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.code}>{c.code} – {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Proposed Day & Time</label>
                <input
                  type="text"
                  value={newPollProposedSlot}
                  onChange={e => setNewPollProposedSlot(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-red-600"
                  placeholder="e.g. Friday 10:00 – 11:00"
                />
              </div>

              {pollCreatedSuccess && (
                <div className="text-emerald-400 text-xs font-medium py-1">
                  Poll launched successfully to Section {currentSection.name}!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
