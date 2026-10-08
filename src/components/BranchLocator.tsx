import React, { useState, useMemo } from 'react';
import { Branch } from '../types';
import { 
  MapPin, Navigation, Phone, Star, Wifi, Wind, ShieldCheck, 
  Search, Plus, Check, ExternalLink, Compass, Users, Sparkles, Layers, X
} from 'lucide-react';


interface BranchLocatorProps {
  branches: Branch[];
  onSelectBranch: (branch: Branch) => void;
  onAddBranch: (newBranch: Branch) => void;
  onBookSeat: (branch: Branch) => void;
}

export const BranchLocator: React.FC<BranchLocatorProps> = ({
  branches,
  onSelectBranch,
  onAddBranch,
  onBookSeat,
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedVillage, setSelectedVillage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBranchId, setActiveBranchId] = useState<string>(branches[0]?.id || '');
  const [isAddBranchOpen, setIsAddBranchOpen] = useState<boolean>(false);

  // States List
  const states = useMemo(() => {
    return Array.from(new Set(branches.map(b => b.state)));
  }, [branches]);

  // Districts for selected state
  const districts = useMemo(() => {
    let list = branches;
    if (selectedState !== 'All') {
      list = list.filter(b => b.state === selectedState);
    }
    return Array.from(new Set(list.map(b => b.district)));
  }, [branches, selectedState]);

  // Villages for selected district
  const villages = useMemo(() => {
    let list = branches;
    if (selectedState !== 'All') {
      list = list.filter(b => b.state === selectedState);
    }
    if (selectedDistrict !== 'All') {
      list = list.filter(b => b.district === selectedDistrict);
    }
    return Array.from(new Set(list.map(b => b.village)));
  }, [branches, selectedState, selectedDistrict]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchState = selectedState === 'All' || b.state === selectedState;
      const matchDistrict = selectedDistrict === 'All' || b.district === selectedDistrict;
      const matchVillage = selectedVillage === 'All' || b.village === selectedVillage;
      const matchSearch = 
        !searchQuery.trim() || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchState && matchDistrict && matchVillage && matchSearch;
    });
  }, [branches, selectedState, selectedDistrict, selectedVillage, searchQuery]);

  const activeBranch = branches.find(b => b.id === activeBranchId) || filteredBranches[0] || branches[0];

  // Near Me GPS Simulation
  const handleNearMe = () => {
    // Lanka Main Branch is default closest
    const lanka = branches.find(b => b.village.toLowerCase().includes('lanka')) || branches[0];
    if (lanka) {
      setSelectedState(lanka.state);
      setSelectedDistrict(lanka.district);
      setSelectedVillage(lanka.village);
      setActiveBranchId(lanka.id);
      alert(`📍 Nearest Apna Library found: ${lanka.name} (~1.2 km away in Lanka, Varanasi)`);
    }
  };

  // Add Branch Form State
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    village: '',
    address: '',
    lat: 25.2820,
    lng: 82.9963,
    totalSeats: 60,
    monthlyPrice: 800,
    phone: '+91 98765 43215',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
  });

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchForm.name || !newBranchForm.village) {
      alert('Please fill out branch name and village/area');
      return;
    }

    const created: Branch = {
      id: `br-${Date.now()}`,
      name: newBranchForm.name,
      state: newBranchForm.state,
      district: newBranchForm.district,
      village: newBranchForm.village,
      address: newBranchForm.address || `${newBranchForm.village}, ${newBranchForm.district}`,
      lat: newBranchForm.lat,
      lng: newBranchForm.lng,
      totalSeats: newBranchForm.totalSeats,
      occupiedSeats: 0,
      rating: 5.0,
      phone: newBranchForm.phone,
      facilities: ['5G WiFi', 'AC', 'RO Water', 'CCTV 24x7', 'Power Backup'],
      monthlyPrice: newBranchForm.monthlyPrice,
      image: newBranchForm.image,
    };

    onAddBranch(created);
    setIsAddBranchOpen(false);
    setActiveBranchId(created.id);
  };

  return (
    <div id="branches-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Multi-Branch Network · Varanasi & Beyond</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Find an Apna Library Near You
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Select your State &gt; District &gt; Village/Area to find air-conditioned study pods with live available seats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNearMe}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Near Me (GPS)
          </button>

          <button
            onClick={() => setIsAddBranchOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            + Add Branch
          </button>
        </div>
      </div>

      {/* FILTER BAR: State > District > Village / Area + Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* State Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
              1. Select State
            </label>
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedVillage('All');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All States (UP, Bihar, etc.)</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
              2. Select District
            </label>
            <select
              value={selectedDistrict}
              onChange={e => {
                setSelectedDistrict(e.target.value);
                setSelectedVillage('All');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Districts (Varanasi, Lucknow...)</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Village / Area Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
              3. Village / Area / Colony
            </label>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Villages / Localities</option>
              {villages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Lanka, BHU, Sigra..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: Left Branch Cards, Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Branch Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
            <span>Showing <strong>{filteredBranches.length}</strong> libraries</span>
            <span>Sorted by proximity & rating</span>
          </div>

          {filteredBranches.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
              <MapPin className="w-10 h-10 text-amber-400/50 mx-auto" />
              <p className="text-sm">No branch currently listed in this specific area.</p>
              <button
                onClick={() => {
                  setSelectedState('All');
                  setSelectedDistrict('All');
                  setSelectedVillage('All');
                }}
                className="px-4 py-2 bg-slate-800 text-amber-400 text-xs font-semibold rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredBranches.map(branch => {
              const availableSeats = branch.totalSeats - branch.occupiedSeats;
              const isSelected = branch.id === activeBranchId;

              return (
                <div
                  key={branch.id}
                  onClick={() => setActiveBranchId(branch.id)}
                  className={`group rounded-2xl p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-amber-400/80 shadow-[0_10px_30px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Photo & Badge */}
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[11px] font-bold text-amber-400 border border-amber-400/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{branch.rating}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-950/85 backdrop-blur-md rounded-lg text-[11px] font-bold text-emerald-300 border border-emerald-500/40">
                      🟢 {availableSeats} Seats Available
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold">{branch.village}, {branch.district}</span>
                      <span className="text-amber-300 font-bold">₹{branch.monthlyPrice}/month</span>
                    </div>
                  </div>

                  {/* Branch Details */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {branch.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </p>
                    </div>

                    {/* Live Occupancy Bar */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Total Seats: <strong className="text-white">{branch.totalSeats}</strong></span>
                        <span>Occupancy: <strong className="text-amber-400">{Math.round((branch.occupiedSeats / branch.totalSeats) * 100)}%</strong></span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full"
                          style={{ width: `${(branch.occupiedSeats / branch.totalSeats) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Facilities Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {branch.facilities.slice(0, 4).map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 rounded-md font-medium"
                        >
                          {fac}
                        </span>
                      ))}
                      {branch.facilities.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-amber-400/80">
                          +{branch.facilities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        Get Directions
                      </a>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectBranch(branch);
                          onBookSeat(branch);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        View Seats & Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Interactive High-Impact Map Component (7 Cols) */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive Cluster Map · Varanasi Hub
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live GPS Active
                </span>
              </div>
            </div>

            {/* Interactive SVG/Canvas Map Canvas */}
            <div className="relative w-full h-[460px] bg-[#0c1427] rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Stylized Map Grid & Roads Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                {/* River Ganga Simulation */}
                <path
                  d="M 280 0 C 310 120 340 220 310 320 C 290 390 310 460 330 500"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="24"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Major Roads */}
                <path d="M 0 160 Q 180 180 400 130" stroke="#475569" strokeWidth="2.5" fill="none" />
                <path d="M 120 0 L 220 460" stroke="#475569" strokeWidth="2.5" fill="none" />
                <path d="M 220 340 L 400 360" stroke="#475569" strokeWidth="2" fill="none" />
              </svg>

              {/* Watermark Label */}
              <div className="absolute top-4 left-4 pointer-events-none z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <span className="font-semibold text-white">Varanasi Division</span> · 25.2820° N, 82.9963° E
              </div>

              {/* Pins Drop on Map */}
              {branches.map((b, index) => {
                const isSelected = b.id === activeBranch.id;
                // Compute coordinates on the map view
                const offsets = [
                  { x: '45%', y: '68%' }, // Lanka (Near BHU)
                  { x: '35%', y: '40%' }, // Sigra
                  { x: '30%', y: '62%' }, // Sunderpur
                  { x: '65%', y: '25%' }, // Lucknow
                  { x: '75%', y: '55%' }, // Patna
                ];
                const pos = offsets[index % offsets.length];

                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveBranchId(b.id)}
                    style={{ left: pos.x, top: pos.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-300 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Pulsing ring for selected pin */}
                    {isSelected && (
                      <div className="absolute -inset-3 bg-amber-400/30 rounded-full animate-ping pointer-events-none" />
                    )}

                    {/* Pin Marker */}
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-amber-400 border-white text-slate-950 ring-4 ring-amber-400/40'
                          : 'bg-slate-900 border-amber-400/70 text-amber-400'
                      }`}
                    >
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>

                    {/* Tooltip Label */}
                    <div
                      className={`absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg border transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-white'
                          : 'bg-slate-900/90 text-slate-200 border-slate-700'
                      }`}
                    >
                      {b.village} · {b.totalSeats - b.occupiedSeats} Free
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Branch Highlight Box Under Map */}
            {activeBranch && (
              <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="text-sm font-bold text-white">{activeBranch.name}</h4>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-semibold rounded-md border border-amber-500/20">
                      {activeBranch.village}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activeBranch.address}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeBranch.lat},${activeBranch.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    Google Maps
                  </a>
                  <button
                    onClick={() => {
                      onSelectBranch(activeBranch);
                      onBookSeat(activeBranch);
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Select & Book Seat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: + Add Branch for Admin */}
      {isAddBranchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add New Library Branch
              </h3>
              <button
                onClick={() => setIsAddBranchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 py-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apna Library - Bhelupur Hub"
                  value={newBranchForm.name}
                  onChange={e => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={newBranchForm.state}
                    onChange={e => setNewBranchForm({ ...newBranchForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">District</label>
                  <input
                    type="text"
                    value={newBranchForm.district}
                    onChange={e => setNewBranchForm({ ...newBranchForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Village / Area / Colony</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bhelupur"
                    value={newBranchForm.village}
                    onChange={e => setNewBranchForm({ ...newBranchForm, village: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={newBranchForm.totalSeats}
                    onChange={e => setNewBranchForm({ ...newBranchForm, totalSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Full Street Address</label>
                <input
                  type="text"
                  placeholder="Near Bhelupur Crossing, Varanasi"
                  value={newBranchForm.address}
                  onChange={e => setNewBranchForm({ ...newBranchForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Save & Pin to Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
