import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { X, Printer, Copy, CheckCircle, Smartphone, Sparkles } from 'lucide-react';

interface QRStandeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetAmount?: number;
  studentName?: string;
  seatNo?: string;
}

export const QRStandeeModal: React.FC<QRStandeeModalProps> = ({
  isOpen,
  onClose,
  presetAmount = 800,
  studentName,
  seatNo,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number>(presetAmount);

  if (!isOpen) return null;

  const upiId = '8115351183@naviaxis';
  const merchantName = 'Apna Library - Mr Sumit Kumar';

  // Dynamic UPI payment link
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${selectedPlan}&cu=INR&tn=${encodeURIComponent(
    `Apna Library Seat Fee ${seatNo || ''}`
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl my-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Official Front Desk UPI QR Standee
            </h3>
            <p className="text-xs text-slate-400">
              Printable counter standee accepting GPay, PhonePe, Paytm, Navi & all UPI apps
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Standee
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amount Selector (Interactive) */}
        <div className="py-3 flex items-center justify-between gap-2 no-print border-b border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Select Plan / Fee:</span>
          <div className="flex gap-2">
            {[
              { label: 'Day Pass (₹200)', val: 200 },
              { label: 'Monthly (₹800)', val: 800 },
              { label: 'Full Day (₹1200)', val: 1200 },
            ].map(plan => (
              <button
                key={plan.val}
                onClick={() => setSelectedPlan(plan.val)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  selectedPlan === plan.val
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRINTABLE ROLLUP STANDEE - Matches IMG-20261008-WA3211.jpg & IMG-20260928-WA0004.jpg */}
        <div className="py-5 flex justify-center">
          <div className="w-[360px] bg-[#0c1322] border-2 border-[#d4af37] rounded-3xl p-6 shadow-2xl text-slate-100 relative overflow-hidden flex flex-col justify-between">
            {/* Gold Corner Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

            {/* Standee Header */}
            <div className="text-center pt-1">
              <div className="flex justify-center mb-1">
                <BrandLogo size="md" showTagline={false} />
              </div>
              <p className="text-[11px] text-amber-300 font-medium tracking-wide">
                Your Quiet Space • Study • Read • Work
              </p>
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
            </div>

            {/* Title */}
            <div className="text-center my-3">
              <span className="text-[10px] tracking-widest font-black uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                Scan & Pay For Seat Booking
              </span>
            </div>

            {/* Supported App Logos Bar */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl py-2 px-3 mb-3 text-center">
              <p className="text-[10px] text-slate-400 font-semibold mb-1">PAY USING ANY UPI APP</p>
              <div className="flex items-center justify-center gap-3 text-xs font-bold">
                <span className="text-emerald-400">G Pay</span>
                <span className="text-slate-600">·</span>
                <span className="text-indigo-400">PhonePe</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400">Paytm</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-500 font-mono">navi</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-400/60 my-2">
              {/* High Contrast Scalable QR SVG */}
              <svg className="w-44 h-44" viewBox="0 0 100 100" fill="#0c1322">
                {/* 3 Position Detection Patterns */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0c1322" />
                <rect x="9" y="9" width="20" height="20" fill="white" />
                <rect x="13" y="13" width="12" height="12" fill="#0c1322" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0c1322" />
                <rect x="71" y="9" width="20" height="20" fill="white" />
                <rect x="75" y="13" width="12" height="12" fill="#0c1322" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0c1322" />
                <rect x="9" y="71" width="20" height="20" fill="white" />
                <rect x="13" y="75" width="12" height="12" fill="#0c1322" />

                {/* Core Pattern & Center Navi Emblem */}
                <rect x="36" y="8" width="8" height="8" />
                <rect x="48" y="8" width="6" height="8" />
                <rect x="58" y="8" width="6" height="8" />

                <rect x="36" y="20" width="8" height="8" />
                <rect x="48" y="20" width="6" height="8" />
                <rect x="58" y="20" width="6" height="8" />

                <rect x="8" y="38" width="8" height="8" />
                <rect x="20" y="38" width="12" height="8" />
                <rect x="36" y="38" width="8" height="8" />
                <rect x="48" y="38" width="8" height="8" />
                <rect x="60" y="38" width="6" height="8" />
                <rect x="70" y="38" width="10" height="8" />
                <rect x="84" y="38" width="8" height="8" />

                {/* Center Square */}
                <rect x="40" y="40" width="20" height="20" rx="3" fill="#0c1322" />
                <text x="50" y="54" fontSize="10" fontWeight="900" fill="#FBBF24" textAnchor="middle">
                  ₹
                </text>

                <rect x="8" y="50" width="10" height="8" />
                <rect x="22" y="50" width="8" height="8" />
                <rect x="64" y="50" width="8" height="8" />
                <rect x="76" y="50" width="16" height="8" />

                <rect x="36" y="64" width="8" height="8" />
                <rect x="48" y="64" width="8" height="8" />
                <rect x="60" y="64" width="8" height="8" />
                <rect x="72" y="64" width="20" height="8" />

                <rect x="36" y="76" width="10" height="8" />
                <rect x="50" y="76" width="8" height="8" />
                <rect x="62" y="76" width="8" height="8" />
                <rect x="74" y="76" width="18" height="8" />

                <rect x="36" y="88" width="6" height="6" />
                <rect x="46" y="88" width="12" height="6" />
                <rect x="62" y="88" width="8" height="6" />
                <rect x="74" y="88" width="18" height="6" />
              </svg>

              <div className="text-center mt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Amount: ₹{selectedPlan}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  UPI ID: {upiId}
                </span>
              </div>
            </div>

            {/* UPI ID copy pill */}
            <div className="flex items-center justify-between bg-slate-950/80 border border-amber-500/30 rounded-xl px-3 py-2 mt-2">
              <span className="text-xs font-mono text-amber-300">{upiId}</span>
              <button
                onClick={handleCopyUpi}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* How It Works 3-Steps */}
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 mt-3 text-[10px] text-slate-300 space-y-1">
              <p className="font-bold text-amber-300 uppercase tracking-wider text-[9px] mb-1">
                How It Works:
              </p>
              <p>1. Scan QR code using any UPI app</p>
              <p>2. Enter ₹{selectedPlan} & pay securely</p>
              <p>3. Show transaction screenshot at front desk</p>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 text-[9px] text-slate-400">
              <p className="font-semibold text-slate-300">
                Contact: +91 98765 43210 · Open Daily: 6:00 AM - 10:00 PM
              </p>
              <p className="text-amber-400 font-medium mt-0.5">www.apnalibrary.in</p>
            </div>
          </div>
        </div>

        {/* Direct Mobile UPI App trigger */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center no-print">
          <span className="text-xs text-slate-400">
            Scanning on phone? Open directly:
          </span>
          <a
            href={upiLink}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            Open in UPI App
          </a>
        </div>
      </div>
    </div>
  );
};
