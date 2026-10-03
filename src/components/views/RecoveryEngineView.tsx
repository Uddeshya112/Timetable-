import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Repeat,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  UserCheck,
  Building,
  Clock,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { findSubstituteFaculty } from '../../lib/recoveryEngine';

export function RecoveryEngineView() {
  const {
    makeupTasks,
    recoveryOpportunities,
    courses,
    facultyMembers,
    sections,
    rooms,
    sessions,
    scheduleMakeup,
    requestSubstituteCover,
  } = useTimetable();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(makeupTasks[0]?.id || '');
  const [substituteCourseId, setSubstituteCourseId] = useState<string>('CS501');
  const [requestedSubs, setRequestedSubs] = useState<Record<string, boolean>>({});

  const activeTask = makeupTasks.find(t => t.id === selectedTaskId) || makeupTasks[0];
  const opportunities = recoveryOpportunities.filter(o => o.makeupTaskId === activeTask?.id);

  // Substitute faculty calculation (Section 32)
  const substitutes = findSubstituteFaculty(
    substituteCourseId,
    'Monday',
    'ts-1',
    facultyMembers,
    sessions
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Operational Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <RotateCcw className="h-4 w-4" />
          <span>Dynamic Rescheduling & Makeup Routing</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Automated Recovery & Cross-Cancellation Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          When class cancellations occur, the recovery engine detects open slot vacancies and pairs them with pending syllabus makeups, ensuring zero teacher-student-room constraint collisions.
        </p>
      </div>

      {/* Interactive Cross-Cancellation Flow Diagram (OCR Page 24, 25) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Repeat className="h-4 w-4 text-indigo-400" />
            Cross-Cancellation Matching Mechanism in Action
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active Multi-Agent State
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Node 1: Disruption A */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 font-semibold block">STEP 1: DISRUPTION A</span>
            <div className="font-bold text-sm text-white">Monday 08:00</div>
            <div className="text-xs text-rose-300">Prof. Sharma cancels DBMS for CSE-A.</div>
            <div className="text-[11px] text-slate-400 pt-1 font-mono">Makeup Task Created (Priority 96)</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 2: Disruption B */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-semibold block">STEP 2: DISRUPTION B</span>
            <div className="font-bold text-sm text-white">Thursday 11:00</div>
            <div className="text-xs text-amber-300">Dr. Gupta cancels OS for CSE-A.</div>
            <div className="text-[11px] text-slate-400 pt-1 font-mono">CSE-A Students become FREE</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 3: Synthesis */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1 md:col-span-4 lg:col-span-1">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold block">STEP 3: AUTONOMOUS MATCH</span>
            <div className="font-bold text-sm text-white">Thursday 11-12</div>
            <div className="text-xs text-emerald-300">
              CSE-A free + Prof. Sharma free + Room 204 free.
            </div>
            <div className="text-[11px] font-bold text-emerald-400 pt-1 font-mono">
              Match Score: 96%
            </div>
          </div>
        </div>
      </div>

      {/* Main Recovery Workspace: Queue Selection & Ranked Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Task Selector */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Makeups Queue
            </h3>
            <div className="space-y-2">
              {makeupTasks.map(task => {
                const c = courses.find(cr => cr.id === task.courseId);
                const s = sections.find(sc => sc.id === task.sectionId);
                const isSelected = task.id === activeTask?.id;

                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{c?.code} ({s?.name})</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        P: {task.priorityScore}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Cancelled on {task.cancelledDay} ({task.cancelledTimeSlot})
                    </div>
                    <div className="text-[10px] text-indigo-400 mt-1 font-medium">
                      Status: {task.status}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recovery Compatibility Formula (Section 26, 59) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold border-b border-slate-800 pb-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Matching Formula Weights</span>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Teacher Availability (w₁)</span>
                <span className="text-slate-200">30%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Student Availability (w₂)</span>
                <span className="text-slate-200">25%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Room Suitability (w₃)</span>
                <span className="text-slate-200">15%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Syllabus Urgency (w₄)</span>
                <span className="text-slate-200">15%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Teacher Preference (w₅)</span>
                <span className="text-slate-200">10%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Schedule Stability (w₆)</span>
                <span className="text-slate-200">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Ranked Candidate Recovery Slots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Ranked Recovery Windows for {courses.find(c => c.id === activeTask?.courseId)?.code}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ordered by multi-objective constraint score. All proposed slots guarantee 0 hard collisions.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400">
                {opportunities.length} Slots Generated
              </span>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp, idx) => {
                const room = rooms.find(r => r.id === opp.roomId);
                const faculty = facultyMembers.find(f => f.id === opp.facultyId);

                return (
                  <div
                    key={opp.id}
                    className={`p-4 rounded-xl border transition-all ${
                      idx === 0
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">
                          {opp.targetDay} {opp.timeSlotId === 'ts-4' ? '11:00 - 12:00' : opp.timeSlotId === 'ts-7' ? '14:00 - 15:00' : '10:00 - 11:00'}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                            Top Recommendation
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {opp.matchScore}%
                          </span>
                          <span className="block text-[10px] text-slate-400">Compatibility</span>
                        </div>

                        <button
                          onClick={() => scheduleMakeup(opp.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
                        >
                          Approve & Schedule
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {opp.rationale}
                    </p>

                    {/* Factor Matrix breakdown */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Teacher</span>
                        <span className="text-slate-200 font-bold">{opp.factors.teacherAvailability}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Students</span>
                        <span className="text-slate-200 font-bold">{opp.factors.studentAvailability}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Room</span>
                        <span className="text-slate-200 font-bold">{opp.factors.roomSuitability}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Syllabus</span>
                        <span className="text-slate-200 font-bold">{opp.factors.syllabusUrgency}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Pref</span>
                        <span className="text-slate-200 font-bold">{opp.factors.preferenceScore}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-500 block">Stability</span>
                        <span className="text-slate-200 font-bold">{opp.factors.stabilityImpact}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Substitute Faculty Engine (OCR Section 32) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-400" />
                  Substitute Faculty Engine
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When primary faculty is unavailable, identifies qualified peer instructors with compliant UGC workload limits
                </p>
              </div>

              <select
                value={substituteCourseId}
                onChange={e => setSubstituteCourseId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {substitutes.map(({ faculty, isAvailable, compatibilityScore, currentLoad, maxLoad }) => (
                <div
                  key={faculty.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">{faculty.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {faculty.designation} · Teaching Load: {currentLoad}/{maxLoad} hrs (UGC Norm)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400 tabular-nums">
                        {compatibilityScore}%
                      </div>
                      <div className="text-[10px] text-slate-500">Compatibility</div>
                    </div>

                    <button
                      disabled={!isAvailable || requestedSubs[faculty.id]}
                      onClick={() => {
                        requestSubstituteCover(faculty.id, substituteCourseId, 'sec-cse-a', 'Monday', 'ts-1');
                        setRequestedSubs(prev => ({ ...prev, [faculty.id]: true }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        requestedSubs[faculty.id]
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : isAvailable
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      {requestedSubs[faculty.id]
                        ? 'Cover Dispatched'
                        : isAvailable
                        ? 'Request Cover'
                        : 'Schedule Colliding'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
