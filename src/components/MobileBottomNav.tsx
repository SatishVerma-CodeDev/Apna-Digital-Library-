import React from 'react';
import { 
  Home, Compass, Grid, MessageSquare, User, 
  Shield, QrCode, MessageCircle, ArrowUp 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'home' | 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal';
  onNavigate: (view: 'home' | 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal') => void;
  onOpenGateScanner: () => void;
  onOpenStandee: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
  onOpenGateScanner,
  onOpenStandee,
}) => {
  return (
    <>
      {/* Floating Action Button Cluster (Right Side) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2.5 items-end no-print">
        {/* Instant UPI Standee Floating Pill */}
        <button
          onClick={onOpenStandee}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/40 rounded-full text-xs font-bold shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <span>UPI Standee</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        {/* WhatsApp Channel Floating Action */}
        <a
          href="https://whatsapp.com/channel"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all hover:scale-110 cursor-pointer"
          title="Join Apna Library WhatsApp Channel"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Persistent Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-2 flex items-center justify-around text-[10px] font-medium no-print">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('branches')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'branches' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Branches</span>
        </button>

        <button
          onClick={() => onNavigate('seats')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'seats' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>80 Desks</span>
        </button>

        <button
          onClick={() => onNavigate('forum')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'forum' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Forum</span>
        </button>

        <button
          onClick={() => onNavigate('student-portal')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'student-portal' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Student</span>
        </button>

        <button
          onClick={() => onNavigate('admin-portal')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
            activeView === 'admin-portal' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Admin</span>
        </button>
      </div>
    </>
  );
};
