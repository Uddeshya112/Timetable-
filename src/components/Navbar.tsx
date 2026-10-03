import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useAuth } from '../context/AuthContext';
import { ThaparLogo } from './ThaparLogo';
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenInbox: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onShowLoginPage: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export function Navbar({
  onOpenInbox,
  onOpenProfile,
  onShowLoginPage,
  isMobileNavOpen,
  onToggleMobileNav,
}: NavbarProps) {
  const {
    currentRole,
    notifications,
    health,
    activeView,
  } = useTimetable();

  const { currentUser, currentRole: authRole, logout } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = () => {
    logout();
    onShowLoginPage();
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Operations Hub';
      case 'grid':
        return 'Timetable Grid';
      case 'recovery':
        return 'Self-Healing Engine';
      case 'whatif':
        return 'Scenario Simulator';
      case 'solvers':
        return 'Optimization Solvers';
      case 'syllabus':
        return 'Workload & Syllabus';
      case 'faculty_portal':
        return 'Faculty Routine';
      case 'student_portal':
        return 'Student Schedule';
      case 'governance':
        return 'Audit & Versions';
      case 'auth_gov':
        return 'Access Directory';
      default:
        return 'Operations';
    }
  };

  return (
    <header className="h-14 sm:h-15 bg-zinc-950/95 border-b border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Mobile Menu Toggle + Logo + Short Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden p-2 -ml-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <ThaparLogo size="sm" variant="mark-only" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                Thapar Institute
              </span>
              <span className="hidden sm:inline text-zinc-600 text-xs font-normal">/</span>
              <span className="hidden sm:inline text-xs text-zinc-400 font-medium">
                {getViewTitle()}
              </span>
            </div>
            <span className="sm:hidden text-[11px] text-zinc-400 leading-tight">
              {getViewTitle()}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Health KPI + Notifications + Profile Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Schedule Health Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Health</span>
          <span className="font-mono font-semibold text-emerald-400 tabular-nums">
            {health.overallScore}%
          </span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenInbox}
          aria-label={`Open notifications (${unreadCount} unread)`}
          className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          title="Notifications & Alerts"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-zinc-950" />
          )}
        </button>

        {/* User Profile & Account Trigger */}
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2 sm:border-l sm:border-zinc-800/80">
          <button
            onClick={onOpenProfile}
            aria-label="Open user profile settings"
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/80 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <div className="w-7 h-7 rounded-full bg-red-950 text-red-200 border border-red-800/60 flex items-center justify-center font-bold text-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : <User className="h-3.5 w-3.5" />}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-medium text-zinc-200 leading-tight max-w-[110px] truncate">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono leading-tight">
                {authRole?.name || currentRole}
              </span>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
