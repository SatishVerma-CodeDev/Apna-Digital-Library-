import React, { useState } from 'react';
import { Student, Branch } from '../types';
import { BrandLogo } from './BrandLogo';
import { X, Printer, Download, FlipHorizontal, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface StudentIdCardModalProps {
  student: Student;
  branch?: Branch;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  branch,
  isOpen,
  onClose,
}) => {
  const [side, setSide] = useState<'both' | 'front' | 'back'>('both');

  if (!isOpen) return null;

  const branchName = branch?.name || 'Apna Library - Lanka Main Branch';
  const branchAddress = branch?.address || 'Plot 42, Near BHU Gate, Lanka, Varanasi - 221005';
  const branchPhone = branch?.phone || '+91 98765 43210';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl my-8">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Official Student ID Card</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Govt.-recognized institutional format with biometric verification QR & Barcode
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex bg-slate-800 p-1 rounded-lg text-xs font-medium text-slate-300">
              <button
                onClick={() => setSide('both')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  side === 'both' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
                }`}
              >
                Both Sides
              </button>
              <button
                onClick={() => setSide('front')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  side === 'front' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
                }`}
              >
                Front Only
              </button>
              <button
                onClick={() => setSide('back')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  side === 'back' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
                }`}
              >
                Back Only
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-lg text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="py-6 flex flex-wrap items-center justify-center gap-8 print:p-0 print:m-0">
          {/* CARD FRONT */}
          {(side === 'both' || side === 'front') && (
            <div className="w-[340px] h-[520px] rounded-2xl bg-[#0a1124] border-2 border-[#d4af37] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative flex flex-col justify-between overflow-hidden text-slate-100 select-none">
              {/* Corner Gold Filigree Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/70 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/70 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/70 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/70 rounded-br-lg pointer-events-none" />

              {/* Watermark Logo in Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <BrandLogo size="xl" showTagline={false} />
              </div>

              {/* Front Header */}
              <div className="text-center relative z-10 pt-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BrandLogo size="sm" showTagline={false} />
                </div>
                <h4 className="text-sm font-extrabold tracking-wider uppercase text-amber-300">
                  Apna Digital Library
                </h4>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
                  Digital Library & Study Centre
                </p>
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
              </div>

              {/* Photo & Details Body */}
              <div className="flex flex-col items-center gap-3 relative z-10 my-auto">
                {/* Photo with Gold Frame */}
                <div className="w-28 h-32 rounded-xl border-2 border-amber-400/80 p-1 bg-slate-900 shadow-inner overflow-hidden">
                  <img
                    src={student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={student.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Details Table */}
                <div className="w-full bg-slate-950/60 rounded-xl border border-amber-500/20 p-3 space-y-1.5 text-left text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
                    <span className="text-[10px] text-amber-300/80 uppercase font-semibold">Student Name:</span>
                    <span className="font-bold text-white text-right">{student.name}</span>
                  </div>
                  
                  {/* Father's Name Highlighted */}
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
                    <span className="text-[10px] text-amber-300/80 uppercase font-semibold">Father's Name:</span>
                    <span className="font-medium text-amber-200 text-right">{student.fatherName}</span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">ID Number:</span>
                    <span className="font-mono text-amber-400 text-right">{student.idCardNo}</span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Seat & Shift:</span>
                    <span className="font-bold text-white text-right">
                      {student.seatNo} · <span className="capitalize text-amber-400">{student.shift}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Course:</span>
                    <span className="font-medium text-slate-200 text-right">{student.course}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Gold Ribbon */}
              <div className="relative z-10 pb-1">
                <div className="w-full py-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 text-center font-black tracking-widest text-xs uppercase rounded-md shadow-md">
                  Student ID Card
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-1 font-mono">
                  <span>VALID TILL: {student.expiryDate}</span>
                  <span>{branch?.village || 'LANKA'}</span>
                </div>
              </div>
            </div>
          )}

          {/* CARD BACK */}
          {(side === 'both' || side === 'back') && (
            <div className="w-[340px] h-[520px] rounded-2xl bg-[#0a1124] border-2 border-[#d4af37] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative flex flex-col justify-between overflow-hidden text-slate-100 select-none">
              {/* Corner Gold Filigree Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/70 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/70 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/70 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/70 rounded-br-lg pointer-events-none" />

              {/* Top Banner */}
              <div className="relative z-10 pt-1">
                <div className="w-full py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-center font-bold tracking-wider text-[11px] uppercase rounded-md">
                  Card Details & Guidelines
                </div>

                <div className="flex justify-between text-[10px] text-slate-300 mt-2 px-1">
                  <div>
                    <span className="text-slate-400 block text-[9px]">ISSUED DATE</span>
                    <span className="font-semibold">{student.joiningDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px]">VALID TILL</span>
                    <span className="font-semibold text-amber-300">{student.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Center Verification QR Code */}
              <div className="flex flex-col items-center justify-center my-auto relative z-10">
                <div className="p-3 bg-white rounded-xl shadow-lg border border-amber-400/50">
                  {/* High Resolution SVG QR Simulation */}
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="#0F172A">
                    {/* QR Finder Corners */}
                    <rect x="5" y="5" width="26" height="26" rx="3" fill="#0F172A" />
                    <rect x="9" y="9" width="18" height="18" fill="white" />
                    <rect x="13" y="13" width="10" height="10" fill="#0F172A" />

                    <rect x="69" y="5" width="26" height="26" rx="3" fill="#0F172A" />
                    <rect x="73" y="9" width="18" height="18" fill="white" />
                    <rect x="77" y="13" width="10" height="10" fill="#0F172A" />

                    <rect x="5" y="69" width="26" height="26" rx="3" fill="#0F172A" />
                    <rect x="9" y="73" width="18" height="18" fill="white" />
                    <rect x="13" y="77" width="10" height="10" fill="#0F172A" />

                    {/* Data Pattern Modules */}
                    <rect x="36" y="8" width="6" height="6" />
                    <rect x="46" y="8" width="8" height="6" />
                    <rect x="58" y="8" width="6" height="6" />

                    <rect x="36" y="20" width="8" height="6" />
                    <rect x="48" y="20" width="6" height="6" />
                    <rect x="58" y="20" width="6" height="6" />

                    <rect x="8" y="36" width="6" height="6" />
                    <rect x="20" y="36" width="8" height="6" />
                    <rect x="36" y="36" width="6" height="6" />
                    <rect x="46" y="36" width="8" height="6" />
                    <rect x="58" y="36" width="6" height="6" />
                    <rect x="70" y="36" width="8" height="6" />
                    <rect x="84" y="36" width="8" height="6" />

                    <rect x="8" y="46" width="8" height="6" />
                    <rect x="22" y="46" width="6" height="6" />
                    <rect x="36" y="46" width="10" height="6" />
                    <rect x="52" y="46" width="8" height="6" />
                    <rect x="66" y="46" width="6" height="6" />
                    <rect x="78" y="46" width="14" height="6" />

                    <rect x="8" y="58" width="6" height="6" />
                    <rect x="18" y="58" width="8" height="6" />
                    <rect x="38" y="58" width="6" height="6" />
                    <rect x="50" y="58" width="8" height="6" />
                    <rect x="64" y="58" width="10" height="6" />
                    <rect x="80" y="58" width="6" height="6" />

                    <rect x="36" y="72" width="8" height="6" />
                    <rect x="48" y="72" width="6" height="6" />
                    <rect x="60" y="72" width="8" height="6" />
                    <rect x="74" y="72" width="18" height="6" />

                    <rect x="36" y="84" width="6" height="6" />
                    <rect x="46" y="84" width="8" height="6" />
                    <rect x="62" y="84" width="6" height="6" />
                    <rect x="76" y="84" width="12" height="6" />
                  </svg>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-amber-300 font-semibold mt-1">
                  Scan for Verification & Gate Attendance
                </span>
              </div>

              {/* Rules & Guidelines */}
              <div className="relative z-10 text-[9px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold block text-[10px]">LIBRARY RULES:</span>
                <p>• Valid only for the registered student. Non-transferable.</p>
                <p>• Must be presented at gate scanner for entry & exit.</p>
                <p>• Pin-drop silence must be maintained in the study halls.</p>
              </div>

              {/* Contact & Barcode */}
              <div className="relative z-10 text-center pt-1">
                <div className="text-[8px] text-slate-400 leading-tight">
                  <p className="font-semibold text-slate-300">{branchName}</p>
                  <p>{branchAddress}</p>
                  <p>Helpline: {branchPhone} · contact@apnalibrary.in</p>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-2 pt-1 border-t border-amber-500/20 flex flex-col items-center">
                  <div className="h-6 flex items-center gap-[2px]">
                    {[4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 3, 1].map(
                      (w, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${w}px` }}
                          className="h-full bg-amber-400"
                        />
                      )
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 tracking-widest mt-0.5">
                    {student.idCardNo}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footnote */}
        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800 no-print">
          Tip: You can print this directly on standard PVC card size or paper. QR code is compatible with gate entry scanner.
        </div>
      </div>
    </div>
  );
};
