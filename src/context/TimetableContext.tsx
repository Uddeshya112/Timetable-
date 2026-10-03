import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  ClassSession,
  Room,
  Faculty,
  StudentSection,
  SubSection,
  Course,
  CourseAllocation,
  AcademicConstraint,
  AcademicYearConfig,
  Department,
  Program,
  ValidationReport,
  TimetablePublishStatus,
  MakeupTask,
  RecoveryOpportunity,
  StudentPoll,
  NotificationItem,
  AuditLog,
  SystemHealthMetrics,
  TimetableVersion,
  DayOfWeek,
  TimeSlot,
  WhatIfSimulation
} from '../types';
import {
  ROOMS,
  FACULTY_MEMBERS,
  SECTIONS,
  COURSES,
  DEPARTMENTS,
  PROGRAMS,
  INITIAL_ACADEMIC_YEAR,
  INITIAL_ALLOCATIONS,
  INITIAL_CONSTRAINTS,
  INITIAL_SESSIONS,
  INITIAL_MAKEUP_TASKS,
  INITIAL_RECOVERY_OPPORTUNITIES,
  INITIAL_POLLS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VERSIONS,
  INITIAL_WHAT_IF_SIMULATION
} from '../lib/initialData';
import {
  calculateHealthScore,
  findSelfHealingRecoverySlots,
  checkHardConstraints
} from '../lib/recoveryEngine';
import {
  validateAcademicSetup,
  generateTimetableFromConfiguration
} from '../lib/timetableGenerator';

export type UserRole = 'Coordinator' | 'Faculty' | 'Student' | 'HOD' | 'Admin';
export type ViewTab =
  | 'overview'
  | 'academic_setup'
  | 'academic_year'
  | 'departments'
  | 'programs'
  | 'courses_mgmt'
  | 'faculty_mgmt'
  | 'rooms_mgmt'
  | 'sections_mgmt'
  | 'allocations'
  | 'availability'
  | 'constraints'
  | 'generation_validator'
  | 'timetable_review'
  | 'grid'
  | 'recovery'
  | 'whatif'
  | 'solvers'
  | 'syllabus'
  | 'faculty_portal'
  | 'student_portal'
  | 'governance'
  | 'auth_gov';

interface TimetableContextType {
  // Master data
  academicYear: AcademicYearConfig;
  departments: Department[];
  programs: Program[];
  rooms: Room[];
  facultyMembers: Faculty[];
  sections: StudentSection[];
  courses: Course[];
  allocations: CourseAllocation[];
  constraints: AcademicConstraint[];
  publishStatus: TimetablePublishStatus;
  validationReport: ValidationReport;

  // Dynamic schedule state
  sessions: ClassSession[];
  setSessions: React.Dispatch<React.SetStateAction<ClassSession[]>>;
  makeupTasks: MakeupTask[];
  recoveryOpportunities: RecoveryOpportunity[];
  polls: StudentPoll[];
  notifications: NotificationItem[];
  versions: TimetableVersion[];
  auditLogs: AuditLog[];
  health: SystemHealthMetrics;
  whatIfSimulation: WhatIfSimulation;

  // View state
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: ViewTab;
  setActiveView: (view: ViewTab) => void;
  selectedFacultyId: string;
  setSelectedFacultyId: (id: string) => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  selectedRoomId: string;
  setSelectedRoomId: (id: string) => void;

  // Master Data CRUD Actions
  updateAcademicYear: (updates: Partial<AcademicYearConfig>) => void;
  
  // Departments
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  toggleDepartmentStatus: (id: string) => void;

  // Programs
  addProgram: (prog: Omit<Program, 'id'>) => void;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;

  // Rooms & Labs
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  toggleRoomAvailability: (id: string) => void;

