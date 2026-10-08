import React, { useState, useEffect } from 'react';
import { 
  Branch, Student, Seat, Complaint, Notice, ForumPost, ForumReply 
} from './types';
import { 
  loadBranches, saveBranches,
  loadStudents, saveStudents,
  loadSeats, saveSeats,
  loadComplaints, saveComplaints,
  loadNotices, saveNotices,
  loadForumPosts, saveForumPosts,
  addNotification
} from './services/storage';
import { mockMessagingService } from './services/messagingService';


// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BranchLocator } from './components/BranchLocator';
import { SeatMap } from './components/SeatMap';
import { CommunityForum } from './components/CommunityForum';
import { GamificationLeaderboard } from './components/GamificationLeaderboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentAdmissionModal } from './components/StudentAdmissionModal';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { FeeReceiptModal } from './components/FeeReceiptModal';
import { QRStandeeModal } from './components/QRStandeeModal';
import { GateScannerModal } from './components/GateScannerModal';
import { DayPassModal } from './components/DayPassModal';
import { ViewHeader } from './components/ViewHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';


export default function App() {
  // App-level state loaded from LocalStorage
  const [branches, setBranches] = useState<Branch[]>(() => loadBranches());
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [seats, setSeats] = useState<Seat[]>(() => loadSeats());
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadComplaints());
  const [notices, setNotices] = useState<Notice[]>(() => loadNotices());
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => loadForumPosts());

  // Active Context
  const [activeBranch, setActiveBranch] = useState<Branch>(() => branches[0]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => students[0] || null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<
    'home' | 'branches' | 'seats' | 'forum' | 'leaderboard' | 'student-portal' | 'admin-portal'
  >('home');

  // Modals state
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [preSelectedSeatNo, setPreSelectedSeatNo] = useState<string | undefined>(undefined);

  const [cardModalStudent, setCardModalStudent] = useState<Student | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<{
    student: Student;
    amount: number;
  } | null>(null);

  const [isQRStandeeOpen, setIsQRStandeeOpen] = useState(false);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [isDayPassOpen, setIsDayPassOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => { saveBranches(branches); }, [branches]);
  useEffect(() => { saveStudents(students); }, [students]);
  useEffect(() => { saveSeats(seats); }, [seats]);
  useEffect(() => { saveComplaints(complaints); }, [complaints]);
  useEffect(() => { saveNotices(notices); }, [notices]);
  useEffect(() => { saveForumPosts(forumPosts); }, [forumPosts]);

  // Keep currentStudent synced with students array updates
  useEffect(() => {
    if (currentStudent) {
      const refreshed = students.find(s => s.id === currentStudent.id);
      if (refreshed) setCurrentStudent(refreshed);
    }
  }, [students]);

  // Global Escape key listener to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAdmissionOpen(false);
        setCardModalStudent(null);
        setReceiptModalData(null);
        setIsQRStandeeOpen(false);
        setIsGateScannerOpen(false);
        setIsDayPassOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // --- ACTIONS & HANDLERS ---

  // Register New Student
  const handleStudentRegistered = (newStudent: Student, paymentAmount: number) => {
    const updatedStudents = [newStudent, ...students];
    setStudents(updatedStudents);
    setCurrentStudent(newStudent);

    // Mark seat occupied
    const updatedSeats = seats.map(s => {
      if (s.seatNumber === newStudent.seatNo && s.branchId === newStudent.branchId) {
        return {
          ...s,
          isOccupied: true,
          studentId: newStudent.id,
          studentName: newStudent.name,
          studentFatherName: newStudent.fatherName,
          studentPhoto: newStudent.photo,
          shift: newStudent.shift,
        };
      }
      return s;
    });
    setSeats(updatedSeats);

    // Update branch occupied seats count
    const updatedBranches = branches.map(b => {
      if (b.id === newStudent.branchId) {
        return { ...b, occupiedSeats: b.occupiedSeats + 1 };
      }
      return b;
    });
    setBranches(updatedBranches);

    // Trigger Mock Messaging Service for Twilio & WhatsApp Business API
    const studentBranch = branches.find(b => b.id === newStudent.branchId) || activeBranch;
    mockMessagingService.sendPaymentNotification(
      newStudent,
      paymentAmount,
      studentBranch,
      'ADMISSION_CONFIRMATION'
    );

    // Automatically pop open fee receipt with instant WhatsApp/SMS notification sender!
    setTimeout(() => {
      setReceiptModalData({
        student: newStudent,
        amount: paymentAmount,
      });
    }, 400);
  };

  // Punch Attendance / Gate Check-in
  const handlePunchAttendance = (studentIdToPunch?: string) => {
    const targetId = studentIdToPunch || currentStudent?.id;
    if (!targetId) return;

    setStudents(prev =>
      prev.map(s => {
        if (s.id === targetId) {
          const newCheckedIn = !s.isCheckedIn;
          const pointsEarned = newCheckedIn ? 10 : 0;
          const streakIncrement = newCheckedIn ? 1 : 0;

          return {
            ...s,
            isCheckedIn: newCheckedIn,
            points: s.points + pointsEarned,
            studyStreak: s.studyStreak + streakIncrement,
            totalHoursStudied: s.totalHoursStudied + (newCheckedIn ? 4 : 0),
            lastCheckIn: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          };
        }
        return s;
      })
    );
  };

  // Update Fees / Mark Paid
  const handleUpdateStudentFees = (studentId: string, paidAmount: number) => {
    let targetStudent: Student | undefined;

    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            feesPaid: paidAmount,
            feesPending: Math.max(0, s.feesTotal - paidAmount),
            paymentStatus: (paidAmount >= s.feesTotal ? 'Paid' : 'Due') as 'Paid' | 'Due',
            points: s.points + 100, // +100 Points for fee payment!
          };
          targetStudent = updated;
          return updated;
        }
        return s;
      })
    );

    // Trigger Mock Messaging Service for Twilio & WhatsApp Business API
    if (targetStudent) {
      const studentBranch = branches.find(b => b.id === (targetStudent as Student).branchId) || activeBranch;
      mockMessagingService.sendPaymentNotification(
        targetStudent,
        paidAmount,
        studentBranch,
        'FEE_PAYMENT_UPDATE'
      );
    }
  };

  // Delete Student
  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find(s => s.id === studentId);
    if (!studentToDelete) return;

    setStudents(prev => prev.filter(s => s.id !== studentId));

    // Free the seat
    setSeats(prev =>
      prev.map(seat => {
        if (seat.seatNumber === studentToDelete.seatNo) {
          return {
            ...seat,
            isOccupied: false,
            studentId: undefined,
            studentName: undefined,
            studentFatherName: undefined,
            studentPhoto: undefined,
          };
        }
        return seat;
      })
    );
  };

  // Toggle Seat Occupancy from Seat Map (Admin)
  const handleToggleSeatOccupancy = (seatId: string) => {
    setSeats(prev =>
      prev.map(s => {
        if (s.id === seatId) {
          return {
            ...s,
            isOccupied: !s.isOccupied,
            studentName: !s.isOccupied ? 'Reserved' : undefined,
          };
        }
        return s;
      })
    );
  };

  // Add Branch
  const handleAddBranch = (newBranch: Branch) => {
    setBranches(prev => [...prev, newBranch]);
  };

  // Raise Complaint
  const handleRaiseComplaint = (cmp: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    const newRecord: Complaint = {
      ...cmp,
      id: `cmp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setComplaints(prev => [newRecord, ...prev]);
  };

  // Resolve Complaint
  const handleResolveComplaint = (complaintId: string, reply: string) => {
    setComplaints(prev =>
      prev.map(c => (c.id === complaintId ? { ...c, status: 'Resolved', adminReply: reply } : c))
    );
  };

  // Add Notice
  const handleAddNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  // Forum Handlers
  const handleAddForumPost = (postData: Omit<ForumPost, 'id' | 'createdAt' | 'likes' | 'replies'>) => {
    const newPost: ForumPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: 'Just now',
      likes: 1,
      replies: [],
    };
    setForumPosts(prev => [newPost, ...prev]);

    // Award student +25 points
    if (currentStudent) {
      setStudents(prev =>
        prev.map(s => (s.id === currentStudent.id ? { ...s, points: s.points + 25 } : s))
      );
    }
  };

  const handleAddForumReply = (postId: string, replyData: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>) => {
    const newReply: ForumReply = {
      ...replyData,
      id: `rep-${Date.now()}`,
      createdAt: 'Just now',
      likes: 0,
    };

    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, replies: [...(p.replies || []), newReply] };
        }
        return p;
      })
    );

    // Award student +25 points
    if (currentStudent && !isAdmin) {
      setStudents(prev =>
        prev.map(s => (s.id === currentStudent.id ? { ...s, points: s.points + 25 } : s))
      );
    }
  };

  const handleLikeForumPost = (postId: string) => {
    setForumPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handlePinForumPost = (postId: string) => {
    setForumPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const handleLockForumPost = (postId: string) => {
    setForumPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, isLocked: !p.isLocked } : p))
    );
  };

  const handleDeleteForumPost = (postId: string) => {
    setForumPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Poppins',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        currentStudent={currentStudent}
        isAdmin={isAdmin}
        activeView={activeView}
        onNavigate={view => setActiveView(view)}
        onOpenAdmission={() => {
          setPreSelectedSeatNo(undefined);
          setIsAdmissionOpen(true);
        }}
        onOpenStandee={() => setIsQRStandeeOpen(true)}
        onOpenGateScanner={() => setIsGateScannerOpen(true)}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div>
            <Hero
              onExploreSeats={() => {
                setActiveView('seats');
              }}
              onFindBranches={() => {
                setActiveView('branches');
              }}
              onOpenAdmission={() => {
                setPreSelectedSeatNo(undefined);
                setIsAdmissionOpen(true);
              }}
              onOpenTrialPass={() => setIsDayPassOpen(true)}
              onOpenQRStandee={() => setIsQRStandeeOpen(true)}
            />

            {/* Quick Multi-Branch Section on Homepage */}
            <BranchLocator
              branches={branches}
              onSelectBranch={b => setActiveBranch(b)}
              onAddBranch={handleAddBranch}
              onBookSeat={b => {
                setActiveBranch(b);
                setActiveView('seats');
              }}
            />

            {/* Live 80-Seat Map Preview on Homepage */}
            <SeatMap
              branch={activeBranch}
              seats={seats}
              currentStudent={currentStudent}
              isAdmin={isAdmin}
              onSelectSeatToBook={seatNo => {
                setPreSelectedSeatNo(seatNo);
                setIsAdmissionOpen(true);
              }}
              onToggleOccupancy={handleToggleSeatOccupancy}
            />

            {/* Community Forum Snippet on Homepage */}
            <CommunityForum
              posts={forumPosts}
              currentStudent={currentStudent}
              isAdmin={isAdmin}
              onAddPost={handleAddForumPost}
              onAddReply={handleAddForumReply}
              onLikePost={handleLikeForumPost}
              onPinPost={handlePinForumPost}
              onLockPost={handleLockForumPost}
              onDeletePost={handleDeleteForumPost}
            />

            {/* Leaderboard Section on Homepage */}
            <GamificationLeaderboard
              students={students}
              currentStudent={currentStudent}
            />
          </div>
        )}

        {/* VIEW 2: OUR BRANCHES */}
        {activeView === 'branches' && (
          <div>
            <ViewHeader
              currentView="branches"
              onBack={() => setActiveView('home')}
              title="Our Library Branches Network"
              subtitle="Filter by State, District, and Village/Area to find your nearest peaceful study branch"
            />
            <div className="pb-12">
              <BranchLocator
                branches={branches}
                onSelectBranch={b => setActiveBranch(b)}
                onAddBranch={handleAddBranch}
                onBookSeat={b => {
                  setActiveBranch(b);
                  setActiveView('seats');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: LIVE SEAT MAP */}
        {activeView === 'seats' && (
          <div>
            <ViewHeader
              currentView="seats"
              onBack={() => setActiveView('home')}
              title={`Live 80 Desks Floor Plan · ${activeBranch.name}`}
              subtitle="Green=Available Free, Red=Occupied, Yellow=Your Reserved Seat. Click any desk to book or view amenities."
            />
            <div className="pb-12">
              <SeatMap
                branch={activeBranch}
                seats={seats}
                currentStudent={currentStudent}
                isAdmin={isAdmin}
                onSelectSeatToBook={seatNo => {
                  setPreSelectedSeatNo(seatNo);
                  setIsAdmissionOpen(true);
                }}
                onToggleOccupancy={handleToggleSeatOccupancy}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: COMMUNITY FORUM */}
        {activeView === 'forum' && (
          <div>
            <ViewHeader
              currentView="forum"
              onBack={() => setActiveView('home')}
              title="Aspirants Community Forum"
              subtitle="Peer-to-peer discussions for UPSC, NEET, IIT-JEE, and SSC exams. Earn +25 Scholar Points for helpful answers!"
            />
            <div className="pb-12">
              <CommunityForum
                posts={forumPosts}
                currentStudent={currentStudent}
                isAdmin={isAdmin}
                onAddPost={handleAddForumPost}
                onAddReply={handleAddForumReply}
                onLikePost={handleLikeForumPost}
                onPinPost={handlePinForumPost}
                onLockPost={handleLockForumPost}
                onDeletePost={handleDeleteForumPost}
              />
            </div>
          </div>
        )}

        {/* VIEW 5: GAMIFICATION LEADERBOARD */}
        {activeView === 'leaderboard' && (
          <div>
            <ViewHeader
              currentView="leaderboard"
              onBack={() => setActiveView('home')}
              title="Scholar Hall of Fame & Badges"
              subtitle="Earn points for timely fee payments (+100), daily study streaks (+10), and referring friends (+150)."
            />
            <div className="pb-12">
              <GamificationLeaderboard
                students={students}
                currentStudent={currentStudent}
              />
            </div>
          </div>
        )}

        {/* VIEW 6: STUDENT DASHBOARD */}
        {activeView === 'student-portal' && currentStudent && (
          <div>
            <ViewHeader
              currentView="student-portal"
              onBack={() => setActiveView('home')}
              title={`Welcome back, ${currentStudent.name}!`}
              subtitle={`Desk ${currentStudent.seatNo} · ${currentStudent.shift.toUpperCase()} Shift · ${activeBranch.name}`}
              students={students}
              currentStudent={currentStudent}
              onSelectStudent={std => setCurrentStudent(std)}
            />
            <div className="pb-12">
              <StudentDashboard
                student={currentStudent}
                branch={activeBranch}
                complaints={complaints}
                notices={notices}
                onOpenIdCard={() => setCardModalStudent(currentStudent)}
                onOpenReceipt={() => setReceiptModalData({
                  student: currentStudent,
                  amount: currentStudent.feesPaid,
                })}
                onOpenPayFees={() => setIsQRStandeeOpen(true)}
                onPunchAttendance={() => handlePunchAttendance(currentStudent.id)}
                onRaiseComplaint={handleRaiseComplaint}
              />
            </div>
          </div>
        )}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {activeView === 'admin-portal' && (
          <div>
            <ViewHeader
              currentView="admin-portal"
              onBack={() => setActiveView('home')}
              title="Super Admin Command Dashboard"
              subtitle="Manage 80 seats occupancy, student records, fee approvals with automated WhatsApp & SMS dispatch."
              students={students}
              currentStudent={currentStudent}
              onSelectStudent={std => setCurrentStudent(std)}
            />
            <div className="pb-12">
              <AdminDashboard
                students={students}
                branches={branches}
                seats={seats}
                complaints={complaints}
                notices={notices}
                onOpenNewAdmission={() => {
                  setPreSelectedSeatNo(undefined);
                  setIsAdmissionOpen(true);
                }}
                onSelectStudentCard={student => setCardModalStudent(student)}
                onSelectStudentReceipt={(student, amt) => setReceiptModalData({
                  student,
                  amount: amt,
                })}
                onUpdateStudentFees={handleUpdateStudentFees}
                onDeleteStudent={handleDeleteStudent}
                onResolveComplaint={handleResolveComplaint}
                onAddNotice={handleAddNotice}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenStandee={() => setIsQRStandeeOpen(true)}
        onOpenGateScanner={() => setIsGateScannerOpen(true)}
        onOpenTrialPass={() => setIsDayPassOpen(true)}
      />

      {/* Mobile Bottom Navigation & Floating Quick Actions */}
      <MobileBottomNav
        activeView={activeView}
        onNavigate={view => setActiveView(view)}
        onOpenGateScanner={() => setIsGateScannerOpen(true)}
        onOpenStandee={() => setIsQRStandeeOpen(true)}
      />

      {/* --- MODALS --- */}

      {/* 4-Step Student Admission & KYC Modal */}
      <StudentAdmissionModal
        branches={branches}
        seats={seats}
        selectedSeatNo={preSelectedSeatNo}
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        onStudentRegistered={handleStudentRegistered}
      />

      {/* Official Double-Sided Student ID Card Modal */}
      {cardModalStudent && (
        <StudentIdCardModal
          student={cardModalStudent}
          branch={branches.find(b => b.id === cardModalStudent.branchId) || activeBranch}
          isOpen={Boolean(cardModalStudent)}
          onClose={() => setCardModalStudent(null)}
        />
      )}

      {/* Fee Payment Receipt & Instant WhatsApp / SMS (MSM) Dispatch Modal */}
      {receiptModalData && (
        <FeeReceiptModal
          student={receiptModalData.student}
          branch={branches.find(b => b.id === receiptModalData.student.branchId) || activeBranch}
          amountPaid={receiptModalData.amount}
          isOpen={Boolean(receiptModalData)}
          onClose={() => setReceiptModalData(null)}
        />
      )}

      {/* UPI QR Standee Modal (Counter Standee view) */}
      <QRStandeeModal
        isOpen={isQRStandeeOpen}
        onClose={() => setIsQRStandeeOpen(false)}
        presetAmount={800}
        studentName={currentStudent?.name}
        seatNo={currentStudent?.seatNo}
      />

      {/* Gate Attendance Kiosk Terminal */}
      <GateScannerModal
        students={students}
        isOpen={isGateScannerOpen}
        onClose={() => setIsGateScannerOpen(false)}
        onPunchStudent={handlePunchAttendance}
      />

      {/* 1-Day Trial Pass Modal */}
      <DayPassModal
        branches={branches}
        isOpen={isDayPassOpen}
        onClose={() => setIsDayPassOpen(false)}
      />
    </div>
  );
}
