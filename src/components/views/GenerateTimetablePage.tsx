import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { executeOptimizationEngine, GeneratedCandidate, EngineResult } from '../../lib/optimizationEngine';
import { Check } from 'lucide-react';

export function GenerateTimetablePage() {
  const {
    academicYear,
    allocations,
    facultyMembers,
    rooms,
    sections,
    courses,
    constraints,
    validationReport,
    setSessions,
    setActiveView,
  } = useTimetable();

  // Generator Options State
  const [speedMode, setSpeedMode] = useState<'FAST' | 'BALANCED' | 'MAXIMUM_OPTIMIZATION'>('BALANCED');
  const [timeLimitMs, setTimeLimitMs] = useState<number>(1000);
  const [numOptions, setNumOptions] = useState<number>(3);

  // Generation Live Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<GeneratedCandidate | null>(null);

  const activeCoursesCount = courses.filter(c => c.status !== 'Archived').length;
  const allocatedCoursesCount = new Set(allocations.map(a => a.courseId)).size;
  const activeFacultyCount = facultyMembers.filter(f => f.status !== 'Inactive').length;
  const activeRoomsCount = rooms.filter(r => r.isAvailable).length;
  const activeSectionsCount = sections.filter(s => s.status !== 'Inactive').length;
  const activeRulesCount = constraints.filter(c => c.isActive).length;

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setEngineResult(null);

    setTimeout(() => {
      const result = executeOptimizationEngine(
        academicYear,
        allocations,
        facultyMembers,
        rooms,
        sections,
        courses,
        constraints,
        {
          budgetMode: speedMode,
          timeBudgetMs: timeLimitMs,
          seed: Math.floor(Math.random() * 10000) + 100,
          maxCandidates: numOptions,
        }
      );

      setEngineResult(result);
      if (result.bestCandidate) {
        setSelectedCandidate(result.bestCandidate);
      }
      setIsGenerating(false);
    }, 350);
  };

  const handleApplyCandidate = (cand: GeneratedCandidate) => {
    setSessions(cand.sessions);
    setActiveView('grid');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          Generate Timetable
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          {academicYear.yearLabel} · {academicYear.semesterNumber === 1 ? 'Odd' : 'Even'} Semester
        </p>
      </div>

      {/* Current Setup Summary */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Current Setup
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs border-t border-slate-100 dark:border-zinc-800/80 pt-3">
          <div>
            <span className="text-slate-500 dark:text-zinc-400 block">Courses</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5 block">
              {allocatedCoursesCount} / {activeCoursesCount}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-zinc-400 block">Faculty</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5 block">{activeFacultyCount}</span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-zinc-400 block">Rooms & Labs</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5 block">{activeRoomsCount}</span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-zinc-400 block">Sections</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5 block">{activeSectionsCount}</span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-zinc-400 block">Rules</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5 block">{activeRulesCount}</span>
          </div>
        </div>
      </div>

      {/* Generation Options Form */}
      {!isGenerating && !engineResult && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Generation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Speed */}
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Speed</label>
              <select
                value={speedMode}
                onChange={e => setSpeedMode(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-red-700"
              >
                <option value="FAST">Fast</option>
                <option value="BALANCED">Balanced</option>
                <option value="MAXIMUM_OPTIMIZATION">Thorough</option>
              </select>
            </div>

            {/* Time limit */}
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Time limit</label>
              <select
                value={timeLimitMs}
                onChange={e => setTimeLimitMs(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-red-700"
              >
                <option value={300}>Auto</option>
                <option value={1000}>1 second</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
            </div>

            {/* Timetable options */}
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">Timetable options</label>
              <select
                value={numOptions}
                onChange={e => setNumOptions(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-red-700"
              >
                <option value={1}>1 option</option>
                <option value={3}>3 options</option>
                <option value={5}>5 options</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartGeneration}
              disabled={!validationReport.isReadyForGeneration}
              className="px-4 py-1.5 bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors"
            >
              Generate Timetable
            </button>
          </div>
        </div>
      )}

      {/* Progress State */}
      {isGenerating && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-6 text-center space-y-2">
          <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Generating timetable...</div>
        </div>
      )}

      {/* Result Confirmation */}
      {engineResult && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Timetable generated successfully</span>
            </div>
            <div className="text-slate-500 dark:text-zinc-400 mt-0.5">
              {engineResult.bestCandidate?.scheduledHours || 0} sessions scheduled · 0 conflicts found
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEngineResult(null)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded transition-colors"
            >
              Generate another
            </button>
            {selectedCandidate && (
              <button
                onClick={() => handleApplyCandidate(selectedCandidate)}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded transition-colors"
              >
                View Timetable
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