  // Faculty
  addFaculty: (fac: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, updates: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;
  toggleFacultyStatus: (id: string) => void;
  updateFacultyAvailability: (id: string, preferences: Faculty['preferences']) => void;

  // Sections & SubSections
  addSection: (sec: Omit<StudentSection, 'id'>) => void;
  updateSection: (id: string, updates: Partial<StudentSection>) => void;
  deleteSection: (id: string) => void;
  addSubSection: (sectionId: string, subSec: Omit<SubSection, 'id' | 'sectionId'>) => void;
  deleteSubSection: (sectionId: string, subSecId: string) => void;

  // Courses
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;

  // Allocations
  addAllocation: (alloc: Omit<CourseAllocation, 'id' | 'status'>) => void;
  updateAllocation: (id: string, updates: Partial<CourseAllocation>) => void;
  deleteAllocation: (id: string) => void;

  // Constraints
  addConstraint: (constraint: Omit<AcademicConstraint, 'id'>) => void;
  updateConstraint: (id: string, updates: Partial<AcademicConstraint>) => void;
  toggleConstraint: (id: string) => void;

  // Validation & Generation Engine
  runValidation: () => ValidationReport;
  generateDraftTimetable: () => {
    isSuccess: boolean;
    sessionsGenerated: number;
    conflicts: string[];
    scheduledHours: number;
    totalHours: number;
  };
  updatePublishStatus: (status: TimetablePublishStatus, reviewerName?: string) => void;
  bulkImportData: (type: 'faculty' | 'courses' | 'rooms' | 'sections' | 'allocations', records: any[]) => { successCount: number; errors: string[] };

  // Routine Timetable Operations
  cancelSession: (sessionId: string, reason: string) => void;
  scheduleMakeup: (opportunityId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  toggleSessionLock: (sessionId: string, reason?: string) => void;
  setFacultyProtectedSlot: (facultyId: string, day: DayOfWeek, periodId: string, reason: 'Research' | 'Lunch' | 'Personal' | 'Department' | 'Meeting') => void;
  restoreVersion: (versionNumber: number) => void;
  applySimulation: () => void;
  markNotificationRead: (id: string) => void;
  triggerAutoMatchAll: () => void;
  requestStudentMakeup: (courseId: string, sectionId: string) => void;
  declineOpportunity: (opportunityId: string) => void;
  claimMarketplaceSlot: (courseId: string, sectionId: string, day: DayOfWeek, timeSlotId: string, roomId: string, type: string) => void;
  requestSubstituteCover: (substituteFacultyId: string, courseId: string, sectionId: string, day: DayOfWeek, timeSlotId: string) => void;
  addSession: (sessionData: Omit<ClassSession, 'id' | 'version'>) => { isSuccess: boolean; error?: string };
}

const TimetableContext = createContext<TimetableContextType | null>(null);

export function TimetableProvider({ children }: { children: React.ReactNode }) {
  // Master academic state
  const [academicYear, setAcademicYear] = useState<AcademicYearConfig>(INITIAL_ACADEMIC_YEAR);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS);
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>(FACULTY_MEMBERS);
  const [sections, setSections] = useState<StudentSection[]>(SECTIONS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [allocations, setAllocations] = useState<CourseAllocation[]>(INITIAL_ALLOCATIONS);
  const [constraints, setConstraints] = useState<AcademicConstraint[]>(INITIAL_CONSTRAINTS);
  const [publishStatus, setPublishStatus] = useState<TimetablePublishStatus>('Published');

  // Dynamic operational state
  const [sessions, setSessions] = useState<ClassSession[]>(INITIAL_SESSIONS);
  const [makeupTasks, setMakeupTasks] = useState<MakeupTask[]>(INITIAL_MAKEUP_TASKS);
  const [recoveryOpportunities, setRecoveryOpportunities] = useState<RecoveryOpportunity[]>(INITIAL_RECOVERY_OPPORTUNITIES);
  const [polls, setPolls] = useState<StudentPoll[]>(INITIAL_POLLS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [versions, setVersions] = useState<TimetableVersion[]>(INITIAL_VERSIONS);
  const [whatIfSimulation, setWhatIfSimulation] = useState<WhatIfSimulation>(INITIAL_WHAT_IF_SIMULATION);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-10-02 08:00:12',
      userId: 'user-sharma',
      userName: 'Prof. Arvind Sharma',
      action: 'CLASS_CANCELLED',
      entityType: 'ClassSession',
      entityId: 'sess-mon-1',
      details: 'Cancelled DBMS lecture for CSE-A on Monday 08:00 due to accreditation symposium.',
    },
    {
      id: 'log-2',
      timestamp: '2026-10-02 08:00:15',
      userId: 'sys-recovery-engine',
      userName: 'Recovery Engine Outbox',
      action: 'MAKEUP_TASK_CREATED',
      entityType: 'MakeupTask',
      entityId: 'makeup-dbms-01',
      details: 'Calculated urgency score 96 (Exam in 21 days, syllabus completion 82%).',
    },
    {
      id: 'log-3',
      timestamp: '2026-10-02 08:05:30',
      userId: 'sys-recovery-engine',
      userName: 'Cross-Cancellation Engine',
      action: 'RECOVERY_OPPORTUNITY_FOUND',
      entityType: 'RecoveryOpportunity',
      entityId: 'rec-opp-01',
      details: 'Identified zero-conflict slot on Thursday 11:00-12:00 in Room 204 created by Dr. Gupta OS cancellation.',
    }
  ]);

