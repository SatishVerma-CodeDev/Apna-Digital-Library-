export type ShiftType = 'morning' | 'evening' | 'fullday' | 'night';

export interface Branch {
  id: string;
  name: string;
  state: string;
  district: string;
  village: string; // Village / Area / Colony
  address: string;
  lat: number;
  lng: number;
  totalSeats: number;
  occupiedSeats: number;
  rating: number;
  phone: string;
  facilities: string[];
  monthlyPrice: number;
  image: string;
}

export interface Seat {
  id: string;
  seatNumber: string; // e.g. A1, A2, B12
  row: string; // A, B, C, D
  branchId: string;
  isOccupied: boolean;
  studentId?: string;
  studentName?: string;
  studentFatherName?: string;
  studentPhoto?: string;
  shift?: ShiftType;
  hasSocket: boolean;
  isCorner: boolean;
}

export interface Student {
  id: string;
  idCardNo: string; // APL-VNS-001
  name: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  photo: string;
  aadhaar?: string;
  
  phone: string;
  altPhone: string;
  email: string;
  whatsapp: string;
  
  state: string;
  district: string;
  village: string;
  pincode: string;
  fullAddress: string;
  
  course: string; // UPSC, NEET, IIT-JEE, SSC, etc.
  branchId: string;
  seatNo: string;
  shift: ShiftType;
  joiningDate: string;
  expiryDate: string;
  
  feesTotal: number;
  feesPaid: number;
  feesPending: number;
  dueDate: string;
  paymentMode: 'UPI' | 'Cash' | 'Netbanking';
  transactionId?: string;
  paymentScreenshot?: string;
  paymentStatus: 'Paid' | 'Pending Verification' | 'Due';
  
  attendanceRate: number; // e.g. 92%
  totalHoursStudied: number;
  studyStreak: number; // days
  points: number;
  badges: string[];
  referralsCount: number;
  isCheckedIn: boolean;
  lastCheckIn?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  seatNo: string;
  branchId: string;
  category: 'AC / Temperature' | 'Noise / Disturbance' | 'WiFi / Internet' | 'Cleanliness' | 'Seat / Chair' | 'Other';
  description: string;
  isAnonymous: boolean;
  date: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  adminReply?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Holiday' | 'Exam Alert' | 'Maintenance' | 'Offer' | 'General';
  content: string;
  date: string;
  pdfAttachment?: string;
  broadcastToWhatsApp: boolean;
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  seatNo: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hours: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'UPSC CSE' | 'NEET UG' | 'IIT-JEE' | 'SSC & Banking' | 'Study Tips & Resources' | 'Library Feedback';
  authorId: string;
  authorName: string;
  authorSeat: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  replies: ForumReply[];
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: 'Student' | 'Admin';
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  color: string;
}
