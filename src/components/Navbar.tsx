import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Student } from '../types';
import { 
  Shield, User, QrCode, BookOpen, Compass, Award, 
  MessageSquare, Sparkles, LogOut, CheckCircle2 
} from 'lucide-react';

interface NavbarProps {
  currentStudent: Student | null;
  isAdmin: boolean;
  activeView: 'home' | 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal';
  onNavigate: (view: 'home' | 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal') => void;
  onOpenAdmission: () => void;
  onOpenStandee: () => void;
  onOpenGateScanner: () => void;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStudent,
  isAdmin,
  activeView,
  onNavigate,
  onOpenAdmission,
  onOpenStandee,
  onOpenGateScanner,
  onToggleAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-amber-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer transition-transform hover:scale-102"
          >
            <BrandLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeView === 'home' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('branches')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'branches' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Our Branches
            </button>

            <button
              onClick={() => onNavigate('seats')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'seats' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live 80 Desks
            </button>

            <button
              onClick={() => onNavigate('forum')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'forum' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              Forum
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'leaderboard' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Leaderboard
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gate Scanner Kiosk button */}
            <button
              onClick={onOpenGateScanner}
              title="Open Gate Scanner Terminal"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Gate Terminal</span>
            </button>

            {/* Student Portal / Admin Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onNavigate('student-portal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'student-portal'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>

              <button
                onClick={() => {
                  onToggleAdmin();
                  onNavigate('admin-portal');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isAdmin || activeView === 'admin-portal'
                    ? 'bg-slate-800 text-amber-300 border border-amber-400/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Book Seat CTA */}
            <button
              onClick={onOpenAdmission}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admission</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
