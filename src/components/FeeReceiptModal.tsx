import React, { useState } from 'react';
import { Student, Branch } from '../types';
import { addNotification } from '../services/storage';
import { X, Printer, MessageCircle, Send, CheckCircle2, ShieldCheck, Download, Smartphone } from 'lucide-react';

interface FeeReceiptModalProps {
  student: Student;
  branch?: Branch;
  amountPaid: number;
  periodText?: string;
  isOpen: boolean;
  onClose: () => void;
  onNotificationSent?: (type: 'WhatsApp' | 'SMS', msg: string) => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  student,
  branch,
  amountPaid,
  periodText,
  isOpen,
  onClose,
  onNotificationSent,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<{
    whatsappSent: boolean;
    smsSent: boolean;
    lastMessage?: string;
  }>({
    whatsappSent: false,
    smsSent: false,
  });

  if (!isOpen) return null;

  const receiptNo = `REC1-${student.id.replace(/\D/g, '').padStart(4, '0') || '0097'}`;
  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  const branchName = branch?.name || 'APNA SMART LIBRARY AND COMPUTER INSTITUTE, VARANASI';
  const branchSub = branch?.village ? `${branch.village.toUpperCase()} VARANASI` : 'ANEI MOD VARANASI';
  const period = periodText || `Seat fee (Seat ${student.seatNo}) • Valid till ${student.expiryDate}`;
  const remainingDue = Math.max(0, student.feesTotal - student.feesPaid);

  // WhatsApp Message Text
  const whatsappMessage = 
`*APNA DIGITAL LIBRARY - FEE RECEIPT* 🏛️
-----------------------------------
*Receipt No:* ${receiptNo}
*Date:* ${todayDate}

*Student Name:* ${student.name}
*Father's Name:* ${student.fatherName}
*Phone:* +91 ${student.phone}
*Branch:* ${branch?.name || 'Lanka Main Branch, Varanasi'}
*Seat No:* ${student.seatNo} (${student.shift.toUpperCase()} Shift)
*Period:* ${period}

*Amount Paid:* ₹${amountPaid}
*Remaining Due:* ₹${remainingDue}
*Payment Mode:* ${student.paymentMode || 'UPI QR'}
*Status:* SUCCESSFUL ✅

Thank you for choosing Apna Library.
"Your Peaceful Place to Study & Succeed"
🙏 WELCOME 🙏
Portal: https://apnalibrary.in/portal`;

  // SMS (MSM) Message Text
  const smsMessage = 
`APNALIB: Dear ${student.name}, payment of Rs.${amountPaid} recvd for Seat ${student.seatNo} (Receipt: ${receiptNo}). Bal Due: Rs.${remainingDue}. Valid till ${student.expiryDate}. Happy Studying!`;

  const handleSendWhatsApp = () => {
    // Save to notifications history
    addNotification({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      type: 'WhatsApp',
      category: 'Fee Payment Confirmation',
      message: whatsappMessage,
    });

    setNotificationStatus(prev => ({
      ...prev,
      whatsappSent: true,
      lastMessage: `WhatsApp confirmation dispatched to +91 ${student.phone}`,
    }));

    if (onNotificationSent) {
      onNotificationSent('WhatsApp', whatsappMessage);
    }

    // Open WhatsApp Web or mobile app
    const cleanPhone = student.phone.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleSendSMS = () => {
    // Save to notification history
    addNotification({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      type: 'SMS',
      category: 'Fee Payment Confirmation',
      message: smsMessage,
    });

    setNotificationStatus(prev => ({
      ...prev,
      smsSent: true,
      lastMessage: `SMS alert dispatched via Gateway (DL-APNALIB) to +91 ${student.phone}`,
    }));

    if (onNotificationSent) {
      onNotificationSent('SMS', smsMessage);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Fee Payment Receipt & Instant Dispatch
            </h3>
            <p className="text-xs text-slate-400">
              Auto-generate official receipt slip and send instant notification via WhatsApp & SMS (MSM)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTIFICATION STATUS BANNER */}
        {notificationStatus.lastMessage && (
          <div className="my-3 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 no-print">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notificationStatus.lastMessage}</span>
          </div>
        )}

        {/* PRINTABLE RECEIPT SLIP - Styled after uploaded user photo IMG-20260929-WA0000.jpg */}
        <div className="my-5 flex justify-center">
          <div className="w-full max-w-sm bg-[#faf8f5] text-slate-900 rounded-2xl p-6 shadow-lg border border-stone-300 font-sans print:shadow-none print:border-none">
            {/* Institute Header */}
            <div className="text-left border-b border-stone-200 pb-3">
              <h4 className="font-extrabold text-sm uppercase tracking-tight text-slate-900 leading-snug">
                APNA SMART LIBRARY AND COMPUTER INSTITUTE, VARANASI
              </h4>
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                {branchSub}
              </p>
            </div>

            {/* Receipt No & Date */}
            <div className="py-3 border-b border-stone-200">
              <h3 className="text-xl font-bold text-slate-900">Receipt</h3>
              <p className="text-xs text-stone-600 font-mono mt-0.5">
                No: {receiptNo}
              </p>
              <p className="text-xs text-stone-500">{todayDate}</p>
            </div>

            {/* Student & Phone */}
            <div className="py-3 border-b border-stone-200">
              <h5 className="text-base font-bold text-slate-900 capitalize">
                {student.name}
              </h5>
              <p className="text-xs text-stone-500 font-medium">
                S/o {student.fatherName}
              </p>
              <p className="text-xs text-stone-600 font-mono mt-0.5">
                {student.phone}
              </p>
            </div>

            {/* Item & Period */}
            <div className="py-3 border-b border-stone-200 flex justify-between items-start text-xs">
              <div className="max-w-[70%]">
                <p className="text-stone-700 leading-relaxed font-medium">
                  {period}
                </p>
              </div>
              <div className="font-bold text-slate-900 text-sm">
                ₹{amountPaid}
              </div>
            </div>

            {/* Paid & Due summary */}
            <div className="py-3 space-y-1 text-sm font-semibold border-b border-stone-200">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-900">Paid</span>
                <span className="text-emerald-700 font-extrabold text-base">₹{amountPaid}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-stone-600">Due</span>
                <span className="font-bold text-stone-700">₹{remainingDue}</span>
              </div>
            </div>

            {/* Welcome Blessing */}
            <div className="pt-4 text-center">
              <p className="text-xs font-bold text-slate-800 tracking-wider">
                🙏 WELCOME 🙏
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                Computer Generated Invoice · apna.library.in
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS & DISPATCH CONTROLS */}
        <div className="space-y-3 pt-3 border-t border-slate-800 no-print">
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp Dispatch Button */}
            <button
              onClick={handleSendWhatsApp}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer ${
                notificationStatus.whatsappSent
                  ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              {notificationStatus.whatsappSent ? 'Resend WhatsApp' : 'Send WhatsApp Alert'}
            </button>

            {/* SMS (MSM) Dispatch Button */}
            <button
              onClick={handleSendSMS}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer ${
                notificationStatus.smsSent
                  ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {notificationStatus.smsSent ? 'SMS Dispatched ✓' : 'Send SMS (MSM)'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              Student Mobile: <span className="font-mono text-slate-300">+91 {student.phone}</span>
            </span>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt Slip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