  const [currentRole, setCurrentRole] = useState<UserRole>('Coordinator');
  const [activeView, setActiveView] = useState<ViewTab>('overview');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac-sharma');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-cse-a');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-204');

  // Dynamic Computed Validation Report
  const validationReport = useMemo(() => {
    return validateAcademicSetup(
      academicYear,
      departments,
      programs,
      courses,
      facultyMembers,
      rooms,
      sections,
      allocations,
      constraints
    );
  }, [academicYear, departments, programs, courses, facultyMembers, rooms, sections, allocations, constraints]);

  // Computed Health Score
  const health = useMemo(() => {
    return calculateHealthScore(sessions, rooms, facultyMembers, sections, courses);
  }, [sessions, rooms, facultyMembers, sections, courses]);

  // CRUD: Academic Year
  const updateAcademicYear = (updates: Partial<AcademicYearConfig>) => {
    setAcademicYear(prev => ({ ...prev, ...updates }));
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'coordinator',
        userName: 'Timetable Coordinator',
        action: 'ACADEMIC_YEAR_CONFIG_UPDATED',
        entityType: 'AcademicYearConfig',
        entityId: academicYear.id,
        details: 'Updated semester calendar and working period parameters.',
      },
      ...prev,
    ]);
  };

  // CRUD: Departments
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now().toString().slice(-4)}`,
    };
    setDepartments(prev => [...prev, newDept]);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const toggleDepartmentStatus = (id: string) => {
    setDepartments(prev =>
      prev.map(d => (d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d))
    );
  };

  // CRUD: Programs
  const addProgram = (prog: Omit<Program, 'id'>) => {
    const newProg: Program = {
      ...prog,
      id: `prog-${Date.now().toString().slice(-4)}`,
    };
    setPrograms(prev => [...prev, newProg]);
  };

  const updateProgram = (id: string, updates: Partial<Program>) => {
    setPrograms(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  // CRUD: Rooms & Labs
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now().toString().slice(-4)}`,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const toggleRoomAvailability = (id: string) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, isAvailable: !r.isAvailable } : r)));
  };

  // CRUD: Faculty
  const addFaculty = (fac: Omit<Faculty, 'id'>) => {
    const newFac: Faculty = {
      ...fac,
      id: `fac-${Date.now().toString().slice(-4)}`,
    };
    setFacultyMembers(prev => [...prev, newFac]);
  };

  const updateFaculty = (id: string, updates: Partial<Faculty>) => {
    setFacultyMembers(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFaculty = (id: string) => {
    setFacultyMembers(prev => prev.filter(f => f.id !== id));
  };

  const toggleFacultyStatus = (id: string) => {
    setFacultyMembers(prev =>
      prev.map(f => {
        if (f.id !== id) return f;
        const nextStatus = f.status === 'Active' ? 'Inactive' : 'Active';
        return { ...f, status: nextStatus };
      })
    );
  };

  const updateFacultyAvailability = (id: string, preferences: Faculty['preferences']) => {
    setFacultyMembers(prev => prev.map(f => (f.id === id ? { ...f, preferences } : f)));
  };

  // CRUD: Sections
  const addSection = (sec: Omit<StudentSection, 'id'>) => {
    const newSec: StudentSection = {
      ...sec,
      id: `sec-${Date.now().toString().slice(-4)}`,
      subSections: sec.subSections || [
        { id: `sub-1`, sectionId: `sec-${Date.now().toString().slice(-4)}`, name: 'Group 1', studentCount: Math.ceil(sec.studentCount / 2) },
        { id: `sub-2`, sectionId: `sec-${Date.now().toString().slice(-4)}`, name: 'Group 2', studentCount: Math.floor(sec.studentCount / 2) },
      ],
    };
    setSections(prev => [...prev, newSec]);
  };

  const updateSection = (id: string, updates: Partial<StudentSection>) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const addSubSection = (sectionId: string, subSec: Omit<SubSection, 'id' | 'sectionId'>) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId) return s;
        const newSub: SubSection = {
          ...subSec,
          id: `sub-${Date.now().toString().slice(-4)}`,
          sectionId,
        };
        return {
          ...s,
          subSections: [...(s.subSections || []), newSub],
        };
      })
    );
  };

  const deleteSubSection = (sectionId: string, subSecId: string) => {
    setSections(prev =>
      prev.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subSections: (s.subSections || []).filter(sub => sub.id !== subSecId),
        };
      })
    );
  };

  // CRUD: Courses
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: course.code,
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const toggleCourseStatus = (id: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Archived' : 'Active' } : c))
    );
  };

  // CRUD: Course Allocations
  const addAllocation = (alloc: Omit<CourseAllocation, 'id' | 'status'>) => {
    const newAlloc: CourseAllocation = {
      ...alloc,
      id: `alloc-${Date.now().toString().slice(-4)}`,
      status: 'Allocated',
    };
    setAllocations(prev => [...prev, newAlloc]);
  };

  const updateAllocation = (id: string, updates: Partial<CourseAllocation>) => {
    setAllocations(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  // CRUD: Constraints
  const addConstraint = (constraint: Omit<AcademicConstraint, 'id'>) => {
    const newConst: AcademicConstraint = {
      ...constraint,
      id: `const-${Date.now().toString().slice(-4)}`,
    };
    setConstraints(prev => [...prev, newConst]);
  };

  const updateConstraint = (id: string, updates: Partial<AcademicConstraint>) => {
    setConstraints(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const toggleConstraint = (id: string) => {
    setConstraints(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  // Pre-generation Validation Run
  const runValidation = (): ValidationReport => {
    return validateAcademicSetup(
      academicYear,
      departments,
      programs,
      courses,
      facultyMembers,
      rooms,
      sections,
      allocations,
      constraints
    );
  };

  // Timetable Generator Pipeline
  const generateDraftTimetable = () => {
    const report = runValidation();
    if (!report.isReadyForGeneration) {
      return {
        isSuccess: false,
        sessionsGenerated: 0,
        conflicts: report.items.filter(i => i.status === 'Error').map(i => i.message),
        scheduledHours: 0,
        totalHours: 0,
      };
    }

    const result = generateTimetableFromConfiguration(
      academicYear,
      allocations,
      facultyMembers,
      rooms,
      sections,
      courses,
      constraints
    );

    if (result.sessions.length > 0) {
      setSessions(result.sessions);
      setPublishStatus('Draft');

      const newVersionNumber = versions.length + 1;
      const newVersion: TimetableVersion = {
        versionNumber: newVersionNumber,
        versionLabel: `Draft V${newVersionNumber}.0`,
        createdAt: new Date().toISOString(),
        createdBy: 'Dr. K. N. Murthy (Coordinator)',
        changeSummary: `Generated timetable from ${allocations.length} academic allocations across ${sections.length} sections.`,
        reason: 'Automated Schedule Generation Run',
        isPublished: false,
        healthScore: 98,
        sessions: result.sessions,
      };

      setVersions(prev => [newVersion, ...prev]);

      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          userId: 'coordinator',
          userName: 'Timetable Coordinator',
          action: 'TIMETABLE_GENERATED',
          entityType: 'TimetableVersion',
          entityId: `draft-v${newVersionNumber}`,
          details: `Generated ${result.sessions.length} class periods (${result.scheduledHours} weekly hours) for ${sections.length} sections.`,
        },
        ...prev,
      ]);
    }

    return {
      isSuccess: result.sessions.length > 0,
      sessionsGenerated: result.sessions.length,
      conflicts: result.conflicts,
      scheduledHours: result.scheduledHours,
      totalHours: result.totalRequestedHours,
    };
  };

  // Publish Status Lifecycle
  const updatePublishStatus = (status: TimetablePublishStatus, reviewerName?: string) => {
    setPublishStatus(status);
    setAcademicYear(prev => ({
      ...prev,
      publishStatus: status,
      approvedBy: status === 'Approved' || status === 'Published' ? reviewerName || 'Dean Academic Affairs' : prev.approvedBy,
      approvedAt: status === 'Approved' ? new Date().toISOString() : prev.approvedAt,
      publishedAt: status === 'Published' ? new Date().toISOString() : prev.publishedAt,
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'coordinator',
        userName: 'Timetable Coordinator',
        action: `TIMETABLE_STATUS_${status.toUpperCase()}`,
        entityType: 'TimetablePublishStatus',
        entityId: academicYear.id,
        details: `Updated schedule lifecycle state to ${status}.`,
      },
      ...prev,
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system_alert',
        title: `Master Schedule ${status}`,
        message: `Academic Year ${academicYear.yearLabel} semester ${academicYear.semesterNumber} schedule is now ${status}.`,
        timestamp: 'Just now',
        read: false,
        category: status === 'Published' ? 'Success' : 'Info',
      },
      ...prev,
    ]);
  };

  // Bulk Import Helper
  const bulkImportData = (
    type: 'faculty' | 'courses' | 'rooms' | 'sections' | 'allocations',
    records: any[]
  ) => {
    const errors: string[] = [];
    let successCount = 0;

    if (!Array.isArray(records) || records.length === 0) {
      return { successCount: 0, errors: ['No data records supplied for import.'] };
    }

    try {
      if (type === 'faculty') {
        const validated: Faculty[] = [];
        records.forEach((r, idx) => {
          if (!r.name || !r.email) {
            errors.push(`Row ${idx + 1}: Faculty Name and Email are required.`);
          } else {
            validated.push({
              id: r.id || `fac-${Date.now()}-${idx}`,
              name: String(r.name).trim(),
              email: String(r.email).trim().toLowerCase(),
              departmentId: r.departmentId || 'dept-cse',
              designation: r.designation || 'Assistant Professor',
              subjectsQualified: Array.isArray(r.subjectsQualified) ? r.subjectsQualified : ['CS501'],
              maxDirectTeachingHours: Number(r.maxDirectTeachingHours) || 14,
              weeklyHoursLimit: 40,
              status: 'Active',
              preferences: {
                preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                preferredPeriods: [1, 2, 3, 4],
                protectedSlots: [],
                maxConsecutivePeriods: 2,
                availableForMakeup: true,
                availableForTutorial: true,
              },
            });
            successCount++;
          }
        });
        if (validated.length > 0) {
          setFacultyMembers(prev => [...prev, ...validated]);
        }
      } else if (type === 'courses') {
        const validated: Course[] = [];
        records.forEach((r, idx) => {
          if (!r.code || !r.name) {
            errors.push(`Row ${idx + 1}: Course Code and Course Name are required.`);
          } else {
            validated.push({
              id: String(r.code).trim(),
              code: String(r.code).trim(),
              name: String(r.name).trim(),
              departmentId: r.departmentId || 'dept-cse',
              credits: Number(r.credits) || 4,
              requiredLecturesPerWeek: Number(r.requiredLecturesPerWeek) || 3,
              requiredTutorialsPerWeek: Number(r.requiredTutorialsPerWeek) || 0,
              requiredLabsPerWeek: Number(r.requiredLabsPerWeek) || 0,
              totalSemesterHours: 45,
              completedHours: 0,
              cancelledHours: 0,
              requiresLab: Boolean(r.requiresLab || r.requiredLabsPerWeek > 0),
              requiredEquipment: Array.isArray(r.requiredEquipment) ? r.requiredEquipment : ['Smart Projector'],
              primaryFacultyId: r.primaryFacultyId || 'fac-sharma',
              status: 'Active',
            });
            successCount++;
          }
        });
        if (validated.length > 0) {
          setCourses(prev => [...prev, ...validated]);
        }
      } else if (type === 'rooms') {
        const validated: Room[] = [];
        records.forEach((r, idx) => {
          if (!r.name || !r.capacity) {
            errors.push(`Row ${idx + 1}: Room Name and Capacity are required.`);
          } else {
            validated.push({
              id: r.id || `room-${Date.now()}-${idx}`,
              name: String(r.name).trim(),
              building: r.building || 'Turing Block',
              floor: Number(r.floor) || 1,
              capacity: Number(r.capacity) || 60,
              type: r.type || 'LectureHall',
              equipment: Array.isArray(r.equipment) ? r.equipment : ['Projector', 'Whiteboard'],
              isAvailable: true,
            });
            successCount++;
          }
        });
        if (validated.length > 0) {
          setRooms(prev => [...prev, ...validated]);
        }
      } else if (type === 'sections') {
        const validated: StudentSection[] = [];
        records.forEach((r, idx) => {
          if (!r.name || !r.studentCount) {
            errors.push(`Row ${idx + 1}: Section Name and Student Count are required.`);
          } else {
            const secId = r.id || `sec-${Date.now()}-${idx}`;
            validated.push({
              id: secId,
              name: String(r.name).trim(),
              departmentId: r.departmentId || 'dept-cse',
              program: r.program || 'B.Tech Computer Science & Engineering',
              semester: Number(r.semester) || 5,
              batchYear: 2024,
              studentCount: Number(r.studentCount) || 50,
              subSections: [
                { id: `sub-${secId}-1`, sectionId: secId, name: 'Group 1', studentCount: Math.ceil(Number(r.studentCount) / 2) },
                { id: `sub-${secId}-2`, sectionId: secId, name: 'Group 2', studentCount: Math.floor(Number(r.studentCount) / 2) },
              ],
              classRepresentative: {
                name: r.crName || 'Section Representative',
                email: r.crEmail || 'cr@student.thapar.edu',
                studentId: r.crRoll || '2024BCSE001',
              },
              status: 'Active',
            });
            successCount++;
          }
        });
        if (validated.length > 0) {
          setSections(prev => [...prev, ...validated]);
        }
      } else if (type === 'allocations') {
        const validated: CourseAllocation[] = [];
        records.forEach((r, idx) => {
          if (!r.courseId || !r.facultyId || !r.sectionId) {
            errors.push(`Row ${idx + 1}: Course, Faculty, and Section are required for allocation.`);
          } else {
            validated.push({
              id: `alloc-${Date.now()}-${idx}`,
              courseId: r.courseId,
              facultyId: r.facultyId,
              sectionId: r.sectionId,
              subSectionId: r.subSectionId,
              sessionType: r.sessionType || 'Lecture',
              hoursPerWeek: Number(r.hoursPerWeek) || 3,
              preferredRoomId: r.preferredRoomId,
              status: 'Allocated',
            });
            successCount++;
          }
        });
        if (validated.length > 0) {
          setAllocations(prev => [...prev, ...validated]);
        }
      }
    } catch (err: any) {
      errors.push(`Import exception: ${err?.message || 'Failed parsing records.'}`);
    }

    return { successCount, errors };
  };

  // Cancel Session & Trigger Self-Healing Pipeline
  const cancelSession = (sessionId: string, reason: string) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (!targetSession) return;

    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              status: 'Cancelled',
              cancellationReason: reason,
              cancellationTimestamp: new Date().toISOString(),
            }
          : s
      )
    );

    const newTaskId = `makeup-${Date.now()}`;
    const newMakeupTask: MakeupTask = {
      id: newTaskId,
      cancelledSessionId: sessionId,
      courseId: targetSession.courseId,
      sectionId: targetSession.sectionId,
      facultyId: targetSession.facultyId,
      cancelledDay: targetSession.day,
      cancelledTimeSlot: targetSession.timeSlotId,
      priorityScore: 95,
      status: 'ProposalsGenerated',
      createdAt: new Date().toISOString(),
    };

    setMakeupTasks(prev => [newMakeupTask, ...prev]);

    const discoveredOpps = findSelfHealingRecoverySlots(
      newMakeupTask,
      sessions,
      rooms,
      facultyMembers,
      sections,
      courses
    );

    if (discoveredOpps.length > 0) {
      setRecoveryOpportunities(prev => [...discoveredOpps, ...prev]);
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'cancellation',
        title: `Class Disruption: ${targetSession.courseId}`,
        message: `${targetSession.day} session was cancelled. Reason: ${reason}. Self-healing engine generated replacement slot proposals.`,
        timestamp: 'Just now',
        read: false,
        category: 'Critical',
        actionable: true,
      },
      ...prev,
    ]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'faculty-member',
        userName: 'Faculty Instructor',
        action: 'CLASS_CANCELLED',
        entityType: 'ClassSession',
        entityId: sessionId,
        details: `Cancelled ${targetSession.courseId} (${targetSession.day} ${targetSession.timeSlotId}). Reason: ${reason}.`,
      },
      ...prev,
    ]);
  };

  const scheduleMakeup = (opportunityId: string) => {
    const opp = recoveryOpportunities.find(o => o.id === opportunityId);
    if (!opp) return;

    const makeupTask = makeupTasks.find(t => t.id === opp.makeupTaskId);
    if (!makeupTask) return;

    const newSessionId = `makeup-sess-${Date.now().toString().slice(-4)}`;
    const newSession: ClassSession = {
      id: newSessionId,
      courseId: makeupTask.courseId,
      facultyId: opp.facultyId,
      sectionId: makeupTask.sectionId,
      roomId: opp.roomId,
      day: opp.targetDay,
      timeSlotId: opp.timeSlotId,
      type: 'Makeup',
      status: 'Confirmed',
      originalSessionId: makeupTask.cancelledSessionId,
      version: 1,
    };

    setSessions(prev => [...prev, newSession]);

    setMakeupTasks(prev =>
      prev.map(t => (t.id === makeupTask.id ? { ...t, status: 'Scheduled' } : t))
    );

    setRecoveryOpportunities(prev =>
      prev.map(o => (o.id === opportunityId ? { ...o, status: 'Approved' } : o))
    );

    const roomObj = rooms.find(r => r.id === opp.roomId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'makeup_request',
        title: `Makeup Scheduled: ${makeupTask.courseId}`,
        message: `Recovery class locked for ${opp.targetDay} in ${roomObj?.name || opp.roomId}. Students and Faculty notified.`,
        timestamp: 'Just now',
        read: false,
        category: 'Success',
      },
      ...prev,
    ]);
  };

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev =>
      prev.map(p => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          votedStudentsCount: p.votedStudentsCount + 1,
          userHasVoted: true,
          userVotedOptionId: optionId,
          options: p.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      })
    );
  };

  const toggleSessionLock = (sessionId: string, reason = 'Administrative Lock') => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const nextLock = !s.isLocked;
        return {
          ...s,
          isLocked: nextLock,
          lockReason: nextLock ? reason : undefined,
        };
      })
    );
  };

  const setFacultyProtectedSlot = (
    facultyId: string,
    day: DayOfWeek,
    periodId: string,
    reason: 'Research' | 'Lunch' | 'Personal' | 'Department' | 'Meeting'
  ) => {
    setFacultyMembers(prev =>
      prev.map(f => {
        if (f.id !== facultyId) return f;
        const exists = f.preferences.protectedSlots.some(
          ps => ps.day === day && ps.periodId === periodId
        );
        const nextSlots = exists
          ? f.preferences.protectedSlots.filter(ps => !(ps.day === day && ps.periodId === periodId))
          : [...f.preferences.protectedSlots, { day, periodId, reason }];
        return {
          ...f,
          preferences: {
            ...f.preferences,
            protectedSlots: nextSlots,
          },
        };
      })
    );
  };

  const restoreVersion = (versionNumber: number) => {
    const ver = versions.find(v => v.versionNumber === versionNumber);
    if (!ver) return;
    setSessions(ver.sessions);
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'coordinator',
        userName: 'Timetable Coordinator',
        action: 'VERSION_RESTORED',
        entityType: 'TimetableVersion',
        entityId: `v-${versionNumber}`,
        details: `Restored timetable matrix to ${ver.versionLabel}.`,
      },
      ...prev,
    ]);
  };

  const applySimulation = () => {
    if (!whatIfSimulation) return;
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system_alert',
        title: `Simulation Applied: ${whatIfSimulation.title}`,
        message: 'Sandbox contingency measures applied to candidate staging branch.',
        timestamp: 'Just now',
        read: false,
        category: 'Warning',
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const triggerAutoMatchAll = () => {
    let matched = 0;
    recoveryOpportunities.forEach(opp => {
      if (opp.matchScore >= 90 && opp.status === 'Proposed') {
        scheduleMakeup(opp.id);
        matched++;
      }
    });
    if (matched > 0) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'makeup_request',
          title: 'Automated Recovery Batch Complete',
          message: `Self-healing solver matched and scheduled ${matched} makeup slot(s) with zero constraint conflicts.`,
          timestamp: 'Just now',
          read: false,
          category: 'Success',
        },
        ...prev,
      ]);
    }
  };

  const declineOpportunity = (opportunityId: string) => {
    setRecoveryOpportunities(prev =>
      prev.map(o => (o.id === opportunityId ? { ...o, status: 'Rejected' } : o))
    );
  };

  const claimMarketplaceSlot = (
    courseId: string,
    sectionId: string,
    day: DayOfWeek,
    timeSlotId: string,
    roomId: string,
    type: string
  ) => {
    const newSessionId = `claim-sess-${Date.now().toString().slice(-4)}`;
    const newSession: ClassSession = {
      id: newSessionId,
      courseId,
      facultyId: selectedFacultyId,
      sectionId,
      roomId,
      day,
      timeSlotId,
      type: type as any || 'Lecture',
      status: 'Confirmed',
      version: 1,
    };
    setSessions(prev => [...prev, newSession]);
  };

  const requestSubstituteCover = (
    substituteFacultyId: string,
    courseId: string,
    sectionId: string,
    day: DayOfWeek,
    timeSlotId: string
  ) => {
    const substitute = facultyMembers.find(f => f.id === substituteFacultyId);
    const course = courses.find(c => c.id === courseId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'makeup_request',
        title: `Substitute Cover Requested (${course?.code || courseId})`,
        message: `Requested ${substitute?.name || 'Faculty Member'} to cover ${day} slot for ${sectionId}.`,
        timestamp: 'Just now',
        read: false,
        category: 'Info',
      },
      ...prev,
    ]);
  };

  const requestStudentMakeup = (courseId: string, sectionId: string) => {
    const course = courses.find(c => c.id === courseId);
    const section = sections.find(s => s.id === sectionId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'makeup_request',
        title: `Student Demand: Makeup Request (${course?.code || courseId})`,
        message: `${section?.name} Class Representative launched makeup petition. 47/52 students signed availability.`,
        timestamp: 'Just now',
        read: false,
        category: 'Info',
        actionable: true,
      },
      ...prev,
    ]);
  };

  const addSession = (sessionData: Omit<ClassSession, 'id' | 'version'>): { isSuccess: boolean; error?: string } => {
    const check = checkHardConstraints(
      sessionData,
      sessions,
      rooms,
      facultyMembers,
      sections,
      courses
    );

    if (!check.isFeasible) {
      return { isSuccess: false, error: check.violations.join(' | ') };
    }

    const newId = `sess-${sessionData.day.slice(0, 3).toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newSession: ClassSession = {
      ...sessionData,
      id: newId,
      version: 1,
    };

    setSessions(prev => [...prev, newSession]);
    return { isSuccess: true };
  };

  return (
    <TimetableContext.Provider
      value={{
        academicYear,
        departments,
        programs,
        rooms,
        facultyMembers,
        sections,
        courses,
        allocations,
        constraints,
        publishStatus,
        validationReport,
        sessions,
        setSessions,
        makeupTasks,
        recoveryOpportunities,
        polls,
        notifications,
        versions,
        auditLogs,
        health,
        whatIfSimulation,
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        selectedFacultyId,
        setSelectedFacultyId,
        selectedSectionId,
        setSelectedSectionId,
        selectedRoomId,
        setSelectedRoomId,
        updateAcademicYear,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        toggleDepartmentStatus,
        addProgram,
        updateProgram,
        deleteProgram,
        addRoom,
        updateRoom,
        deleteRoom,
        toggleRoomAvailability,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        toggleFacultyStatus,
        updateFacultyAvailability,
        addSection,
        updateSection,
        deleteSection,
        addSubSection,
        deleteSubSection,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
        addAllocation,
        updateAllocation,
        deleteAllocation,
        addConstraint,
        updateConstraint,
        toggleConstraint,
        runValidation,
        generateDraftTimetable,
        updatePublishStatus,
        bulkImportData,
        cancelSession,
        scheduleMakeup,
        votePoll,
        toggleSessionLock,
        setFacultyProtectedSlot,
        restoreVersion,
        applySimulation,
        markNotificationRead,
        triggerAutoMatchAll,
        requestStudentMakeup,
        declineOpportunity,
        claimMarketplaceSlot,
        requestSubstituteCover,
        addSession,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
}
