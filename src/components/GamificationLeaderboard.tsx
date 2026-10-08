import React, { useState } from 'react';
import { Student, BadgeDefinition } from '../types';
import { BADGE_DEFINITIONS } from '../data/mockData';
import { 
  Trophy, Award, Flame, Users, Share2, Copy, Check, 
  Sparkles, Star, ShieldCheck, Sun, Moon, ArrowUpRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamificationLeaderboardProps {
  students: Student[];
  currentStudent?: Student | null;
  onInviteFriend?: () => void;
}

export const GamificationLeaderboard: React.FC<GamificationLeaderboardProps> = ({
  students,
  currentStudent,
  onInviteFriend,
}) => {
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Sort students descending by points
  const sortedStudents = [...students].sort((a, b) => b.points - a.points).slice(0, 10);

  const referralCode = currentStudent ? `APNA-${currentStudent.idCardNo.split('-').pop()}` : 'APNA-VIP';
  const referralLink = `https://apnalibrary.in/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleShareWhatsAppReferral = () => {
    const text = `Join me at Apna Library (Lanka, Varanasi)! Best AC study hall with 5G WiFi & reserved desks. Use my referral link to get ₹100 off your first month: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-purple-400" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      default:
        return <Star className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div id="leaderboard-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Gamified Study Motivation System</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Top 10 Scholar Hall of Fame
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Earn points through consistent attendance streaks, zero-due fee discipline, and inviting sincere fellow aspirants.
        </p>
      </div>

      {/* HOW TO EARN POINTS PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Timely Fee Payment</p>
            <p className="text-sm font-bold text-white">+100 Points</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Study Session / Streak</p>
            <p className="text-sm font-bold text-white">+10 Pts / Day</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Friend Referral</p>
            <p className="text-sm font-bold text-white">+150 Points</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Forum Solution</p>
            <p className="text-sm font-bold text-white">+25 Points</p>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {sortedStudents.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end max-w-4xl mx-auto">
          {/* 2nd Place */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 text-center order-2 md:order-1 shadow-xl">
            <div className="w-8 h-8 rounded-full bg-slate-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow">
              2
            </div>
            <img
              src={sortedStudents[1].photo}
              alt={sortedStudents[1].name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-slate-400 shadow-md"
            />
            <h4 className="font-bold text-white text-base">{sortedStudents[1].name}</h4>
            <p className="text-xs text-slate-400">Desk {sortedStudents[1].seatNo} · {sortedStudents[1].course}</p>
            <div className="mt-3 py-1.5 px-3 bg-slate-800 rounded-xl text-slate-200 font-extrabold text-sm">
              {sortedStudents[1].points} Pts
            </div>
          </div>

          {/* 1st Place - Gold Champion */}
          <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-400 rounded-3xl p-8 text-center order-1 md:order-2 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-lg">
              👑 RANK 1
            </div>
            <img
              src={sortedStudents[0].photo}
              alt={sortedStudents[0].name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-amber-400 shadow-xl"
            />
            <h4 className="font-extrabold text-white text-lg">{sortedStudents[0].name}</h4>
            <p className="text-xs text-amber-300 font-medium">
              Desk {sortedStudents[0].seatNo} · {sortedStudents[0].course}
            </p>
            <div className="mt-3 py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-slate-950 font-black text-base shadow-md">
              {sortedStudents[0].points} Points
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{sortedStudents[0].studyStreak}-Day Streak</span>
            </p>
          </div>

          {/* 3rd Place */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 text-center order-3 shadow-xl">
            <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow">
              3
            </div>
            <img
              src={sortedStudents[2].photo}
              alt={sortedStudents[2].name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-amber-600 shadow-md"
            />
            <h4 className="font-bold text-white text-base">{sortedStudents[2].name}</h4>
            <p className="text-xs text-slate-400">Desk {sortedStudents[2].seatNo} · {sortedStudents[2].course}</p>
            <div className="mt-3 py-1.5 px-3 bg-slate-800 rounded-xl text-slate-200 font-extrabold text-sm">
              {sortedStudents[2].points} Pts
            </div>
          </div>
        </div>
      )}

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-12">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Top 10 Active Study Champions
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Updated in real-time with gate punch logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Desk & Shift</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Study Streak</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sortedStudents.map((s, index) => {
                const isCurrent = currentStudent?.id === s.id;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isCurrent ? 'bg-amber-400/10 font-bold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                        index === 0
                          ? 'bg-amber-400 text-slate-950'
                          : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-400 font-mono'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.photo}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{s.idCardNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-amber-300">{s.seatNo}</span>
                      <span className="text-slate-500 capitalize"> · {s.shift}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">{s.course}</td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        {s.studyStreak} Days
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        {s.badges.map(bId => {
                          const badge = BADGE_DEFINITIONS.find(b => b.id === bId);
                          return (
                            <span
                              key={bId}
                              title={badge?.name}
                              className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700 text-amber-400"
                            >
                              {badge ? getBadgeIcon(badge.icon) : '★'}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-amber-400 text-sm">
                        {s.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BADGE SHOWCASE & REFERRAL INVITATION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Badges Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Achievements & Badge System
            </h3>
            <span className="text-xs text-slate-400">Unlock by studying consistently</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGE_DEFINITIONS.map(badge => (
              <div
                key={badge.id}
                className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-amber-400">
                    +{badge.pointsRequired} Points Requirement
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Refer a Study Partner</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Earn 150 Points + Top Referrer Badge
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Invite friends to join Apna Library. When they book a seat, they get ₹100 admission discount, and you earn 150 scholar points!
          </p>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-amber-300 truncate">{referralLink}</span>
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 cursor-pointer"
              title="Copy link"
            >
              {copiedReferral ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleShareWhatsAppReferral}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {copiedReferral ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
