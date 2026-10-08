import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Sparkles, Search, ArrowRight, ShieldCheck, Wifi, Wind, 
  Coffee, Lock, Camera, Zap, Users, Star, MessageCircle, Calendar 
} from 'lucide-react';

interface HeroProps {
  onExploreSeats: () => void;
  onFindBranches: () => void;
  onOpenAdmission: () => void;
  onOpenTrialPass: () => void;
  onOpenQRStandee: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreSeats,
  onFindBranches,
  onOpenAdmission,
  onOpenTrialPass,
  onOpenQRStandee,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-300 tracking-wide">
              Varanasi's #1 Quiet Digital Study Library · Near BHU Gate, Lanka
            </span>
          </div>
        </div>

        {/* Main Title & Tagline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Your Peaceful Place to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Study &amp; Succeed
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience laser-focused study sessions with chilled inverter AC, high-speed 5G WiFi, ergonomic mesh chairs, biometric gate pass, and a vibrant community of UPSC, NEET &amp; JEE scholars.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenAdmission}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Book Your Seat Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreSeats}
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm border border-slate-700 shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Live 80-Seat Map</span>
            </button>

            <button
              onClick={onOpenTrialPass}
              className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold rounded-xl text-sm border border-amber-500/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>1-Day Trial (₹70)</span>
            </button>

            <button
              onClick={onOpenQRStandee}
              className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm border border-slate-700 transition-all cursor-pointer"
              title="Counter QR Standee"
            >
              UPI Standee
            </button>
          </div>
        </div>

        {/* HERO IMAGE SHOWCASE - Matching interior uploaded photo IMG-20261008-WA6501.jpg */}
        <div className="mt-12 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=85"
            alt="Apna Library Interior Study Hall"
            className="w-full h-[380px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Floating Badges on Image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-amber-400/30 text-left">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Apna Library · Lanka Main Branch
              </p>
              <p className="text-white font-extrabold text-sm sm:text-base mt-0.5">
                Soundproof Study Pods &amp; Central Inverter AC
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Plot 42, Near BHU Gate, Lanka Road, Varanasi
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block">Live Desks</span>
                <span className="text-emerald-400 font-black text-sm">32 Available</span>
              </div>
              <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block">Rating</span>
                <span className="text-amber-400 font-black text-sm flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 LIVE STATS COUNTER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-amber-400 font-mono">80</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Total Reserved Desks</p>
            <p className="text-[11px] text-slate-500 mt-0.5">In Lanka Branch</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-white font-mono">500+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Active Scholars</p>
            <p className="text-[11px] text-slate-500 mt-0.5">UPSC, NEET &amp; JEE</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-emerald-400 font-mono">300 Mbps</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">5G Symmetrical Fiber</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Dual-line redundant WiFi</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-amber-400 font-mono">24x7</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Peaceful Environment</p>
            <p className="text-[11px] text-slate-500 mt-0.5">CCTV &amp; biometric pass</p>
          </div>
        </div>

        {/* FACILITIES SHOWCASE GRID */}
        <div className="mt-16 pt-12 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-white">
              Engineered For Deep Work &amp; Top Exam Ranks
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Every single amenity is designed so you can sit undisturbed for 10-12 hours comfortably.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Chilled Inverter AC</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Maintained at optimal 24°C all day long</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">5G Optical WiFi</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">High-speed lag-free video lectures</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Desk Power Socket</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Universal 6A plug at every single desk</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">RO Alkaline Water</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Pure chilled &amp; normal mineral water</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Personal Lockers</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Keep bulky books &amp; notes safely</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">24/7 CCTV &amp; Security</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Complete safety for female students</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mesh Ergonomic Chairs</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Zero lower back pain during long study</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">WhatsApp Notices</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct channel for test series &amp; alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
