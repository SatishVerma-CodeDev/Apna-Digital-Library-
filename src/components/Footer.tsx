import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, 
  ShieldCheck, ArrowUp, ExternalLink, Heart 
} from 'lucide-react';

interface FooterProps {
  onOpenStandee: () => void;
  onOpenGateScanner: () => void;
  onOpenTrialPass: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStandee,
  onOpenGateScanner,
  onOpenTrialPass,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Bio (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" showTagline={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Apna Library is Varanasi's premier multi-branch study sanctuary. Designed specifically for serious civil services (UPSC, UPPCS), medical (NEET) and engineering (JEE) aspirants who require pin-drop silence and ergonomic comfort.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://whatsapp.com/channel"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Channel
              </a>

              <button
                onClick={onOpenStandee}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                View Counter Standee
              </button>
            </div>
          </div>

          {/* Col 2: Study Shifts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Shift Timings
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Morning Shift:</strong>
                <p className="text-[11px] text-amber-300">06:00 AM – 02:00 PM (₹800)</p>
              </li>
              <li>
                <strong className="text-slate-200">Evening Shift:</strong>
                <p className="text-[11px] text-amber-300">02:00 PM – 10:00 PM (₹800)</p>
              </li>
              <li>
                <strong className="text-slate-200">Full Day Shift:</strong>
                <p className="text-[11px] text-amber-300">06:00 AM – 10:00 PM (₹1200)</p>
              </li>
              <li>
                <strong className="text-slate-200">Night Owl Shift:</strong>
                <p className="text-[11px] text-amber-300">10:00 PM – 06:00 AM (₹800)</p>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenTrialPass} className="hover:text-amber-400 cursor-pointer">
                  1-Day Trial Booking (₹70)
                </button>
              </li>
              <li>
                <button onClick={onOpenGateScanner} className="hover:text-amber-400 cursor-pointer">
                  Gate Attendance Terminal
                </button>
              </li>
              <li>
                <a href="#branches-section" className="hover:text-amber-400">
                  Find Library by Village
                </a>
              </li>
              <li>
                <a href="#forum-section" className="hover:text-amber-400">
                  Aspirants Community Forum
                </a>
              </li>
              <li>
                <a href="#leaderboard-section" className="hover:text-amber-400">
                  Scholar Points Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Main Branch */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Main Branch &amp; Help
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Plot 42, Near BHU Gate, Lanka Road, Varanasi, UP - 221005</span>
              </p>
              <p className="flex items-center gap-1.5 font-mono text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-1.5 font-mono text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>contact@apnalibrary.in</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                UPI ID: 8115351183@naviaxis
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Apna Library Chain. All Rights Reserved. Designed for high exam success.</p>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">apnalibrary.in</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
