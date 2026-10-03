import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Shield,
  Activity,
  Calendar,
  Layers,
  FlaskConical,
  Cpu,
  History,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Building,
  Users
} from 'lucide-react';

import { TimetableGridView } from './TimetableGridView';
import { RecoveryEngineView } from './RecoveryEngineView';
import { WhatIfSimulatorView } from './WhatIfSimulatorView';
import { SolverBenchmarkView } from './SolverBenchmarkView';
import { GovernanceView } from './GovernanceView';
import { AuthGovernanceView } from './AuthGovernanceView';

export function AdminPortalView() {
  const {
    health,
    makeupTasks,
    recoveryOpportunities,
    sessions,
    versions,
    rooms,
    facultyMembers,
    sections,
    courses,
    setActiveView,
  } = useTimetable();

  const [activeWorkflow, setActiveWorkflow] = useState<'operations' | 'planning' | 'governance' | 'system'>('operations');
  const [subView, setSubView] = useState<'overview' | 'grid' | 'recovery' | 'whatif' | 'solvers' | 'audit' | 'rbac'>('overview');

  const pendingMakeups = makeupTasks.filter(m => m.status !== 'Scheduled');
  const cancelledSessions = sessions.filter(s => s.status === 'Cancelled');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Campus Operations & Academic Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Administration Console
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Master timetable governance, CP-SAT optimization orchestration, and campus audit logging
          </p>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => {
              setActiveWorkflow('operations');
              setSubView('overview');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeWorkflow === 'operations'
                ? 'bg-red-700 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Operations
          </button>
          <button
            onClick={() => {
              setActiveWorkflow('planning');
              setSubView('whatif');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeWorkflow === 'planning'
                ? 'bg-red-700 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Planning & Solvers
          </button>
          <button
            onClick={() => {
              setActiveWorkflow('governance');
              setSubView('audit');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeWorkflow === 'governance'
                ? 'bg-red-700 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Governance & Audit
          </button>
          <button
            onClick={() => {
              setActiveWorkflow('system');
              setSubView('rbac');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeWorkflow === 'system'
                ? 'bg-red-700 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Access Control
          </button>
        </div>
      </div>

      {/* OPERATIONS WORKFLOW */}
      {activeWorkflow === 'operations' && subView === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Key Metric Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-medium">Schedule Health</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {health.overallScore}%
              </div>
              <div className="text-[11px] text-zinc-400">CP-SAT Optimized</div>
            </div>

            <div className="p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-medium">Campus Sections</div>
              <div className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                {sections.length} Sections
              </div>
              <div className="text-[11px] text-zinc-400">{courses.length} Active Courses</div>
            </div>

            <div className="p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-medium">Total Faculty</div>
              <div className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                {facultyMembers.length} Instructors
              </div>
              <div className="text-[11px] text-zinc-400">100% Workload Balanced</div>
            </div>

            <div className="p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-medium">Master Version</div>
              <div className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                {versions[versions.length - 1]?.versionLabel || 'V1.0'}
              </div>
              <div className="text-[11px] text-zinc-400">Active Production Release</div>
            </div>
          </div>

          {/* Quick Operations Nav Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <Calendar className="h-4 w-4 text-red-400" />
                  <span>Master Timetable Matrix</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Inspect the multi-dimensional timetable grid filtered across Sections, Faculty Members, and Lecture/Lab Venues.
                </p>
              </div>
              <button
                onClick={() => setSubView('grid')}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open Master Grid View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>Self-Healing Engine & Disruption Queue</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Autonomous vacancy matching, pending instructor leave recovery, and batch scheduling actions across departments.
                </p>
              </div>
              <button
                onClick={() => setSubView('recovery')}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Manage Self-Healing Queue ({pendingMakeups.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-views inside Operations */}
      {activeWorkflow === 'operations' && subView === 'grid' && (
        <div className="space-y-4">
          <button
            onClick={() => setSubView('overview')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-medium"
          >
            ← Back to Operations Overview
          </button>
          <TimetableGridView />
        </div>
      )}

      {activeWorkflow === 'operations' && subView === 'recovery' && (
        <div className="space-y-4">
          <button
            onClick={() => setSubView('overview')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-medium"
          >
            ← Back to Operations Overview
          </button>
          <RecoveryEngineView />
        </div>
      )}

      {/* PLANNING & SOLVERS WORKFLOW */}
      {activeWorkflow === 'planning' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex gap-2 border-b border-zinc-800 pb-2 text-xs">
            <button
              onClick={() => setSubView('whatif')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                subView === 'whatif' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Scenario Simulator (What-If)
            </button>
            <button
              onClick={() => setSubView('solvers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                subView === 'solvers' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Optimization Solvers (CP-SAT / DSATUR)
            </button>
          </div>

          {subView === 'whatif' && <WhatIfSimulatorView />}
          {subView === 'solvers' && <SolverBenchmarkView />}
        </div>
      )}

      {/* GOVERNANCE & AUDIT WORKFLOW */}
      {activeWorkflow === 'governance' && (
        <div className="animate-in fade-in duration-150">
          <GovernanceView />
        </div>
      )}

      {/* SYSTEM & ACCESS CONTROL WORKFLOW */}
      {activeWorkflow === 'system' && (
        <div className="animate-in fade-in duration-150">
          <AuthGovernanceView />
        </div>
      )}
    </div>
  );
}
