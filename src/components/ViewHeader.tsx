import React from 'react';
import { Student } from '../types';
import { ArrowLeft, Home, ChevronRight, User, Shield, Sparkles } from 'lucide-react';

interface ViewHeaderProps {
  currentView: 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal';
  onBack: () => void;
  title: string;
  subtitle?: string;
  students?: Student[];
  currentStudent?: Student | null;
  onSelectStudent?: (student: Student) => void;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  currentView,
  onBack,
  title,
  subtitle,
  students,
  currentStudent,
  onSelectStudent,
}) => {
  const viewNames: { [key: string]: string } = {
    branches: 'Our Branches',
    seats: 'Live 80 Desks Floor Plan',
    forum: 'Aspirants Community Forum',
    leaderboard: 'Scholar Hall of Fame',
    'student-portal': 'Student Portal & ID Card',
    'admin-portal': 'Super Admin Dashboard',
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back Button & Breadcrumbs */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 hover:text-white text-amber-400 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 font-medium">{viewNames[currentView] || title}</span>
          </div>

          <div className="pt-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Quick Demo Profile Switcher (Visible on Student & Admin portals) */}
        {(currentView === 'student-portal' || currentView === 'admin-portal') && students && students.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 px-1 font-medium">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Simulate Student:</span>
            </div>
            <select
              value={currentStudent?.id || ''}
              onChange={e => {
                const std = students.find(s => s.id === e.target.value);
                if (std && onSelectStudent) onSelectStudent(std);
              }}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.seatNo} · {s.feesPending === 0 ? 'Paid' : `Due ₹${s.feesPending}`})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
