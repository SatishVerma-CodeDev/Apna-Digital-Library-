import React, { useState } from 'react';
import { Student } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  X, QrCode, CheckCircle2, Clock, Flame, 
  Sparkles, ShieldCheck, User, ArrowRight 
} from 'lucide-react';

interface GateScannerModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onPunchStudent: (studentId: string) => void;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({
  students,
  isOpen,
  onClose,
  onPunchStudent,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [recentScanResult, setRecentScanResult] = useState<{
    student: Student;
    action: 'IN' | 'OUT';
    time: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScanOrSubmit = (codeToScan?: string) => {
    const code = (codeToScan || inputCode).trim().toUpperCase();
    if (!code) return;

    const student = students.find(
      s => s.idCardNo.toUpperCase() === code || s.seatNo.toUpperCase() === code || s.phone === code
    );

    if (!student) {
      alert(`Student not found with ID / Seat / Phone: ${code}`);
      return;
    }

    const action = student.isCheckedIn ? 'OUT' : 'IN';
    onPunchStudent(student.id);

    setRecentScanResult({
      student,
      action,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gate Attendance Kiosk</h3>
              <p className="text-xs text-slate-400">Lanka Main Entrance · Live Sensor Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Simulation Window */}
        <div className="py-6 space-y-5 text-center">
          <div className="relative w-56 h-56 mx-auto rounded-3xl bg-slate-950 border-2 border-dashed border-amber-400/70 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#FBBF24] animate-bounce" />

            <QrCode className="w-24 h-24 text-slate-700 mx-auto" />
            <p className="text-[11px] text-amber-300 font-semibold mt-2">
              Present ID Card QR to Camera
            </p>
          </div>

          {/* Quick Demo Scan Buttons */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Simulate student scan at gate:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {students.slice(0, 3).map(s => (
                <button
                  key={s.id}
                  onClick={() => handleScanOrSubmit(s.idCardNo)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Scan {s.name.split(' ')[0]} ({s.idCardNo})
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Or enter ID (e.g. APL-VNS-001)"
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScanOrSubmit()}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              onClick={() => handleScanOrSubmit()}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              Punch
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SUCCESS SCAN RESULT BANNER */}
          {recentScanResult && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-left space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-white text-sm">
                    {recentScanResult.action === 'IN' ? 'Welcome Inside! Punch IN Verified' : 'Good Session! Punch OUT Logged'}
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-300 font-bold">
                  {recentScanResult.time}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <p>
                  <strong>{recentScanResult.student.name}</strong> (S/o {recentScanResult.student.fatherName})
                </p>
                <p className="text-amber-300 font-mono mt-0.5">
                  Allocated Desk: {recentScanResult.student.seatNo} · Shift: {recentScanResult.student.shift.toUpperCase()}
                </p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  +10 Study Points awarded to your scholar profile!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
