import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ChevronRight } from 'lucide-react';

export function CoordinatorView() {
  const {
    academicYear,
    courses,
    facultyMembers,
    rooms,
    allocations,
    publishStatus,
    validationReport,
    auditLogs,
    setActiveView,
  } = useTimetable();

  // Data calculations
  const activeFaculty = facultyMembers.filter(f => f.status !== 'Inactive');
  const activeCourses = courses.filter(c => c.status !== 'Archived');
  const activeRooms = rooms.filter(r => r.isAvailable);

  const allocatedCourseIds = new Set(allocations.map(a => a.courseId));
  const allocationsPendingCount = Math.max(0, activeCourses.length - allocatedCourseIds.size);

  const facultyWithPrefsCount = activeFaculty.filter(f => f.preferences && f.preferences.protectedSlots && f.preferences.protectedSlots.length > 0).length;
  const facultyPendingCount = activeFaculty.length - facultyWithPrefsCount;

  const roomsMissingCapacity = activeRooms.filter(r => !r.capacity || r.capacity <= 0).length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Good morning, Dr. K. N. Murthy · Academic year {academicYear.yearLabel} ({academicYear.semesterNumber === 1 ? 'Odd' : 'Even'} Semester)
          </p>
        </div>
      </div>

      {/* Main Two-Column Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3 width on desktop): Current Timetable + Quick Access List */}
        <div className="lg:col-span-2 space-y-5">
          {/* Current Timetable Summary Block */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Current Timetable
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                Academic Year {academicYear.yearLabel} · {academicYear.semesterNumber === 1 ? 'Odd' : 'Even'} Semester
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-3">
                <span>Status: <strong className="text-slate-700 dark:text-zinc-200">{publishStatus}</strong></span>
                <span>·</span>
                <span>Last updated: Today, 11:42 AM</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('grid')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-medium text-xs rounded transition-colors self-start sm:self-auto"
            >
              View Timetable
            </button>
          </div>

          {/* Quick Access List */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Quick Access
            </h2>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md divide-y divide-slate-100 dark:divide-zinc-800/80">
              {/* Row 1: Academic Setup */}
              <div
                onClick={() => setActiveView('academic_setup')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    Academic Setup
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Manage academic year, departments, programs, courses, faculty, rooms, and sections
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-2" />
              </div>

              {/* Row 2: Course Allocation */}
              <div
                onClick={() => setActiveView('allocations')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    Course Allocation
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Assign courses to faculty instructors and student sections
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-2" />
              </div>

              {/* Row 3: Faculty Availability */}
              <div
                onClick={() => setActiveView('availability')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    Faculty Availability
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Set available and unavailable periods for teaching staff
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-2" />
              </div>

              {/* Row 4: Generate Timetable */}
              <div
                onClick={() => setActiveView('generation_validator')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    Generate Timetable
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Create a timetable from the current academic setup
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-2" />
              </div>

              {/* Row 5: Review Timetable */}
              <div
                onClick={() => setActiveView('grid')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    Review Timetable
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Check section schedules, faculty routines, and room bookings
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Needs Attention */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Needs Attention
          </h2>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
            {/* Course allocations */}
            <div
              onClick={() => setActiveView('allocations')}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-zinc-100">Course allocation</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {allocationsPendingCount === 0 ? 'All courses assigned' : `${allocationsPendingCount} course(s) pending`}
                </div>
              </div>
              <span className={`text-[11px] font-semibold ${allocationsPendingCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {allocationsPendingCount === 0 ? 'Complete' : `${allocationsPendingCount} pending`}
              </span>
            </div>

            {/* Faculty availability */}
            <div
              onClick={() => setActiveView('availability')}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-zinc-100">Faculty availability</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {facultyPendingCount === 0 ? 'All preferences set' : `${facultyPendingCount} pending preferences`}
                </div>
              </div>
              <span className={`text-[11px] font-semibold ${facultyPendingCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {facultyPendingCount === 0 ? 'Complete' : `${facultyPendingCount} pending`}
              </span>
            </div>

            {/* Rooms & labs */}
            <div
              onClick={() => setActiveView('rooms_mgmt')}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-zinc-100">Rooms & labs</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {roomsMissingCapacity === 0 ? 'All rooms configured' : `${roomsMissingCapacity} missing capacity`}
                </div>
              </div>
              <span className={`text-[11px] font-semibold ${roomsMissingCapacity === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {roomsMissingCapacity === 0 ? 'Complete' : `${roomsMissingCapacity} pending`}
              </span>
            </div>

            {/* Conflicts */}
            <div
              onClick={() => setActiveView('generation_validator')}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-zinc-100">Conflicts</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {validationReport.errorCount === 0 ? '0 unresolved conflicts' : `${validationReport.errorCount} unresolved errors`}
                </div>
              </div>
              <span className={`text-[11px] font-semibold ${validationReport.errorCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {validationReport.errorCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Recent Activity
        </h2>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-3 text-xs space-y-2">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-100 dark:border-zinc-800/60 last:border-0">
              <div className="text-slate-800 dark:text-zinc-200">
                <span className="font-semibold">{log.userName}:</span> {log.details}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
