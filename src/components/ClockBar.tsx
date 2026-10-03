import React, { useState, useEffect } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DayOfWeek } from '../types';
import {
  Clock,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function ClockBar() {
  const [simulatedDay, setSimulatedDay] = useState<DayOfWeek>('Monday');
  const [simulatedHour, setSimulatedHour] = useState<number>(8);
  const [simulatedMinute, setSimulatedMinute] = useState<number>(15);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Auto-tick if running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimulatedMinute(prev => {
        if (prev + 15 >= 60) {
          setSimulatedHour(h => (h + 1 > 17 ? 8 : h + 1));
          return 0;
        }
        return prev + 15;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const advanceHour = () => {
    setSimulatedHour(h => (h + 1 > 17 ? 8 : h + 1));
  };

  const jumpToCrossCancellation = () => {
    setSimulatedDay('Thursday');
    setSimulatedHour(11);
    setSimulatedMinute(0);
  };

  const resetClock = () => {
    setSimulatedDay('Monday');
    setSimulatedHour(8);
    setSimulatedMinute(15);
    setIsRunning(false);
  };

  const periodLabel =
    simulatedHour === 8 ? 'Period 1 (08:00 – 09:00)' :
    simulatedHour === 9 ? 'Period 2 (09:00 – 10:00)' :
    simulatedHour === 10 ? 'Period 3 (10:00 – 11:00)' :
    simulatedHour === 11 ? 'Period 4 (11:00 – 12:00)' :
    simulatedHour === 12 ? 'Lunch (12:00 – 13:00)' :
    simulatedHour === 13 ? 'Period 6 (13:00 – 14:00)' :
    simulatedHour === 14 ? 'Period 7 (14:00 – 15:00)' :
    'Period 8 (15:00 – 16:00)';

  return (
    <div className="bg-zinc-950/70 border-b border-zinc-800/60 px-4 sm:px-6 py-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Current Time Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Schedule Time:</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
            <span className="font-semibold text-zinc-200">{simulatedDay}</span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {String(simulatedHour).padStart(2, '0')}:{String(simulatedMinute).padStart(2, '0')}
            </span>
            <span className="text-zinc-600 hidden md:inline">·</span>
            <span className="text-zinc-400 hidden md:inline">{periodLabel}</span>
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* Primary Clock Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              isRunning
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
            }`}
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={advanceHour}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-md transition-colors text-xs font-medium"
          >
            <FastForward className="h-3 w-3" />
            <span>+1 Hr</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="flex items-center gap-1 px-2 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors text-xs"
          >
            <span className="hidden sm:inline">Advanced</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Advanced Controls */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToCrossCancellation}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-md transition-colors text-xs"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Jump to Thu 11:00 (Simulate Vacancy)</span>
            </button>
          </div>

          <button
            onClick={resetClock}
            className="flex items-center gap-1 px-2 py-1 text-zinc-400 hover:text-zinc-200 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Clock</span>
          </button>
        </div>
      )}
    </div>
  );
}
