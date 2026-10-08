import React, { useState } from 'react';
import { Branch, Seat, Student, ShiftType } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  X, Check, ChevronRight, ChevronLeft, User, Phone, MapPin, 
  BookOpen, CreditCard, Camera, Upload, Sparkles, AlertCircle, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentAdmissionModalProps {
  branches: Branch[];
  seats: Seat[];
  selectedSeatNo?: string;
  isOpen: boolean;
  onClose: () => void;
  onStudentRegistered: (newStudent: Student, paymentAmount: number) => void;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  branches,
  seats,
  selectedSeatNo,
  isOpen,
  onClose,
  onStudentRegistered,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    fatherName: '',
    motherName: '',
    dob: '2002-05-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    aadhaar: '',

    // Step 2: Contact
    phone: '',
    otpVerified: false,
    otpCode: '',
    showOtpInput: false,
    altPhone: '',
    email: '',
    sameAsWhatsApp: true,
    whatsapp: '',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: 'Lanka',
    pincode: '221005',
    fullAddress: '',

    // Step 3: Library Details
    course: 'UPSC CSE',
    branchId: branches[0]?.id || 'br-vns-lanka',
    seatNo: selectedSeatNo || 'A18',
    shift: 'morning' as ShiftType,
    joiningDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Step 4: Fees
    monthlyFee: 800,
    admissionFee: 200,
    includeLocker: false,
    lockerFee: 150,
    amountPaying: 1000,
    paymentMode: 'UPI' as 'UPI' | 'Cash' | 'Netbanking',
    transactionId: '',
    screenshotUploaded: false,
  });

  const [simulatedCamera, setSimulatedCamera] = useState(false);

  if (!isOpen) return null;

  // Calculate total fees
  const totalFees = formData.monthlyFee + formData.admissionFee + (formData.includeLocker ? formData.lockerFee : 0);
  const remainingDue = Math.max(0, totalFees - formData.amountPaying);

  // Filter available seats for chosen branch
  const availableSeats = seats.filter(
    s => s.branchId === formData.branchId && (!s.isOccupied || s.seatNumber === formData.seatNo)
  );

  const handleSendOtp = () => {
    if (!formData.phone || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setFormData(prev => ({ ...prev, showOtpInput: true }));
    setTimeout(() => {
      alert(`Demo OTP sent to +91 ${formData.phone}: 4829`);
    }, 400);
  };

  const handleVerifyOtp = () => {
    if (formData.otpCode === '4829' || formData.otpCode.length >= 4) {
      setFormData(prev => ({ ...prev, otpVerified: true, showOtpInput: false }));
    } else {
      alert('Invalid OTP. Please enter 4829');
    }
  };

  const handleCameraSnap = () => {
    // Cycle high quality student avatars
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    ];
    const nextAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setFormData(prev => ({ ...prev, photo: nextAvatar }));
    setSimulatedCamera(false);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.fatherName.trim()) {
        alert("Please enter Student Full Name and Father's Name");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.phone.trim() || !formData.email.trim()) {
        alert('Please provide mobile number and email ID');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.seatNo) {
        alert('Please select a seat');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newIdCardNo = `APL-VNS-${randomNum}`;
    const newStudentId = `std-${Date.now()}`;

    const newStudent: Student = {
      id: newStudentId,
      idCardNo: newIdCardNo,
      name: formData.name,
      fatherName: formData.fatherName,
      motherName: formData.motherName || undefined,
      dob: formData.dob,
      gender: formData.gender,
      photo: formData.photo,
      aadhaar: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : undefined,

      phone: formData.phone,
      altPhone: formData.altPhone || formData.phone,
      email: formData.email,
      whatsapp: formData.sameAsWhatsApp ? formData.phone : formData.whatsapp,

      state: formData.state,
      district: formData.district,
      village: formData.village,
      pincode: formData.pincode,
      fullAddress: formData.fullAddress || `${formData.village}, ${formData.district}, ${formData.state}`,

      course: formData.course,
      branchId: formData.branchId,
      seatNo: formData.seatNo,
      shift: formData.shift,
      joiningDate: formData.joiningDate,
      expiryDate: formData.expiryDate,

      feesTotal: totalFees,
      feesPaid: formData.amountPaying,
      feesPending: remainingDue,
      dueDate: formData.expiryDate,
      paymentMode: formData.paymentMode,
      transactionId: formData.transactionId || `UPI-${Date.now().toString().slice(-6)}`,
      paymentStatus: remainingDue === 0 ? 'Paid' : 'Due',

      attendanceRate: 100,
      totalHoursStudied: 0,
      studyStreak: 1,
      points: 100, // +100 Welcome Points!
      badges: ['master-disciplinarian'],
      referralsCount: 0,
      isCheckedIn: false,
    };

    // Confetti Celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // ignore
    }

    onStudentRegistered(newStudent, formData.amountPaying);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">New Student Admission & KYC</h3>
            </div>
            <p className="text-xs text-slate-400">
              Complete student onboarding with Father's Name record, seat lock & instant digital receipt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="py-4 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className={step >= 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              1. Personal Details
            </span>
            <span className={step >= 2 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              2. Contact & Address
            </span>
            <span className={step >= 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              3. Library & Seat
            </span>
            <span className={step >= 4 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
              4. Fees & UPI
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-400/60 shrink-0">
                  <img src={formData.photo} alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-slate-300">Student Profile Photo</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCameraSnap}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      Capture / Switch Photo
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    High resolution photo used for the PVC Student ID Card.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Student Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satish Verma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-300 mb-1">
                    Father's Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="e.g. Ramesh Verma"
                    className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mother's Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="e.g. Shanti Devi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date of Birth <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gender <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Aadhaar Number (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.aadhaar}
                    onChange={e => setFormData({ ...formData, aadhaar: e.target.value })}
                    placeholder="12 digit Aadhaar number"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT & ADDRESS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Student Mobile Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    {!formData.otpVerified ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shrink-0 cursor-pointer"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shrink-0">
                        <Check className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  {formData.showOtpInput && !formData.otpVerified && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4829"
                        value={formData.otpCode}
                        onChange={e => setFormData({ ...formData, otpCode: e.target.value })}
                        className="w-28 px-3 py-1.5 bg-slate-950 border border-amber-400 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alternate / Father's Mobile Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.altPhone}
                    onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                    placeholder="Father/Guardian phone"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.sameAsWhatsApp ? formData.phone : formData.whatsapp}
                    disabled={formData.sameAsWhatsApp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="WhatsApp mobile"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono disabled:opacity-60"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sameAsWhatsApp}
                      onChange={e => setFormData({ ...formData, sameAsWhatsApp: e.target.checked })}
                      className="rounded accent-amber-400"
                    />
                    Same as mobile number
                  </label>
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Permanent Address (State &gt; District &gt; Village/Area)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Village / Area</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Complete Street Address / House No.
                  </label>
                  <input
                    type="text"
                    value={formData.fullAddress}
                    onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
                    placeholder="e.g. Plot 14, Near BHU Gate Road, Lanka, Varanasi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LIBRARY & SEAT ALLOCATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Select Branch <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.village}, {b.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Competitive Course / Exam
                  </label>
                  <select
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="UPSC CSE">UPSC CSE (Civil Services)</option>
                    <option value="UPPCS / State PSC">UPPCS / State PSC</option>
                    <option value="NEET UG">NEET UG (Medical)</option>
                    <option value="IIT-JEE">IIT-JEE (Advanced/Mains)</option>
                    <option value="SSC CGL">SSC CGL / CHSL</option>
                    <option value="Banking PO / Clerk">Banking PO / Clerk</option>
                    <option value="GATE / ESE">GATE / ESE</option>
                    <option value="College Degree / Research">College Degree / Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Select Study Shift <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.shift}
                    onChange={e => {
                      const sh = e.target.value as ShiftType;
                      const fee = sh === 'fullday' ? 1200 : 800;
                      setFormData({ ...formData, shift: sh, monthlyFee: fee, amountPaying: fee + formData.admissionFee });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="morning">Morning Shift (6:00 AM - 2:00 PM) - ₹800/mo</option>
                    <option value="evening">Evening Shift (2:00 PM - 10:00 PM) - ₹800/mo</option>
                    <option value="fullday">Full Day Shift (6:00 AM - 10:00 PM) - ₹1200/mo</option>
                    <option value="night">Night Owl Shift (10:00 PM - 6:00 AM) - ₹800/mo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-300 mb-1">
                    Seat Number Allocation <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.seatNo}
                    onChange={e => setFormData({ ...formData, seatNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    {availableSeats.map(s => (
                      <option key={s.id} value={s.seatNumber}>
                        Seat {s.seatNumber} (Row {s.row}) - Available
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Validity / Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FEES & DYNAMIC UPI QR PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Fee Breakdown Card */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Monthly Library Seat Fee ({formData.shift.toUpperCase()}):</span>
                  <span className="font-semibold text-white">₹{formData.monthlyFee}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>One-time Admission / ID Card Registration Fee:</span>
                  <span className="font-semibold text-white">₹{formData.admissionFee}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeLocker}
                      onChange={e => setFormData({ ...formData, includeLocker: e.target.checked })}
                      className="rounded accent-amber-400"
                    />
                    Add Dedicated Personal Locker (₹150/mo)
                  </label>
                  {formData.includeLocker && (
                    <span className="font-semibold text-white">+₹{formData.lockerFee}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Admission Fees:</span>
                  <span className="text-amber-400 text-base">₹{totalFees}</span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={e => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  >
                    <option value="UPI">UPI Dynamic QR (GPay, PhonePe, Paytm, Navi)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Netbanking">Netbanking / Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Amount Paying Now (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.amountPaying}
                    onChange={e => setFormData({ ...formData, amountPaying: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-lg text-sm text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Balance Due: <span className="font-bold text-rose-400">₹{remainingDue}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic QR Box */}
              {formData.paymentMode === 'UPI' && (
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-slate-950 rounded-xl border border-amber-500/30 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                    {/* Compact QR code simulation */}
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
                      <rect x="58" y="8" width="6" height="6" />
                      <rect x="42" y="42" width="16" height="16" rx="2" fill="#0F172A" />
                    </svg>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs text-left">
                    <p className="font-bold text-amber-300">
                      Scan to Pay ₹{formData.amountPaying} via UPI
                    </p>
                    <p className="text-slate-300 font-mono text-[11px]">
                      UPI ID: <span className="text-amber-400">8115351183@naviaxis</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      GPay · PhonePe · Paytm · Navi · BHIM
                    </p>
                    <input
                      type="text"
                      placeholder="Enter 12-digit UPI UTR / Transaction ID"
                      value={formData.transactionId}
                      onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Bonus notification note */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Completing admission awards <strong>+100 Study Points</strong> and unlocks your official printable <strong>Student ID Card</strong> + <strong>Instant WhatsApp/SMS Receipt</strong>!
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                Continue to Step {step + 1}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-lg transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Confirm Admission & Issue Receipt
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
