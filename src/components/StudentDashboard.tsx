import React, { useState } from 'react';
import { Student, Branch, Complaint, Notice, AttendanceLog } from '../types';
import { 
  User, ShieldCheck, CreditCard, Clock, MapPin, 
  AlertCircle, MessageSquare, Download, Printer, QrCode, 
  Flame, Award, CheckCircle, Sparkles, Send, Bell 
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  branch: Branch;
  complaints: Complaint[];
  notices: Notice[];
  onOpenIdCard: () => void;
  onOpenReceipt: () => void;
  onOpenPayFees: () => void;
  onPunchAttendance: () => void;
  onRaiseComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  branch,
  complaints,
  notices,
  onOpenIdCard,
  onOpenReceipt,
  onOpenPayFees,
  onPunchAttendance,
  onRaiseComplaint,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'notices'>('overview');

  // Complaint Form state
  const [cmpCategory, setCmpCategory] = useState<Complaint['category']>('AC / Temperature');
  const [cmpDescription, setCmpDescription] = useState('');
  const [cmpAnonymous, setCmpAnonymous] = useState(false);

  const studentComplaints = complaints.filter(c => c.studentId === student.id);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpDescription.trim()) return;

    onRaiseComplaint({
      studentId: student.id,
      studentName: student.name,
      seatNo: student.seatNo,
      branchId: student.branchId,
      category: cmpCategory,
      description: cmpDescription,
      isAnonymous: cmpAnonymous,
    });

    setCmpDescription('');
    alert('Complaint registered successfully! The library administrator has been notified.');
  };

  const remainingDue = Math.max(0, student.feesTotal - student.feesPaid);

  return (
    <div id="student-dashboard" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Student Profile Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d162b] to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative Gold Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 p-0.5 bg-slate-950 shrink-0 shadow-lg">
              <img
                src={student.photo}
                alt={student.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {student.idCardNo}
                </span>
                <span className="text-xs text-slate-400">· {branch.village} Branch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {student.name}
              </h2>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                Father: <strong>{student.fatherName}</strong> · Course: <strong>{student.course}</strong>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenIdCard}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Download ID Card PDF
            </button>

            <button
              onClick={onOpenReceipt}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              View Receipt & Notify
            </button>

            <button
              onClick={onPunchAttendance}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                student.isCheckedIn
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950'
              }`}
            >
              <QrCode className="w-4 h-4" />
              {student.isCheckedIn ? 'Punch OUT (Check-out)' : 'Gate Punch IN (+10 Pts)'}
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Allocated Desk</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {student.seatNo} <span className="text-xs font-normal text-slate-400 capitalize">({student.shift})</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Study Streak</span>
            <span className="text-lg font-black text-white flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              {student.studyStreak} Days
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Hours Logged</span>
            <span className="text-lg font-black text-white flex items-center gap-1">
              <Clock className="w-4 h-4 text-sky-400" />
              {student.totalHoursStudied}h Total
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Scholar Points</span>
            <span className="text-lg font-black text-amber-400 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" />
              {student.points} Pts
            </span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 mb-8 max-w-md text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview & Fees
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Support & Complaints ({studentComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Notice Board ({notices.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & FEES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Fees Status Card (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                Fees & Wallet Status
              </h3>
              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                remainingDue === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {remainingDue === 0 ? 'Fully Paid ✓' : 'Payment Due'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <p className="text-[11px] text-slate-400">Total Monthly Fees</p>
                <p className="text-lg font-black text-white mt-1">₹{student.feesTotal}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <p className="text-[11px] text-slate-400">Paid Amount</p>
                <p className="text-lg font-black text-emerald-400 mt-1">₹{student.feesPaid}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <p className="text-[11px] text-slate-400">Remaining Balance</p>
                <p className={`text-lg font-black mt-1 ${remainingDue === 0 ? 'text-slate-400' : 'text-rose-400'}`}>
                  ₹{remainingDue}
                </p>
              </div>
            </div>

            {/* Fee Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Fee Clearance</span>
                <span className="font-bold text-white">
                  {Math.round((student.feesPaid / student.feesTotal) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
                  style={{ width: `${Math.min(100, (student.feesPaid / student.feesTotal) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
                <span>Validity: {student.joiningDate} to {student.expiryDate}</span>
                <span>Due Date: {student.dueDate}</span>
              </div>
            </div>

            {/* Pay Button / Receipt Download */}
            <div className="pt-2 flex flex-wrap gap-3">
              {remainingDue > 0 ? (
                <button
                  onClick={onOpenPayFees}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Balance ₹{remainingDue} via UPI QR Standee
                </button>
              ) : (
                <button
                  onClick={onOpenReceipt}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  All Dues Cleared · View Official Tax Invoice
                </button>
              )}
            </div>
          </div>

          {/* Gate Attendance & Study Pass (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                Digital Gate Attendance
              </h3>
              <span className={`w-2.5 h-2.5 rounded-full ${student.isCheckedIn ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="w-36 h-36 bg-white rounded-2xl p-2 mx-auto flex items-center justify-center shadow-lg border border-amber-400/40">
                {/* SVG Personal Pass QR */}
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="#0F172A">
                  <rect x="5" y="5" width="26" height="26" rx="2" fill="#0F172A" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" fill="#0F172A" />
                  <rect x="69" y="5" width="26" height="26" rx="2" fill="#0F172A" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" fill="#0F172A" />
                  <rect x="5" y="69" width="26" height="26" rx="2" fill="#0F172A" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" fill="#0F172A" />
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="8" height="6" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#0F172A" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  {student.idCardNo} · Desk {student.seatNo}
                </span>
                <span className="text-[11px] text-slate-400">
                  Scan at entrance scanner kiosk or punch directly
                </span>
              </div>

              <div className="pt-1">
                <button
                  onClick={onPunchAttendance}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                    student.isCheckedIn
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {student.isCheckedIn ? 'Punch OUT (Session End)' : 'Punch IN (Session Start)'}
                </button>
              </div>

              <p className="text-[10px] text-slate-500">
                Last Gate Log: {student.lastCheckIn || 'None recorded today'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLAINT BOX & SUPPORT */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Raise Complaint Form (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Submit Student Support Ticket
            </h3>
            <p className="text-xs text-slate-400">
              Facing any issue with AC, noise, seat, WiFi or washroom? Report directly to library management.
            </p>

            <form onSubmit={handleComplaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Issue Category</label>
                <select
                  value={cmpCategory}
                  onChange={e => setCmpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="AC / Temperature">AC / Temperature Issue</option>
                  <option value="Noise / Disturbance">Noise / Silence Disturbance</option>
                  <option value="WiFi / Internet">WiFi / Slow Internet Speed</option>
                  <option value="Cleanliness">Cleanliness / Washroom Hygiene</option>
                  <option value="Seat / Chair">Seat / Broken Chair / Power Socket</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Details Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue clearly..."
                  value={cmpDescription}
                  onChange={e => setCmpDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={cmpAnonymous}
                  onChange={e => setCmpAnonymous(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <label htmlFor="anonymousCheck" className="text-slate-300 text-xs cursor-pointer">
                  Submit anonymously (Hide my name & seat no.)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Complaints History (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Ticket Resolution History
            </h3>

            <div className="space-y-3">
              {studentComplaints.length === 0 ? (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
                  No complaints filed yet. Everything is peaceful!
                </div>
              ) : (
                studentComplaints.map(cmp => (
                  <div
                    key={cmp.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{cmp.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cmp.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : cmp.status === 'In Review'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {cmp.status}
                      </span>
                    </div>

                    <p className="text-slate-300">{cmp.description}</p>

                    {cmp.adminReply && (
                      <div className="mt-2 p-2.5 bg-slate-900 rounded-xl border border-amber-500/20 text-amber-300 text-[11px]">
                        <strong>Admin Response:</strong> {cmp.adminReply}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                      <span>Submitted: {cmp.date}</span>
                      <span>{cmp.isAnonymous ? 'Submitted Anonymously' : `Desk ${cmp.seatNo}`}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTICE BOARD */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Official Library Announcements & Test Series
            </h3>
            <a
              href="https://whatsapp.com/channel"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              Join WhatsApp Channel
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notices.map(n => (
              <div
                key={n.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 text-[10px] font-bold rounded">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{n.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{n.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Broadcasted to WhatsApp</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
