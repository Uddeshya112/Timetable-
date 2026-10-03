import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  BarChart3,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';

export function WorkloadSyllabusView() {
  const { courses, facultyMembers, sessions } = useTimetable();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BarChart3 className="h-4 w-4" />
          <span>Academic Intelligence & Statutory Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Syllabus Progress & Faculty UGC Workload
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Exam-aware syllabus deficit forecasting combined with UGC 2026 faculty workload caps. Prevents burnout while guaranteeing course completion.
        </p>
      </div>

      {/* Syllabus Progress & Risk Breakdown (OCR Page 29, 30, 36) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>Syllabus Completion & Exam Readiness Radar</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Semester Exam in 21 Days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => {
            const faculty = facultyMembers.find(f => f.id === course.primaryFacultyId);
            const remaining = course.totalSemesterHours - course.completedHours;
            const completionPercent = Math.round((course.completedHours / course.totalSemesterHours) * 100);

            // Risk calculation (Section 35, 36)
            let risk: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
            let riskNote = 'On schedule for examination';

            if (course.cancelledHours >= 2) {
              risk = 'RED';
              riskNote = 'Critical deficit: 2 makeups urgently required';
            } else if (course.cancelledHours === 1) {
              risk = 'YELLOW';
              riskNote = 'Recovery recommended within 7 days';
            }

            return (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {course.code}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-0.5">{course.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Lead: {faculty?.name}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      risk === 'RED'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : risk === 'YELLOW'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    Risk: {risk}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Completion</span>
                    <span className="text-white font-bold">{completionPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        risk === 'RED' ? 'bg-rose-500' : risk === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono pt-2 border-t border-slate-800">
                  <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="text-slate-500 block">Required</span>
                    <span className="text-slate-200 font-bold">{course.totalSemesterHours}h</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="text-slate-500 block">Done</span>
                    <span className="text-emerald-400 font-bold">{course.completedHours}h</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="text-slate-500 block">Cancelled</span>
                    <span className="text-rose-400 font-bold">{course.cancelledHours}h</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                    <span className="text-slate-500 block">Remain</span>
                    <span className="text-amber-400 font-bold">{remaining}h</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Info className="h-3 w-3 shrink-0 text-slate-500" />
                  <span>{riskNote}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UGC Faculty Workload Matrix (OCR Page 10, 31, 37) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>UGC 2026 Faculty Direct Teaching Compliance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Professors/Associate: 14 teaching hrs/wk · Assistant Professors: 16 teaching hrs/wk · Overall 40 hrs institutional
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold self-start sm:self-auto">
            100% Institution Compliance
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {facultyMembers.map(faculty => {
            const activeHours = sessions.filter(
              s => s.facultyId === faculty.id && s.status !== 'Cancelled'
            ).length;

            const isOverloaded = activeHours > faculty.maxDirectTeachingHours;

            return (
              <div key={faculty.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="w-64 shrink-0">
                  <div className="font-bold text-white text-sm">{faculty.name}</div>
                  <div className="text-slate-400 text-[11px]">{faculty.designation} · {faculty.email}</div>
                </div>

                {/* Hours Metric Bar */}
                <div className="flex-1 max-w-md space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Direct Teaching Load</span>
                    <span className="text-slate-200 font-bold">
                      {activeHours} / {faculty.maxDirectTeachingHours} hrs
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOverloaded ? 'bg-rose-500' : 'bg-indigo-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((activeHours / faculty.maxDirectTeachingHours) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Research Hours</span>
                    <span className="font-mono text-slate-200 font-semibold">6 hrs (Protected)</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold font-mono ${
                      isOverloaded
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {isOverloaded ? 'Potential Overload' : 'Balanced'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
