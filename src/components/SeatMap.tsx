import React, { useState } from 'react';
import { Seat, Branch, ShiftType, Student } from '../types';
import { 
  Check, Lock, Zap, Clock, User, Shield, Info, Sparkles, Filter 
} from 'lucide-react';

interface SeatMapProps {
  branch: Branch;
  seats: Seat[];
  currentStudent?: Student | null;
  isAdmin?: boolean;
  onSelectSeatToBook: (seatNo: string) => void;
  onToggleOccupancy?: (seatId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  branch,
  seats,
  currentStudent,
  isAdmin = false,
  onSelectSeatToBook,
  onToggleOccupancy,
}) => {
  const [selectedShift, setSelectedShift] = useState<ShiftType | 'all'>('all');
  const [activeSeat, setActiveSeat] = useState<Seat | null>(null);
  const [privacyEnabled, setPrivacyEnabled] = useState<boolean>(!isAdmin);

  const branchSeats = seats.filter(s => s.branchId === branch.id);

  // Group by rows A, B, C, D
  const rows = ['A', 'B', 'C', 'D'];

  const getSeatStatus = (seat: Seat) => {
    if (currentStudent && currentStudent.seatNo === seat.seatNumber) {
      return 'my-seat';
    }
    if (seat.isOccupied) {
      return 'occupied';
    }
    return 'available';
  };

  const getMaskedName = (fullName?: string) => {
    if (!fullName) return 'Occupied';
    if (!privacyEnabled || isAdmin) return fullName;
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return parts[0];
  };

  return (
    <div id="seat-map-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Floor Plan · {branch.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interactive 80-Seat Live Visual Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any desk to view power socket info, AC position, occupant details, or book instantly.
            </p>
          </div>

          {/* Shift Filter & Privacy Switch */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedShift('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedShift === 'all' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Shifts
              </button>
              <button
                onClick={() => setSelectedShift('morning')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedShift === 'morning' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Morning (6-2)
              </button>
              <button
                onClick={() => setSelectedShift('evening')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedShift === 'evening' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Evening (2-10)
              </button>
              <button
                onClick={() => setSelectedShift('fullday')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedShift === 'fullday' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Day
              </button>
            </div>

            {/* Privacy toggle */}
            <button
              onClick={() => setPrivacyEnabled(!privacyEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                privacyEnabled
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{privacyEnabled ? 'Privacy Mode: ON' : 'Full Names: ON'}</span>
            </button>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span>Green: Available Free</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-600 border border-rose-500" />
              <span>Red: Occupied / Active</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-400 border border-amber-300 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                ★
              </span>
              <span>Yellow: Your Reserved Seat</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Total Desks: <strong className="text-white">80</strong> · Available Now: <strong className="text-emerald-400">{branch.totalSeats - branch.occupiedSeats}</strong>
          </div>
        </div>
      </div>

      {/* SEAT GRID LAYOUT - 4 ROWS (A, B, C, D) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-x-auto">
        {/* Front Stage / AC Duct Indicator */}
        <div className="w-full max-w-2xl mx-auto mb-8 bg-slate-950 border border-amber-500/20 rounded-xl py-2 px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            FRONT RECEPTION · CENTRAL INVERTER AC DUCT · SILENCE ZONE
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-6 min-w-[760px]">
          {rows.map(rowLetter => {
            const rowSeats = branchSeats.filter(s => s.row === rowLetter);

            return (
              <div key={rowLetter} className="flex items-center gap-4">
                {/* Row Identifier */}
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 font-extrabold text-lg shrink-0 shadow-md">
                  {rowLetter}
                </div>

                {/* Desks in this row (20 desks per row) */}
                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 sm:gap-2 flex-1">
                  {rowSeats.map(seat => {
                    const status = getSeatStatus(seat);

                    let bgClass = 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-400 text-white shadow-sm';
                    if (status === 'occupied') {
                      bgClass = 'bg-rose-700/80 hover:bg-rose-600 border-rose-500 text-rose-100';
                    } else if (status === 'my-seat') {
                      bgClass = 'bg-amber-400 hover:bg-amber-300 border-white text-slate-950 font-black shadow-lg ring-2 ring-amber-400/50';
                    }

                    return (
                      <button
                        key={seat.id}
                        onClick={() => setActiveSeat(seat)}
                        className={`group relative h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${bgClass}`}
                        title={`Seat ${seat.seatNumber} (${status})`}
                      >
                        <span className="text-[11px] font-bold tracking-tight">
                          {seat.seatNumber}
                        </span>

                        <div className="flex items-center gap-0.5 mt-0.5">
                          {seat.hasSocket && (
                            <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                          )}
                          {status === 'my-seat' && (
                            <span className="text-[9px]">★</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Entry Gate Indicator */}
        <div className="w-full max-w-2xl mx-auto mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>🚪 Entrance & QR Gate Scanner</span>
          <span>💧 RO Alkaline Water Dispenser & Lockers</span>
          <span>🚻 Washroom & Refreshment Balcony</span>
        </div>
      </div>

      {/* SEAT DETAILS MODAL / INSPECTOR */}
      {activeSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  Desk {activeSeat.seatNumber} (Row {activeSeat.row})
                </h3>
              </div>
              <button
                onClick={() => setActiveSeat(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold px-2.5 py-1 rounded-md ${
                  activeSeat.isOccupied
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {activeSeat.isOccupied ? 'Occupied / In Use' : 'Available for Booking'}
                </span>
              </div>

              {activeSeat.isOccupied && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    {activeSeat.studentPhoto && (
                      <img
                        src={activeSeat.studentPhoto}
                        alt="Occupant"
                        className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                      />
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">
                        {getMaskedName(activeSeat.studentName)}
                      </p>
                      {isAdmin && activeSeat.studentFatherName && (
                        <p className="text-amber-300 text-[11px]">
                          Father: {activeSeat.studentFatherName}
                        </p>
                      )}
                      <p className="text-slate-400 text-[11px] capitalize">
                        Shift: {activeSeat.shift || 'Full Day'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Power Socket:</span>
                  <span className="text-emerald-400 font-semibold">Dedicated 6A Universal Plug</span>
                </div>
                <div className="flex justify-between">
                  <span>Desk Type:</span>
                  <span className="text-white font-semibold">Sound-Dampened Wood Partition</span>
                </div>
                <div className="flex justify-between">
                  <span>Chair:</span>
                  <span className="text-white font-semibold">High-Back Ergonomic Breathable Mesh</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Tariff:</span>
                  <span className="text-amber-400 font-bold">₹{branch.monthlyPrice} / Month</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                {!activeSeat.isOccupied ? (
                  <button
                    onClick={() => {
                      onSelectSeatToBook(activeSeat.seatNumber);
                      setActiveSeat(null);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
                  >
                    Book Seat {activeSeat.seatNumber} Now (₹{branch.monthlyPrice}/mo)
                  </button>
                ) : (
                  isAdmin && onToggleOccupancy && (
                    <button
                      onClick={() => {
                        onToggleOccupancy(activeSeat.id);
                        setActiveSeat(null);
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs cursor-pointer"
                    >
                      Admin: Release / Vacate Seat
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
