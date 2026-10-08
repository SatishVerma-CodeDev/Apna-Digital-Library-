import React, { useState } from 'react';
import { Student, Branch, Seat, Complaint, Notice } from '../types';
import { loadNotifications, NotificationRecord, addNotification } from '../services/storage';
import { 
  Users, CreditCard, Shield, AlertCircle, Bell, Search, 
  Download, CheckCircle, Smartphone, MessageCircle, Send, 
  Trash2, UserPlus, FileSpreadsheet, MapPin, Eye, Clock, Check, X 
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  branches: Branch[];
  seats: Seat[];
  complaints: Complaint[];
  notices: Notice[];
  onOpenNewAdmission: () => void;
  onSelectStudentCard: (student: Student) => void;
  onSelectStudentReceipt: (student: Student, amount: number) => void;
  onUpdateStudentFees: (studentId: string, paidAmount: number) => void;
  onDeleteStudent: (studentId: string) => void;
  onResolveComplaint: (complaintId: string, reply: string) => void;
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  branches,
  seats,
  complaints,
  notices,
  onOpenNewAdmission,
  onSelectStudentCard,
  onSelectStudentReceipt,
  onUpdateStudentFees,
  onDeleteStudent,
  onResolveComplaint,
  onAddNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'fees' | 'complaints' | 'notices' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDefaulters, setFilterDefaulters] = useState(false);
  const [filterExpiring, setFilterExpiring] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('All');

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Notice['category']>('Exam Alert');

  // Complaint reply state
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({});

  const notifications = loadNotifications();

  // Metrics
  const totalActiveStudents = students.length;
  const totalOccupiedSeats = seats.filter(s => s.isOccupied).length;
  const totalSeats = seats.length;
  const vacantSeats = totalSeats - totalOccupiedSeats;

  const totalMonthlyRevenue = students.reduce((acc, s) => acc + s.feesPaid, 0);
  const defaultersList = students.filter(s => s.feesPending > 0);
  const todayCollection = students.filter(s => s.paymentStatus === 'Paid').slice(0, 3).reduce((acc, s) => acc + s.feesPaid, 0);

  // Expiring in next 7 days
  const expiringStudents = students.filter(s => {
    const exp = new Date(s.expiryDate).getTime();
    const now = Date.now();
    const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.seatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.idCardNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchBranch = selectedBranchId === 'All' || s.branchId === selectedBranchId;
    const matchDefaulter = !filterDefaulters || s.feesPending > 0;
    const matchExpiring = !filterExpiring || expiringStudents.some(es => es.id === s.id);

    return matchSearch && matchBranch && matchDefaulter && matchExpiring;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID Card No', 'Name', 'Father Name', 'Phone', 'Seat No', 'Shift', 'Course', 'Fees Total', 'Fees Paid', 'Fees Pending', 'Expiry Date'];
    const rows = students.map(s => [
      s.idCardNo,
      s.name,
      s.fatherName,
      s.phone,
      s.seatNo,
      s.shift,
      s.course,
      s.feesTotal,
      s.feesPaid,
      s.feesPending,
      s.expiryDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apna_library_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Fee Reminder Trigger
  const handleSendFeeReminder = (student: Student) => {
    const reminderMsg = `🔔 *APNA LIBRARY - FEE RENEWAL REMINDER*
Dear ${student.name} (S/o ${student.fatherName}),
Your allocated Seat *${student.seatNo}* at Apna Library expires on *${student.expiryDate}*.
Pending Balance: *₹${student.feesPending}*
Please renew via UPI QR (apnalibrary@upi) to retain your preferred reserved seat.
Thank you!
Helpline: +91 98765 43210`;

    // Record in notifications
    addNotification({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      type: 'WhatsApp',
      category: 'Fee Due Reminder',
      message: reminderMsg,
    });

    // Open WhatsApp
    const cleanPhone = student.phone.replace(/\D/g, '');
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(reminderMsg)}`, '_blank');
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    onAddNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      broadcastToWhatsApp: true,
    });

    setNoticeTitle('');
    setNoticeContent('');
    alert('Notice published and broadcasted to WhatsApp Community Channel!');
  };

  return (
    <div id="admin-dashboard" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Super Admin Command Centre</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Apna Library Management Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live occupancy tracking, automated WhatsApp & SMS fee dispatch, KYC records & dispute resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={onOpenNewAdmission}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + New Admission Form
          </button>
        </div>
      </div>

      {/* METRIC KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Monthly Revenue</p>
          <p className="text-xl font-black text-emerald-400 mt-1">₹{totalMonthlyRevenue}</p>
          <span className="text-[10px] text-slate-500">Collected this month</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Active Students</p>
          <p className="text-xl font-black text-white mt-1">{totalActiveStudents}</p>
          <span className="text-[10px] text-amber-400 font-semibold">{totalOccupiedSeats} Desks Occupied</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Vacant Desks</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{vacantSeats}</p>
          <span className="text-[10px] text-slate-500">Ready for booking</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Defaulters</p>
          <p className="text-xl font-black text-rose-400 mt-1">{defaultersList.length}</p>
          <span className="text-[10px] text-rose-400/80">Pending payment</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Expiring Soon</p>
          <p className="text-xl font-black text-amber-300 mt-1">{expiringStudents.length}</p>
          <span className="text-[10px] text-amber-300/80">Within 7 days</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-medium">Pending Tickets</p>
          <p className="text-xl font-black text-sky-400 mt-1">
            {complaints.filter(c => c.status !== 'Resolved').length}
          </p>
          <span className="text-[10px] text-slate-500">Support tickets</span>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 mb-8 max-w-3xl text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Floor Occupancy
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'students' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Student Master Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'fees' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Fees & Automation
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'complaints' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'notices' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Notices & Broadcast
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'logs' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          WhatsApp & SMS Logs ({notifications.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & LIVE OCCUPANCY MAP */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Live Real-Time Seat Occupancy</h3>
              <p className="text-xs text-slate-400">
                Hover or click any occupied seat to view Student Name, Father's Name, Shift, and check-in status.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 bg-emerald-500 rounded-md" /> Available ({vacantSeats})
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-3 bg-rose-600 rounded-md" /> Occupied ({totalOccupiedSeats})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-20 gap-2">
            {seats.slice(0, 80).map(seat => {
              const student = students.find(s => s.seatNo === seat.seatNumber);

              return (
                <div
                  key={seat.id}
                  className={`group relative p-2 h-14 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    seat.isOccupied
                      ? 'bg-rose-700/80 border-rose-500 text-rose-100 hover:bg-rose-600'
                      : 'bg-emerald-600/80 border-emerald-400 text-white hover:bg-emerald-500'
                  }`}
                >
                  <span className="text-[11px] font-bold font-mono">{seat.seatNumber}</span>
                  <span className="text-[9px] opacity-80">{seat.isOccupied ? 'Occupied' : 'Free'}</span>

                  {/* HOVER TOOLTIP WITH FATHER NAME */}
                  {seat.isOccupied && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-40 w-48 bg-slate-950 border border-amber-400 p-3 rounded-xl shadow-2xl text-left text-xs pointer-events-none">
                      <p className="font-bold text-white text-xs">{student?.name || seat.studentName}</p>
                      <p className="text-[11px] text-amber-300 font-medium">
                        Father: {student?.fatherName || seat.studentFatherName || 'N/A'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">
                        Shift: {student?.shift || seat.shift || 'Full Day'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Phone: {student?.phone || '9876543210'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Name, Father's Name, Phone, Seat No, ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setFilterDefaulters(!filterDefaulters)}
                className={`px-3 py-2 rounded-xl font-medium border transition-colors cursor-pointer ${
                  filterDefaulters
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Defaulters Only ({defaultersList.length})
              </button>

              <button
                onClick={() => setFilterExpiring(!filterExpiring)}
                className={`px-3 py-2 rounded-xl font-medium border transition-colors cursor-pointer ${
                  filterExpiring
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Expiring (7d) ({expiringStudents.length})
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Father's Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Seat & Shift</th>
                    <th className="py-3 px-4">Fees Status</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                          />
                          <div>
                            <p className="font-bold text-white">{student.name}</p>
                            <span className="font-mono text-[10px] text-amber-400">{student.idCardNo}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-amber-200">
                        {student.fatherName}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <p>+91 {student.phone}</p>
                        <p className="text-slate-500 text-[10px] truncate max-w-[130px]">{student.email}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white font-mono">{student.seatNo}</span>
                        <span className="text-slate-500 capitalize"> · {student.shift}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.feesPending === 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {student.feesPending === 0 ? 'Paid' : `Due ₹${student.feesPending}`}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {student.expiryDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View ID Card */}
                          <button
                            onClick={() => onSelectStudentCard(student)}
                            title="View Official ID Card"
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Fee Receipt / Update */}
                          <button
                            onClick={() => onSelectStudentReceipt(student, student.feesPaid)}
                            title="Fee Receipt & Notification"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Reminder */}
                          <button
                            onClick={() => handleSendFeeReminder(student)}
                            title="Send WhatsApp Reminder"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title="Remove Student"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEES & AUTOMATION */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                Fee Payment Management & UPI Approvals
              </h3>
              <span className="text-xs text-slate-400">
                1-Click fee clearance with automated WhatsApp & SMS delivery
              </span>
            </div>

            <div className="space-y-3">
              {students.map(student => (
                <div
                  key={student.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-bold text-white text-sm">
                      {student.name} <span className="text-amber-300 font-mono">({student.seatNo})</span>
                    </p>
                    <p className="text-slate-400">
                      Father: {student.fatherName} · Phone: +91 {student.phone}
                    </p>
                    <p className="text-slate-500 font-mono text-[10px]">
                      Due Date: {student.dueDate} · Fee Plan: ₹{student.feesTotal}/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-white">
                        Paid: <span className="text-emerald-400">₹{student.feesPaid}</span>
                      </p>
                      <p className="font-bold">
                        Pending: <span className={student.feesPending > 0 ? 'text-rose-400' : 'text-slate-500'}>
                          ₹{student.feesPending}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {student.feesPending > 0 ? (
                        <button
                          onClick={() => {
                            onUpdateStudentFees(student.id, student.feesTotal);
                            onSelectStudentReceipt(student, student.feesTotal);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Paid & Notify
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectStudentReceipt(student, student.feesPaid)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          View Receipt Slip
                        </button>
                      )}

                      <button
                        onClick={() => handleSendFeeReminder(student)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Student Support Tickets & Grievance Resolution
            </h3>

            <div className="space-y-4">
              {complaints.map(cmp => (
                <div
                  key={cmp.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{cmp.category}</span>
                      <span className="text-slate-400 ml-2">
                        {cmp.isAnonymous ? 'Anonymous Aspirant' : `${cmp.studentName} (Desk ${cmp.seatNo})`}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                      cmp.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl">
                    {cmp.description}
                  </p>

                  {cmp.status !== 'Resolved' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type resolution reply for student..."
                        value={replyInputs[cmp.id] || ''}
                        onChange={e => setReplyInputs({ ...replyInputs, [cmp.id]: e.target.value })}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                      <button
                        onClick={() => {
                          const rep = replyInputs[cmp.id] || 'Issue inspected and resolved by library staff.';
                          onResolveComplaint(cmp.id, rep);
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      <strong>Resolution:</strong> {cmp.adminReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTICES & CHANNEL BROADCAST */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Publish New Announcement
            </h3>

            <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free All-India Mock Test on Sunday"
                  value={noticeTitle}
                  onChange={e => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={e => setNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Exam Alert">Exam Alert</option>
                  <option value="Holiday">Holiday Notice</option>
                  <option value="Maintenance">Maintenance & Upgrades</option>
                  <option value="Offer">Offers & Discounts</option>
                  <option value="General">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write notice body..."
                  value={noticeContent}
                  onChange={e => setNoticeContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Post & Broadcast to WhatsApp Channel
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Active Notices ({notices.length})</h3>
            <div className="space-y-3">
              {notices.map(n => (
                <div
                  key={n.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{n.title}</span>
                    <span className="text-slate-500">{n.date}</span>
                  </div>
                  <p className="text-slate-300">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WHATSAPP & SMS AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                SMS (MSM) & WhatsApp Dispatch Audit Trail
              </h3>
              <p className="text-xs text-slate-400">
                Log of automated fee receipts, due reminders, and gate pass notifications
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
              Gateway Active: DL-APNALIB
            </span>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                No notification records yet. Dispatches will appear here immediately after payment!
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        n.type === 'WhatsApp' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {n.type}
                      </span>
                      <span className="font-bold text-white">{n.category}</span>
                      <span className="text-slate-500">· To: {n.studentName} (+91 {n.phone})</span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-900/60 p-2 rounded-lg mt-1">
                      {n.message}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold block">✓ Delivered</span>
                    <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
