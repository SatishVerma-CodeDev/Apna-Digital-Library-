import React, { useState } from 'react';
import { Branch } from '../types';
import { addNotification } from '../services/storage';
import { X, Calendar, CheckCircle2, MessageCircle, Smartphone, Sparkles, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DayPassModalProps {
  branches: Branch[];
  isOpen: boolean;
  onClose: () => void;
}

export const DayPassModal: React.FC<DayPassModalProps> = ({
  branches,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [passDate, setPassDate] = useState(new Date().toISOString().split('T')[0]);
  const [passType, setPassType] = useState<'hourly' | 'daily'>('daily');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const cost = passType === 'daily' ? 70 : 50;
  const branch = branches.find(b => b.id === branchId) || branches[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const confirmationMsg = 
`*APNA LIBRARY - 1-DAY TRIAL STUDY PASS* 🎟️
Dear ${name},
Your 1-Day Trial Pass at ${branch?.name || 'Lanka Branch'} is confirmed for ${passDate}!
Pass Type: ${passType === 'daily' ? 'Full Day Trial (₹70)' : 'Hourly Pass (₹50)'}
Status: CONFIRMED ✅
Please show this message at the front desk counter upon arrival.
Helpline: +91 98765 43210
Address: ${branch?.address || 'Near BHU Gate, Lanka, Varanasi'}`;

    // Record notification
    addNotification({
      studentId: `trial-${Date.now()}`,
      studentName: name,
      phone,
      type: 'WhatsApp',
      category: 'Seat Allocation',
      message: confirmationMsg,
    });

    setIsBooked(true);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
      `Hi! My 1-Day trial pass for Apna Library is booked for ${passDate}. Excited to study!`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Book 1-Day Trial Study Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isBooked ? (
          <form onSubmit={handleBook} className="py-4 space-y-4 text-xs">
            <p className="text-slate-400 leading-relaxed">
              Experience Apna Library's peaceful atmosphere, AC comfort, and 5G WiFi for a full day before committing to a monthly membership!
            </p>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Satish Verma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Mobile Number</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9569343515"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Select Branch</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.village})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Pass Type</label>
                <select
                  value={passType}
                  onChange={e => setPassType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="daily">1-Day Trial (₹70)</option>
                  <option value="hourly">Hourly Pass (₹50)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Visit Date</label>
                <input
                  type="date"
                  value={passDate}
                  onChange={e => setPassDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 font-medium">Trial Pass Fee:</span>
              <span className="text-amber-400 font-extrabold text-base">₹{cost}</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Confirm Trial Pass &amp; Generate QR
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-extrabold text-white">Pass Confirmed!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Dear <strong>{name}</strong>, your 1-Day trial pass for <strong>{passDate}</strong> at {branch?.village} branch is active.
            </p>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-amber-300 font-mono">
              Pass ID: TR-{Date.now().toString().slice(-6)} · Amount: ₹{cost}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Send Pass to WhatsApp
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
