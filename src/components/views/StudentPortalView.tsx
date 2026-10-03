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
  Building
} from 'lucide-react';

export function StudentPortalView() {
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

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const sectionSessions = sessions.filter(
    s => s.sectionId === currentSection.id && s.day === selectedDay
  );

  const activePoll = polls[0];

  const handleRequest = () => {
    requestStudentMakeup('CS501', currentSection.id);
    setMakeupRequested(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Section {currentSection.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentSection.program} · Semester {currentSection.semester} · Class Rep: {currentSection.classRepresentative.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSectionId}
            onChange={e => setSelectedSectionId(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-red-600 font-medium"
          >
            {sections.map(s => (
              <option key={s.id} value={s.id}>
                Section: {s.name} ({s.studentCount} Students)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Disruption Alert Notice */}
      <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 border border-red-800/60 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-zinc-100 text-xs sm:text-sm">
                Monday 08:00 – 09:00: DBMS Lecture Cancelled
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-medium border border-zinc-800">
                Free Slot (08:00 – 09:00)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Instructor attending accreditation symposium. CR consensus requested for replacement slot.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={handleRequest}
            disabled={makeupRequested}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              makeupRequested
                ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white'
            }`}
          >
            {makeupRequested ? 'Makeup Petition Submitted (47/52)' : 'CR: Request Makeup Session'}
          </button>
        </div>
      </div>

      {/* Main Grid: Student Daily Timetable & Polling Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Daily Timetable */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {/* Day Switcher */}
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>Schedule: {selectedDay}</span>
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

            {/* Timetable Items */}
            <div className="divide-y divide-zinc-800/80">
              {TIME_SLOTS.map(slot => {
                const isLunch = slot.id === 'ts-5';
                const session = sectionSessions.find(s => s.timeSlotId === slot.id);

                if (isLunch) {
                  return (
                    <div key={slot.id} className="p-3 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-mono">{slot.label}</span>
                      <span>Lunch Break & Campus Hours</span>
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
                      ) : (
                        <span className="text-zinc-500 italic">No scheduled class (Free Period)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Consensus Poll */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Vote className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">
              CR Slot Consensus
            </h2>
          </div>

          {activePoll && (
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-3 text-xs">
              <div>
                <div className="font-semibold text-zinc-200">
                  {courses.find(c => c.id === activePoll.courseId)?.code} Makeup Slot
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {activePoll.question}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Student Acceptance:</span>
                  <span className="font-mono text-zinc-200 font-semibold">
                    {activePoll.votedStudentsCount} responses
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
                          <span>{isSelected ? 'Your Selection' : 'Vote Slot'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
