import React, { useState, useEffect } from 'react';
import { useTimetable, ViewTab } from '../context/TimetableContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  X,
  User,
  Sun,
  Moon,
  Settings
} from 'lucide-react';

interface SidebarProps {
  onOpenProfile?: () => void;
  onShowLoginPage?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  onOpenProfile,
  onShowLoginPage,
  isOpen = false,
  onClose,
}: SidebarProps = {}) {
  const { activeView, setActiveView } = useTimetable();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isSetupActive = ['academic_year', 'departments', 'courses_mgmt', 'faculty_mgmt', 'rooms_mgmt', 'sections_mgmt', 'academic_setup'].includes(activeView);
  const isTimetableActive = ['allocations', 'availability', 'generation_validator', 'grid'].includes(activeView);
  const isReviewActive = ['governance', 'recovery'].includes(activeView);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    setup: isSetupActive,
    timetable: isTimetableActive,
    review: isReviewActive,
  });

  useEffect(() => {
    setExpandedGroups(prev => ({
      ...prev,
      setup: isSetupActive || prev.setup,
      timetable: isTimetableActive || prev.timetable,
      review: isReviewActive || prev.review,
    }));
  }, [activeView]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (view: ViewTab) => {
    setActiveView(view);
    if (onClose) onClose();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/80 text-slate-700 dark:text-zinc-300 w-60 select-none text-xs font-medium">
      {/* Brand Header */}
      <div className="p-3 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-700 dark:bg-red-800 flex items-center justify-center text-white font-bold text-xs">
            TI
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100 leading-none">
              Thapar Institute
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
              Coordinator
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2.5">
        {/* Dashboard */}
        <div>
          <button
            onClick={() => handleSelect('overview')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              activeView === 'overview'
                ? 'bg-red-700 text-white font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Academic Setup Group */}
        <div className="space-y-0.5">
          <button
            onClick={() => toggleGroup('setup')}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <span>Academic Setup</span>
            {expandedGroups.setup ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>

          {expandedGroups.setup && (
            <div className="pl-2.5 space-y-0.5 border-l border-slate-200 dark:border-zinc-800 ml-1.5">
              <button
                onClick={() => handleSelect('academic_year')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'academic_year'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Academic Year
              </button>

              <button
                onClick={() => handleSelect('departments')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'departments'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Departments
              </button>

              <button
                onClick={() => handleSelect('departments')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'programs'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Programs
              </button>

              <button
                onClick={() => handleSelect('courses_mgmt')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'courses_mgmt'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Courses
              </button>

              <button
                onClick={() => handleSelect('faculty_mgmt')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'faculty_mgmt'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Faculty
              </button>

              <button
                onClick={() => handleSelect('rooms_mgmt')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'rooms_mgmt'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Rooms & Labs
              </button>

              <button
                onClick={() => handleSelect('sections_mgmt')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'sections_mgmt'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Sections
              </button>
            </div>
          )}
        </div>

        {/* Timetable Group */}
        <div className="space-y-0.5">
          <button
            onClick={() => toggleGroup('timetable')}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <span>Timetable</span>
            {expandedGroups.timetable ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>

          {expandedGroups.timetable && (
            <div className="pl-2.5 space-y-0.5 border-l border-slate-200 dark:border-zinc-800 ml-1.5">
              <button
                onClick={() => handleSelect('allocations')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'allocations'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Course Allocation
              </button>

              <button
                onClick={() => handleSelect('availability')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'availability'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Faculty Availability
              </button>

              <button
                onClick={() => handleSelect('generation_validator')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'generation_validator'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-red-700 dark:text-red-400'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Generate Timetable
              </button>

              <button
                onClick={() => handleSelect('grid')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'grid'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Timetable
              </button>
            </div>
          )}
        </div>

        {/* Review Group */}
        <div className="space-y-0.5">
          <button
            onClick={() => toggleGroup('review')}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <span>Review</span>
            {expandedGroups.review ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>

          {expandedGroups.review && (
            <div className="pl-2.5 space-y-0.5 border-l border-slate-200 dark:border-zinc-800 ml-1.5">
              <button
                onClick={() => handleSelect('governance')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  activeView === 'governance'
                    ? 'font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                Approvals & Publishing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Settings & User info */}
      <div className="p-2.5 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 space-y-1.5">
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-600" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 shrink-0 text-[10px]">
              <User className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-slate-900 dark:text-zinc-200 truncate">
                {currentUser?.name || 'Dr. K. N. Murthy'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              if (onShowLoginPage) onShowLoginPage();
            }}
            className="p-1 text-slate-400 hover:text-red-700 dark:text-zinc-400 dark:hover:text-red-400 rounded transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 h-full w-[85%] max-w-[320px]">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
