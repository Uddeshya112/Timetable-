import React from 'react';
import { WorkspaceType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ThaparLogo } from '../ThaparLogo';
import {
  GraduationCap,
  Users,
  BookOpen,
  LayoutDashboard,
  Shield,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';

interface WorkspaceSelectionViewProps {
  workspaces: WorkspaceType[];
  onSelectWorkspace: (workspace: WorkspaceType) => void;
  onSignOut: () => void;
}

export function WorkspaceSelectionView({
  workspaces,
  onSelectWorkspace,
  onSignOut,
}: WorkspaceSelectionViewProps) {
  const { currentUser } = useAuth();

  const getWorkspaceDetails = (ws: WorkspaceType) => {
    switch (ws) {
      case 'Student':
        return {
          title: 'Student Portal',
          subtitle: 'Academic Routine & Timetable',
          description: 'View your personal lecture timeline, section schedule, free periods, and class updates.',
          icon: GraduationCap,
          badge: 'Academic',
        };
      case 'CR':
        return {
          title: 'Class Representative (CR) Portal',
          subtitle: 'Section Coordination & Consensus',
          description: 'Coordinate makeup slots, conduct student availability polls, and submit official rescheduling petitions.',
          icon: Users,
          badge: 'Leadership',
        };
      case 'Faculty':
        return {
          title: 'Faculty Portal',
          subtitle: 'Teaching Routine & Availability',
          description: 'Manage teaching schedule, protected research blocks, direct teaching workload, and voluntary slot exchanges.',
          icon: BookOpen,
          badge: 'Instruction',
        };
      case 'Coordinator':
        return {
          title: 'Coordinator Portal',
          subtitle: 'Academic Operations & Self-Healing',
          description: 'Coordinate department timetables, resolve schedule disruptions, process makeup opportunities, and approve freeze-window changes.',
          icon: LayoutDashboard,
          badge: 'Operations',
        };
      case 'Admin':
        return {
          title: 'Admin / Operations System',
          subtitle: 'Campus Governance & Planning',
          description: 'Master schedule governance, CP-SAT optimization solvers, scenario planning, UGC compliance, and access directory.',
          icon: Shield,
          badge: 'Administration',
        };
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans antialiased p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-zinc-850 pb-5">
        <div className="flex items-center gap-3">
          <ThaparLogo size="sm" variant="mark-only" />
          <div>
            <div className="text-sm font-semibold text-zinc-100">
              Thapar Institute of Engineering & Technology
            </div>
            <div className="text-[11px] text-zinc-400">
              Academic Operations Portal
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content: Workspace Selection Cards */}
      <div className="max-w-2xl mx-auto w-full py-8 sm:py-12 space-y-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Choose Workspace
          </h1>
          <p className="text-xs text-zinc-400">
            Welcome back, <span className="text-zinc-200 font-medium">{currentUser?.name}</span>. Your account is authorized for multiple workspaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {workspaces.map(ws => {
            const details = getWorkspaceDetails(ws);
            const Icon = details.icon;

            return (
              <button
                key={ws}
                onClick={() => onSelectWorkspace(ws)}
                className="group w-full p-4 sm:p-5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-2xl text-left transition-all duration-150 flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:border-red-600/60 group-hover:bg-red-950/30 text-zinc-300 group-hover:text-red-400 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 text-sm group-hover:text-white">
                        {details.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                        {details.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-zinc-400">
                      {details.subtitle}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed pt-0.5">
                      {details.description}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800/80 group-hover:border-red-600/50 flex items-center justify-center text-zinc-500 group-hover:text-red-400 shrink-0 self-center transition-colors">
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 bg-zinc-900/30 border border-zinc-850 rounded-xl text-center text-xs text-zinc-500">
          You can switch between your authorized workspaces anytime from your profile or the top navigation bar.
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-zinc-600 border-t border-zinc-900 pt-4">
        Thapar Institute of Engineering & Technology · Bhadson Road, Patiala, Punjab
      </div>
    </div>
  );
}
