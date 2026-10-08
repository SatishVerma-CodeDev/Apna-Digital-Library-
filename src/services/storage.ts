import { Branch, Seat, Student, Complaint, Notice, AttendanceLog, ForumPost, ForumReply } from '../types';
import { 
  INITIAL_BRANCHES, 
  INITIAL_STUDENTS, 
  generateInitialSeats, 
  INITIAL_NOTICES, 
  INITIAL_COMPLAINTS, 
  INITIAL_FORUM_POSTS, 
  INITIAL_ATTENDANCE_LOGS 
} from '../data/mockData';

const STORAGE_KEYS = {
  BRANCHES: 'apna_library_branches',
  STUDENTS: 'apna_library_students',
  SEATS: 'apna_library_seats',
  COMPLAINTS: 'apna_library_complaints',
  NOTICES: 'apna_library_notices',
  FORUM_POSTS: 'apna_library_forum_posts',
  ATTENDANCE_LOGS: 'apna_library_attendance_logs',
  CURRENT_USER_ID: 'apna_library_current_user_id',
  IS_ADMIN: 'apna_library_is_admin',
  NOTIFICATION_HISTORY: 'apna_library_notifications',
};

export interface NotificationRecord {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  type: 'WhatsApp' | 'SMS';
  category: 'Fee Payment Confirmation' | 'Fee Due Reminder' | 'Seat Allocation' | 'Notice Broadcast';
  message: string;
  timestamp: string;
  status: 'Sent' | 'Delivered';
}

export function loadBranches(): Branch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load branches', e);
  }
  localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
  return INITIAL_BRANCHES;
}

export function saveBranches(branches: Branch[]) {
  localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students', e);
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function loadSeats(): Seat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load seats', e);
  }
  const initial = generateInitialSeats();
  localStorage.setItem(STORAGE_KEYS.SEATS, JSON.stringify(initial));
  return initial;
}

export function saveSeats(seats: Seat[]) {
  localStorage.setItem(STORAGE_KEYS.SEATS, JSON.stringify(seats));
}

export function loadComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load complaints', e);
  }
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
}

export function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
}

export function loadNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notices', e);
  }
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  return INITIAL_NOTICES;
}

export function saveNotices(notices: Notice[]) {
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
}

export function loadForumPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FORUM_POSTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load forum posts', e);
  }
  localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(INITIAL_FORUM_POSTS));
  return INITIAL_FORUM_POSTS;
}

export function saveForumPosts(posts: ForumPost[]) {
  localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
}

export function loadAttendanceLogs(): AttendanceLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load attendance logs', e);
  }
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_LOGS, JSON.stringify(INITIAL_ATTENDANCE_LOGS));
  return INITIAL_ATTENDANCE_LOGS;
}

export function saveAttendanceLogs(logs: AttendanceLog[]) {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_LOGS, JSON.stringify(logs));
}

export function loadNotifications(): NotificationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return [];
}

export function saveNotifications(notes: NotificationRecord[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(notes));
}

export function addNotification(note: Omit<NotificationRecord, 'id' | 'timestamp' | 'status'>) {
  const all = loadNotifications();
  const newRecord: NotificationRecord = {
    ...note,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Delivered',
  };
  saveNotifications([newRecord, ...all]);
  return newRecord;
}
