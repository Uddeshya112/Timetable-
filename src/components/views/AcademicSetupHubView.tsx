import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  CalendarDays,
  Building2,
  GraduationCap,
  BookOpen,
  UserSquare2,
  DoorOpen,
  Users,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Check,
  Play,
  Eye,
  Upload,
  AlertCircle
} from 'lucide-react';
import { DayOfWeek, SessionType } from '../../types';

export type SetupSubTab =
  | 'overview'
  | 'academic_year'
  | 'departments'
  | 'programs'
  | 'courses'
  | 'faculty'
  | 'rooms'
  | 'sections'
  | 'allocations'
  | 'constraints'
  | 'validation'
  | 'generator'
  | 'review'
  | 'bulk_import';

export function AcademicSetupHubView() {
  const {
    activeView,
    academicYear,
    updateAcademicYear,
    departments,
    addDepartment,
    deleteDepartment,
    toggleDepartmentStatus,
    programs,
    addProgram,
    deleteProgram,
    rooms,
    addRoom,
    deleteRoom,
    toggleRoomAvailability,
    facultyMembers,
    addFaculty,
    deleteFaculty,
    toggleFacultyStatus,
    sections,
    addSection,
    deleteSection,
    courses,
    addCourse,
    deleteCourse,
    allocations,
    addAllocation,
    deleteAllocation,
    constraints,
    toggleConstraint,
    validationReport,
    runValidation,
    generateDraftTimetable,
    publishStatus,
    updatePublishStatus,
    bulkImportData,
    sessions,
    selectedSectionId,
    setSelectedSectionId,
    selectedFacultyId,
    setSelectedFacultyId,
    selectedRoomId,
    setSelectedRoomId,
  } = useTimetable();

  const [activeTab, setActiveTab] = useState<SetupSubTab>('overview');

  React.useEffect(() => {
    if (activeView === 'academic_year') setActiveTab('academic_year');
    else if (activeView === 'departments') setActiveTab('departments');
    else if (activeView === 'courses_mgmt') setActiveTab('courses');
    else if (activeView === 'faculty_mgmt') setActiveTab('faculty');
    else if (activeView === 'rooms_mgmt') setActiveTab('rooms');
    else if (activeView === 'sections_mgmt') setActiveTab('sections');
    else if (activeView === 'allocations') setActiveTab('allocations');
    else if (activeView === 'availability') setActiveTab('constraints');
    else if (activeView === 'academic_setup') setActiveTab('overview');
  }, [activeView]);
  const [courseSearch, setCourseSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [roomFilter, setRoomFilter] = useState<string>('ALL');

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<{
    isSuccess: boolean;
    sessionsGenerated: number;
    conflicts: string[];
    scheduledHours: number;
    totalHours: number;
  } | null>(null);

  // Review View Angle
  const [reviewAngle, setReviewAngle] = useState<'section' | 'faculty' | 'room'>('section');
  const [reviewDay, setReviewDay] = useState<DayOfWeek>('Monday');

  // Form states
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', hodName: '', contactEmail: '', status: 'Active' as const });

  const [showAddProg, setShowAddProg] = useState(false);
  const [progForm, setProgForm] = useState({ name: '', code: '', departmentId: departments[0]?.id || 'dept-cse', durationYears: 4, totalSemesters: 8, status: 'Active' as const });

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    departmentId: departments[0]?.id || 'dept-cse',
    credits: 4,
    requiredLecturesPerWeek: 3,
    requiredTutorialsPerWeek: 1,
    requiredLabsPerWeek: 0,
    totalSemesterHours: 45,
    completedHours: 0,
    cancelledHours: 0,
    requiresLab: false,
    requiredEquipment: ['Smart Projector'],
    primaryFacultyId: facultyMembers[0]?.id || '',
    status: 'Active' as const,
  });

  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    employeeId: '',
    email: '',
    departmentId: departments[0]?.id || 'dept-cse',
    designation: 'Assistant Professor' as const,
    subjectsQualified: [] as string[],
    maxDirectTeachingHours: 14,
    weeklyHoursLimit: 40,
    status: 'Active' as const,
    preferences: {
      preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[],
      preferredPeriods: [1, 2, 3, 4],
      protectedSlots: [],
      maxConsecutivePeriods: 2,
      availableForMakeup: true,
      availableForTutorial: true,
    },
  });

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: '',
    building: 'Turing Block',
    floor: 2,
    capacity: 60,
    type: 'LectureHall' as const,
    equipment: ['Smart Projector', 'Whiteboard'],
    isAvailable: true,
  });

  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    departmentId: departments[0]?.id || 'dept-cse',
    program: 'B.Tech Computer Science & Engineering',
    semester: 5,
    batchYear: 2024,
    studentCount: 50,
    classRepresentative: { name: '', email: '', studentId: '' },
  });

  const [showAddAlloc, setShowAddAlloc] = useState(false);
  const [allocForm, setAllocForm] = useState({
    courseId: courses[0]?.id || '',
    facultyId: facultyMembers[0]?.id || '',
    sectionId: sections[0]?.id || '',
    subSectionId: '',
    sessionType: 'Lecture' as SessionType,
    hoursPerWeek: 3,
    preferredRoomId: rooms[0]?.id || '',
  });

  // Bulk Import
  const [importType, setImportType] = useState<'faculty' | 'courses' | 'rooms' | 'sections' | 'allocations'>('faculty');
  const [importRaw, setImportRaw] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ successCount: number; errors: string[] } | null>(null);

  const totalCoursesAllocated = new Set(allocations.map(a => a.courseId)).size;
  const activeFacultyCount = facultyMembers.filter(f => f.status !== 'Inactive').length;
  const activeCoursesCount = courses.filter(c => c.status !== 'Archived').length;
  const activeRoomsCount = rooms.filter(r => r.isAvailable).length;
  const activeSectionsCount = sections.filter(s => s.status !== 'Inactive').length;

  const handleRunGeneration = () => {
    setIsGenerating(true);
    setGenerationResult(null);
    setTimeout(() => {
      const res = generateDraftTimetable();
      setGenerationResult(res);
      setIsGenerating(false);
      if (res.isSuccess) {
        setActiveTab('review');
      }
    }, 600);
  };

  const handleBulkImport = () => {
    if (!importRaw.trim()) return;
    try {
      let parsed: any[] = [];
      if (importRaw.trim().startsWith('[') || importRaw.trim().startsWith('{')) {
        const json = JSON.parse(importRaw);
        parsed = Array.isArray(json) ? json : [json];
      } else {
        const lines = importRaw.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        parsed = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          return obj;
        });
      }

      const res = bulkImportData(importType, parsed);
      setImportFeedback(res);
      if (res.successCount > 0) setImportRaw('');
    } catch (err: any) {
      setImportFeedback({ successCount: 0, errors: [err?.message || 'Format error'] });
    }
  };

  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Academic Setup
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage academic structure, course catalog, faculty roster, and rooms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Status:</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-semibold text-zinc-200">
            {publishStatus}
          </span>
        </div>
      </div>

      {/* 2. Sub-navigation Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 font-medium">Section:</span>
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 font-medium focus:outline-none focus:border-red-600"
        >
          <option value="overview">Setup Overview</option>
          <option value="academic_year">Academic Year & Slots</option>
          <option value="departments">Departments ({departments.length})</option>
          <option value="programs">Programs ({programs.length})</option>
          <option value="courses">Courses ({courses.length})</option>
          <option value="faculty">Faculty ({facultyMembers.length})</option>
          <option value="rooms">Rooms & Labs ({rooms.length})</option>
          <option value="sections">Sections ({sections.length})</option>
          <option value="allocations">Course Allocation ({allocations.length})</option>
          <option value="constraints">Scheduling Rules ({constraints.filter(c => c.isActive).length})</option>
          <option value="bulk_import">Bulk Import</option>
        </select>
      </div>

      {/* 3. Subtab Content */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md p-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Academic Setup Checklist
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Review current institutional setup prior to timetable generation.
            </p>

            <div className="mt-4 border border-slate-200 dark:border-zinc-800 rounded-md divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
              <div onClick={() => setActiveTab('academic_year')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">Academic year</span>
                  <span className="text-slate-500 dark:text-zinc-400 ml-2">{academicYear.yearLabel} · Semester {academicYear.semesterNumber}</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Complete</span>
              </div>

              <div onClick={() => setActiveTab('departments')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Departments</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{departments.length} departments</span>
              </div>

              <div onClick={() => setActiveTab('programs')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Programs</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{programs.length} programs</span>
              </div>

              <div onClick={() => setActiveTab('courses')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Courses</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{activeCoursesCount} active courses</span>
              </div>

              <div onClick={() => setActiveTab('faculty')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Faculty</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{activeFacultyCount} active members</span>
              </div>

              <div onClick={() => setActiveTab('rooms')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Rooms & labs</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{activeRoomsCount} available rooms</span>
              </div>

              <div onClick={() => setActiveTab('sections')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Sections</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{activeSectionsCount} student sections</span>
              </div>

              <div onClick={() => setActiveTab('allocations')} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-900 dark:text-zinc-100">Course allocations</span>
                <span className={`font-semibold ${totalCoursesAllocated >= activeCoursesCount ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {totalCoursesAllocated} / {activeCoursesCount} allocated
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC YEAR */}
      {activeTab === 'academic_year' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Academic Year & Semester Calendar</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Configure working schedule, teaching period duration, and protected lunch slots</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Academic Year Label</label>
              <input
                type="text"
                value={academicYear.yearLabel}
                onChange={e => updateAcademicYear({ yearLabel: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Semester Type</label>
              <select
                value={academicYear.semesterType}
                onChange={e => updateAcademicYear({ semesterType: e.target.value as any })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-600"
              >
                <option value="Odd (Autumn)">Odd (Autumn)</option>
                <option value="Even (Spring)">Even (Spring)</option>
                <option value="Summer">Summer Term</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Semester Level</label>
              <input
                type="number"
                value={academicYear.semesterNumber}
                onChange={e => updateAcademicYear({ semesterNumber: Number(e.target.value) || 1 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-xs font-semibold text-zinc-300">Active Working Days</label>
            <div className="flex flex-wrap gap-2">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[]).map(day => {
                const isSelected = academicYear.workingDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const next = isSelected
                        ? academicYear.workingDays.filter(d => d !== day)
                        : [...academicYear.workingDays, day];
                      updateAcademicYear({ workingDays: next });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-red-700 text-white font-semibold'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="text-xs font-semibold text-zinc-300">Daily Teaching Periods</label>
            <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              {academicYear.timeSlots.map(slot => (
                <div key={slot.id} className="p-3 bg-zinc-950/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-400 font-semibold w-16">Period {slot.periodNumber}</span>
                    <span className="font-medium text-zinc-200">{slot.label}</span>
                    {slot.isLunch && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Campus Lunch Break
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">{slot.startTime} – {slot.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Academic Departments</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Manage departmental leadership and faculty placement</p>
            </div>
            <button
              onClick={() => setShowAddDept(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {departments.map(dept => (
              <div key={dept.id} className="p-3.5 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100">{dept.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-red-400 border border-zinc-800 font-semibold">
                      {dept.code}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      dept.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    HOD: <span className="text-zinc-200">{dept.hodName}</span> · Contact: <span className="font-mono">{dept.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleDepartmentStatus(dept.id)}
                    className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-[11px]"
                  >
                    {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteDepartment(dept.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddDept && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!deptForm.name || !deptForm.code) return;
                addDepartment(deptForm);
                setShowAddDept(false);
                setDeptForm({ name: '', code: '', hodName: '', contactEmail: '', status: 'Active' });
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Department</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={deptForm.name}
                  onChange={e => setDeptForm(d => ({ ...d, name: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (e.g. CSED)"
                  value={deptForm.code}
                  onChange={e => setDeptForm(d => ({ ...d, code: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="HOD Name"
                  value={deptForm.hodName}
                  onChange={e => setDeptForm(d => ({ ...d, hodName: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={deptForm.contactEmail}
                  onChange={e => setDeptForm(d => ({ ...d, contactEmail: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDept(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Department</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: PROGRAMS */}
      {activeTab === 'programs' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Degree Programs</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Programs offered across academic departments</p>
            </div>
            <button
              onClick={() => setShowAddProg(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Program</span>
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {programs.map(prog => {
              const dept = departments.find(d => d.id === prog.departmentId);
              return (
                <div key={prog.id} className="p-3.5 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-100">{prog.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {prog.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Dept: <span className="text-zinc-200">{dept?.name || prog.departmentId}</span> · Duration: {prog.durationYears} Years
                    </div>
                  </div>
                  <button onClick={() => deleteProgram(prog.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {showAddProg && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!progForm.name || !progForm.code) return;
                addProgram(progForm);
                setShowAddProg(false);
                setProgForm({ name: '', code: '', departmentId: departments[0]?.id || '', durationYears: 4, totalSemesters: 8, status: 'Active' });
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Degree Program</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Program Name"
                  value={progForm.name}
                  onChange={e => setProgForm(p => ({ ...p, name: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (e.g. BTECH-CSE)"
                  value={progForm.code}
                  onChange={e => setProgForm(p => ({ ...p, code: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <select
                  value={progForm.departmentId}
                  onChange={e => setProgForm(p => ({ ...p, departmentId: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Duration (Years)"
                  value={progForm.durationYears}
                  onChange={e => setProgForm(p => ({ ...p, durationYears: Number(e.target.value) || 4 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddProg(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Program</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 5: COURSES */}
      {activeTab === 'courses' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Course & Subject Catalog</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Accredited subjects, lecture/tutorial/lab requirements, and credit hours</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search code / title..."
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none focus:border-red-600 w-44 sm:w-56"
                />
              </div>
              <button
                onClick={() => setShowAddCourse(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {courses
              .filter(c =>
                c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
                c.name.toLowerCase().includes(courseSearch.toLowerCase())
              )
              .map(course => {
                const isAllocated = allocations.some(a => a.courseId === course.id);
                return (
                  <div key={course.id} className="p-3.5 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-400">{course.code}</span>
                        <span className="font-semibold text-zinc-100">{course.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {course.credits} Credits
                        </span>
                        {course.requiresLab && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Lab
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-x-3">
                        <span>L-T-P: <strong className="text-zinc-200 font-mono">{course.requiredLecturesPerWeek}-{course.requiredTutorialsPerWeek}-{course.requiredLabsPerWeek}</strong></span>
                        <span>·</span>
                        <span className={isAllocated ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                          {isAllocated ? 'Allocated' : 'Unallocated'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteCourse(course.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>

          {showAddCourse && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!courseForm.code || !courseForm.name) return;
                addCourse(courseForm);
                setShowAddCourse(false);
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Course Specification</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Code (e.g. CS504)"
                  value={courseForm.code}
                  onChange={e => setCourseForm(c => ({ ...c, code: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="Title (e.g. Machine Learning)"
                  value={courseForm.name}
                  onChange={e => setCourseForm(c => ({ ...c, name: e.target.value }))}
                  className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={courseForm.credits}
                  onChange={e => setCourseForm(c => ({ ...c, credits: Number(e.target.value) || 4 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
                <input
                  type="number"
                  placeholder="Lec / wk"
                  value={courseForm.requiredLecturesPerWeek}
                  onChange={e => setCourseForm(c => ({ ...c, requiredLecturesPerWeek: Number(e.target.value) || 3 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
                <input
                  type="number"
                  placeholder="Lab / wk"
                  value={courseForm.requiredLabsPerWeek}
                  onChange={e => setCourseForm(c => ({ ...c, requiredLabsPerWeek: Number(e.target.value) || 0, requiresLab: Number(e.target.value) > 0 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCourse(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Course</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 6: FACULTY */}
      {activeTab === 'faculty' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Faculty & Instructional Roster</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Manage instructors, designations, and UGC direct workload limits</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={facultySearch}
                  onChange={e => setFacultySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none focus:border-red-600 w-44"
                />
              </div>
              <button
                onClick={() => setShowAddFaculty(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Faculty</span>
              </button>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {facultyMembers
              .filter(f => f.name.toLowerCase().includes(facultySearch.toLowerCase()) || f.email.toLowerCase().includes(facultySearch.toLowerCase()))
              .map(fac => {
                const assignedHours = allocations
                  .filter(a => a.facultyId === fac.id)
                  .reduce((acc, a) => acc + a.hoursPerWeek, 0);

                return (
                  <div key={fac.id} className="p-3.5 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">{fac.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {fac.designation}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          assignedHours > fac.maxDirectTeachingHours
                            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}>
                          Load: {assignedHours}/{fac.maxDirectTeachingHours} hrs/wk
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">{fac.email}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFacultyStatus(fac.id)}
                        className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px]"
                      >
                        {fac.status === 'Active' ? 'On-Leave' : 'Active'}
                      </button>
                      <button onClick={() => deleteFaculty(fac.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {showAddFaculty && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!facultyForm.name || !facultyForm.email) return;
                addFaculty(facultyForm);
                setShowAddFaculty(false);
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Faculty Member</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={facultyForm.name}
                  onChange={e => setFacultyForm(f => ({ ...f, name: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={facultyForm.email}
                  onChange={e => setFacultyForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <select
                  value={facultyForm.designation}
                  onChange={e => setFacultyForm(f => ({ ...f, designation: e.target.value as any }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  <option value="Professor">Professor (14h cap)</option>
                  <option value="Associate Professor">Associate Professor (14h cap)</option>
                  <option value="Assistant Professor">Assistant Professor (16h cap)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddFaculty(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Faculty</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 7: ROOMS */}
      {activeTab === 'rooms' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Physical Rooms & Labs</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Manage lecture halls, computer labs, and capacities</p>
            </div>
            <button
              onClick={() => setShowAddRoom(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rooms.map(room => (
              <div key={room.id} className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-zinc-100 text-xs sm:text-sm">{room.name}</div>
                    <div className="text-[11px] text-zinc-400">{room.building}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-red-400 border border-zinc-800">
                    {room.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
                  <span className="text-zinc-400">Capacity: <strong className="font-mono text-zinc-200">{room.capacity}</strong></span>
                  <button
                    onClick={() => toggleRoomAvailability(room.id)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      room.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {room.isAvailable ? 'Available' : 'Maintenance'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddRoom && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!roomForm.name) return;
                addRoom(roomForm);
                setShowAddRoom(false);
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Physical Facility</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Facility Name (e.g. Lab 304)"
                  value={roomForm.name}
                  onChange={e => setRoomForm(r => ({ ...r, name: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <select
                  value={roomForm.type}
                  onChange={e => setRoomForm(r => ({ ...r, type: e.target.value as any }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  <option value="LectureHall">Lecture Hall</option>
                  <option value="ComputerLab">Computer Lab</option>
                  <option value="HardwareLab">Hardware Lab</option>
                  <option value="TutorialRoom">Tutorial Room</option>
                </select>
                <input
                  type="number"
                  placeholder="Capacity"
                  value={roomForm.capacity}
                  onChange={e => setRoomForm(r => ({ ...r, capacity: Number(e.target.value) || 60 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddRoom(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Facility</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 8: SECTIONS */}
      {activeTab === 'sections' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Cohort Sections</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Registered student cohort sections and strengths</p>
            </div>
            <button
              onClick={() => setShowAddSection(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {sections.map(sec => (
              <div key={sec.id} className="p-3.5 bg-zinc-950/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-zinc-100 text-sm">Section {sec.name}</div>
                  <div className="text-[11px] text-zinc-400">{sec.program} · <strong className="font-mono text-zinc-200">{sec.studentCount} Students</strong></div>
                </div>
                <button onClick={() => deleteSection(sec.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {showAddSection && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!sectionForm.name) return;
                addSection(sectionForm);
                setShowAddSection(false);
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Cohort Section</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Section Name (e.g. CSE-C)"
                  value={sectionForm.name}
                  onChange={e => setSectionForm(s => ({ ...s, name: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
                <input
                  type="number"
                  placeholder="Student Count"
                  value={sectionForm.studentCount}
                  onChange={e => setSectionForm(s => ({ ...s, studentCount: Number(e.target.value) || 50 }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddSection(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Section</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 9: ALLOCATIONS */}
      {activeTab === 'allocations' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Course Allocations</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Assign courses to faculty instructors and cohort sections</p>
            </div>
            <button
              onClick={() => setShowAddAlloc(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Allocation</span>
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {allocations.map(alloc => {
              const course = courses.find(c => c.id === alloc.courseId);
              const faculty = facultyMembers.find(f => f.id === alloc.facultyId);
              const section = sections.find(s => s.id === alloc.sectionId);

              return (
                <div key={alloc.id} className="p-3.5 bg-zinc-950/60 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-400">{course?.code || alloc.courseId}</span>
                      <span className="font-semibold text-zinc-100">{course?.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {alloc.sessionType}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Instructor: <strong className="text-zinc-200">{faculty?.name}</strong> · Section: <strong className="text-zinc-200">{section?.name}</strong> · Weekly: <strong className="text-emerald-400 font-mono">{alloc.hoursPerWeek} hrs/week</strong>
                    </div>
                  </div>
                  <button onClick={() => deleteAllocation(alloc.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {showAddAlloc && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!allocForm.courseId || !allocForm.facultyId || !allocForm.sectionId) return;
                addAllocation(allocForm);
                setShowAddAlloc(false);
              }}
              className="p-4 bg-zinc-950 border border-red-800/40 rounded-xl space-y-3"
            >
              <div className="text-xs font-semibold text-zinc-200">New Allocation</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={allocForm.courseId}
                  onChange={e => setAllocForm(a => ({ ...a, courseId: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>

                <select
                  value={allocForm.facultyId}
                  onChange={e => setAllocForm(a => ({ ...a, facultyId: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  {facultyMembers.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                <select
                  value={allocForm.sectionId}
                  onChange={e => setAllocForm(a => ({ ...a, sectionId: e.target.value }))}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 outline-none focus:border-red-600"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddAlloc(false)} className="px-3 py-1 text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-red-700 text-white rounded-lg text-xs font-semibold">Save Allocation</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 10: CONSTRAINTS */}
      {activeTab === 'constraints' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Timetabling Constraints</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Active constraint rules enforced by the scheduling solver</p>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {constraints.map(item => (
              <div key={item.id} className="p-3.5 bg-zinc-950/60 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-100">{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.type === 'Hard' ? 'bg-red-500/10 text-red-300 border border-red-500/20 font-bold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.description}</p>
                </div>
                <button
                  onClick={() => toggleConstraint(item.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 ${
                    item.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: VALIDATION */}
      {activeTab === 'validation' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Pre-Generation Validation Report</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Automated readiness checks across all entities and constraint rules</p>
            </div>
            <button onClick={() => runValidation()} className="px-3 py-1.5 bg-zinc-800 text-zinc-200 text-xs rounded-lg">
              Re-Verify
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-400 font-medium">Passed Checks</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">{validationReport.passedCount}</div>
            </div>
            <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-400 font-medium">Warnings</span>
              <div className="text-2xl font-bold font-mono text-amber-400">{validationReport.warningCount}</div>
            </div>
            <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-400 font-medium">Blocking Errors</span>
              <div className="text-2xl font-bold font-mono text-red-400">{validationReport.errorCount}</div>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {validationReport.items.map(item => (
              <div key={item.id} className="p-3.5 bg-zinc-950/60 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="pt-0.5 shrink-0">
                    {item.status === 'Passed' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {item.status === 'Warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                    {item.status === 'Error' && <AlertCircle className="h-4 w-4 text-red-400" />}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-100">{item.title}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{item.message}</p>
                  </div>
                </div>
                {item.fixTab && item.status !== 'Passed' && (
                  <button
                    onClick={() => setActiveTab(item.fixTab as SetupSubTab)}
                    className="px-2.5 py-1 rounded bg-zinc-900 text-red-400 border border-zinc-800 text-[11px] font-medium"
                  >
                    Fix Issue →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: GENERATOR */}
      {activeTab === 'generator' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Schedule Solver & Generation Pipeline</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Executes constraint-satisfaction mapping on your real configured academic entities</p>
          </div>

          <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Pre-Flight Readiness</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                validationReport.isReadyForGeneration
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {validationReport.isReadyForGeneration ? 'Ready for Solver' : 'Errors Detected'}
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Processing <strong className="text-zinc-200">{allocations.length} allocations</strong> across <strong className="text-zinc-200">{sections.length} sections</strong> and <strong className="text-zinc-200">{rooms.length} facilities</strong> over <strong className="text-zinc-200">{academicYear.workingDays.length} working days</strong>.
            </p>

            <button
              onClick={handleRunGeneration}
              disabled={isGenerating || !validationReport.isReadyForGeneration}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                validationReport.isReadyForGeneration
                  ? 'bg-red-700 hover:bg-red-600 text-white cursor-pointer active:scale-[0.99]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Computing Optimal Schedule Assignments...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Generate Draft Master Timetable</span>
                </>
              )}
            </button>
          </div>

          {generationResult && (
            <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in ${
              generationResult.isSuccess ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-red-950/20 border-red-800/40'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {generationResult.isSuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                <span className={generationResult.isSuccess ? 'text-emerald-300' : 'text-red-300'}>
                  {generationResult.isSuccess
                    ? `Generated ${generationResult.sessionsGenerated} class sessions (${generationResult.scheduledHours} weekly hours) successfully!`
                    : 'Generation encountered blocking constraint violations.'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 13: REVIEW & PUBLISH */}
      {activeTab === 'review' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Timetable Review & Publish</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Inspect schedule matrices across Sections, Faculty, and Facilities</p>
            </div>

            <div className="flex items-center gap-2">
              {publishStatus === 'Draft' && (
                <button
                  onClick={() => updatePublishStatus('Review', 'Coordinator Submission')}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-200 rounded-lg text-xs font-medium"
                >
                  Submit for Approval
                </button>
              )}

              {publishStatus === 'Review' && (
                <button
                  onClick={() => updatePublishStatus('Approved', 'Dean Academic Affairs')}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Approve Schedule
                </button>
              )}

              {publishStatus === 'Approved' && (
                <button
                  onClick={() => updatePublishStatus('Published', 'Institutional Release')}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Publish to Campus
                </button>
              )}

              {publishStatus === 'Published' && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <Check className="h-3 w-3" /> Published & Live
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setReviewAngle('section')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  reviewAngle === 'section' ? 'bg-red-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                By Section
              </button>
              <button
                onClick={() => setReviewAngle('faculty')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  reviewAngle === 'faculty' ? 'bg-red-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                By Faculty
              </button>
              <button
                onClick={() => setReviewAngle('room')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  reviewAngle === 'room' ? 'bg-red-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                By Room/Lab
              </button>
            </div>

            {reviewAngle === 'section' && (
              <select
                value={selectedSectionId}
                onChange={e => setSelectedSectionId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-3 py-1.5 text-zinc-200 outline-none"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>Section: {s.name} ({s.studentCount} Students)</option>
                ))}
              </select>
            )}

            {reviewAngle === 'faculty' && (
              <select
                value={selectedFacultyId}
                onChange={e => setSelectedFacultyId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-3 py-1.5 text-zinc-200 outline-none"
              >
                {facultyMembers.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            )}

            {reviewAngle === 'room' && (
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-3 py-1.5 text-zinc-200 outline-none"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl text-xs gap-1">
            {daysList.map(d => (
              <button
                key={d}
                onClick={() => setReviewDay(d)}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium ${
                  reviewDay === d ? 'bg-red-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
            {academicYear.timeSlots.map(slot => {
              if (slot.isLunch) {
                return (
                  <div key={slot.id} className="p-3 bg-zinc-950/40 flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>{slot.label}</span>
                    <span>Campus Lunch Break</span>
                    <span>Protected</span>
                  </div>
                );
              }

              let matchingSession = sessions.find(s => {
                if (s.day !== reviewDay || s.timeSlotId !== slot.id) return false;
                if (reviewAngle === 'section') return s.sectionId === selectedSectionId;
                if (reviewAngle === 'faculty') return s.facultyId === selectedFacultyId;
                if (reviewAngle === 'room') return s.roomId === selectedRoomId;
                return false;
              });

              const course = matchingSession ? courses.find(c => c.id === matchingSession?.courseId) : null;
              const faculty = matchingSession ? facultyMembers.find(f => f.id === matchingSession?.facultyId) : null;
              const room = matchingSession ? rooms.find(r => r.id === matchingSession?.roomId) : null;

              return (
                <div key={slot.id} className="p-3 bg-zinc-950/60 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400 w-28 shrink-0">{slot.label}</span>
                  {matchingSession ? (
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-100">{course?.name || matchingSession.courseId}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-red-400 border border-zinc-800">
                            {course?.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {reviewAngle !== 'faculty' && <span>{faculty?.name} · </span>}
                          {reviewAngle !== 'room' && <span>{room?.name}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {matchingSession.type}
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic">Free Slot</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 14: BULK IMPORT */}
      {activeTab === 'bulk_import' && (
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Structured Bulk Import</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Import Faculty, Courses, Rooms, or Sections via CSV or JSON</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['faculty', 'courses', 'rooms', 'sections', 'allocations'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setImportType(type);
                  setImportFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  importType === type ? 'bg-red-700 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <textarea
              rows={6}
              value={importRaw}
              onChange={e => setImportRaw(e.target.value)}
              placeholder={
                importType === 'faculty'
                  ? 'name, email, designation\nDr. Maya Sengupta, maya.s@thapar.edu, Associate Professor'
                  : 'Paste JSON array or CSV records'
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 outline-none focus:border-red-600"
            />
          </div>

          <button
            onClick={handleBulkImport}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            Validate & Commit Import
          </button>

          {importFeedback && (
            <div className={`p-4 rounded-xl border space-y-1 text-xs ${
              importFeedback.errors.length === 0 ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
            }`}>
              <div className="font-bold">Imported {importFeedback.successCount} record(s).</div>
              {importFeedback.errors.map((err, i) => (
                <div key={i} className="text-red-300 font-mono text-[11px]">• {err}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
