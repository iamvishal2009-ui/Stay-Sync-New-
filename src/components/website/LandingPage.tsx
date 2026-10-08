'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Bed,
  Users,
  CheckCircle2,
  QrCode,
  Wrench,
  Clock,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  Send,
  Zap,
  Wifi,
  Utensils,
  Shield,
  Star,
  Check,
  X,
  CreditCard,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '@/lib/store';
import { RoomWithTenants } from '@/lib/types';

interface LandingPageProps {
  onEnterApp: (persona: 'owner' | 'tenant') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const property = store.getProperty();
  const rooms = store.getRoomsWithTenants();

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('Room 101 (2 Sharing)');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Estimator State
  const [sharingType, setSharingType] = useState<number>(2); // 1, 2, 3
  const [estimatedUnits, setEstimatedUnits] = useState<number>(45);

  // Calculate live stats
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied_beds, 0);
  const vacantBeds = Math.max(0, totalBeds - occupiedBeds);

  const getEstimatedRent = () => {
    if (sharingType === 1) return 9500;
    if (sharingType === 2) return 7500;
    return 6500;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;

    store.addInquiry({
      name: visitorName.trim(),
      phone: visitorPhone.trim(),
      room_preference: selectedRoomNumber,
      visit_date: visitDate || new Date().toISOString().split('T')[0],
      notes: visitorNotes.trim(),
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
      setVisitorName('');
      setVisitorPhone('');
      setVisitorNotes('');
    }, 2800);
  };

  return (
    <div className="space-y-24 pb-20 font-sans text-slate-900">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6 px-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50/90 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Next-Gen Co-Living OS & Virtual Resident Hub</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Smart Living, <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Synchronized.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Welcome to <strong className="text-slate-900 font-extrabold">{property.name}</strong>. Enjoy automated 1-click UPI billing, real-time maintenance resolution, transparent electricity sub-meters, and hotel-grade student living.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedRoomNumber('Room 101 (2 Sharing)');
                setIsBookingModalOpen(true);
              }}
              className="h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule a Free Visit
            </button>

            <button
              onClick={() => onEnterApp('owner')}
              className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-sm transition-all hover:scale-105 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              Open Owner Hub
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterApp('tenant')}
              className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-extrabold text-sm rounded-2xl shadow-xs transition-all hover:scale-105 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              Resident Portal
            </button>
          </div>

          {/* Live Status Indicators */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Live Vacancy</span>
              <p className="text-xl font-black text-blue-600 font-mono mt-0.5">
                {vacantBeds} Beds Free
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Out of {totalBeds} total slots</span>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">UPI Clearance</span>
              <p className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                Instant (0s)
              </p>
              <span className="text-[11px] text-slate-500 font-medium">GPay, PhonePe, Paytm</span>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Police KYC</span>
              <p className="text-xl font-black text-indigo-600 font-mono mt-0.5">
                100% Verified
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Chandigarh Police Reg.</span>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Helpdesk Speed</span>
              <p className="text-xl font-black text-amber-600 font-mono mt-0.5">
                &lt; 4 Hours
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Average ticket resolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE ROOMS INVENTORY & BOOKING */}
      <section id="rooms" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-extrabold text-xs uppercase tracking-wider">
              <Bed className="w-4 h-4" /> Real-Time Availability
            </div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight mt-1">
              Curated Designer Rooms
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              All rooms include 300 Mbps Wi-Fi, 3 homestyle meals, daily housekeeping & power backup.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Inventory Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const vacantCount = room.capacity - room.occupied_beds;
            const isFull = vacantCount <= 0;

            return (
              <div
                key={room.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                        Floor 1
                      </span>
                      <h3 className="text-2xl font-black text-slate-950">Room {room.room_number}</h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase ${
                        isFull
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isFull ? 'Occupied' : `${vacantCount} Bed Available`}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-baseline justify-between font-mono">
                    <span className="text-xs text-slate-500 font-sans font-bold">
                      {room.capacity === 1 ? 'Single Studio' : room.capacity === 2 ? 'Double Sharing' : 'Triple Sharing'}
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{room.base_rent.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-sans font-semibold">/mo</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      <span>Air Conditioned & Geyser</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      <span>300 Mbps Dedicated Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      <span>3 Nutritional Meals Daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      <span>Individual Study Desk & Wardrobe</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedRoomNumber(`Room ${room.room_number} (${room.capacity} Sharing)`);
                      setIsBookingModalOpen(true);
                    }}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isFull
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isFull ? 'Waitlist This Room' : 'Book Bed / Tour'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE TRANSPARENT COST ESTIMATOR */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
              100% Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Monthly Rent & Utility Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              No hidden brokerages, no surprise maintenance fees. Calculate your total estimated monthly checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  1. Room Sharing Configuration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 1, label: 'Single', rent: '₹9,500' },
                    { count: 2, label: 'Double', rent: '₹7,500' },
                    { count: 3, label: 'Triple', rent: '₹6,500' },
                  ].map((item) => (
                    <button
                      key={item.count}
                      onClick={() => setSharingType(item.count)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        sharingType === item.count
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30 font-extrabold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-black">{item.label}</p>
                      <p className="text-[10px] font-mono opacity-80 mt-0.5">{item.rent}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. Estimated Electricity Sub-Meter
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-300">
                    {estimatedUnits} Units × ₹10 = ₹{estimatedUnits * 10}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={estimatedUnits}
                  onChange={(e) => setEstimatedUnits(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0 Units (Minimal)</span>
                  <span>75 Units (Typical AC)</span>
                  <span>150 Units (Heavy)</span>
                </div>
              </div>
            </div>

            {/* Live Receipt Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase text-slate-500">Estimated Invoice</span>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full uppercase">
                  Monthly Total
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Room Base Rent ({sharingType} Sharing):</span>
                  <span className="font-bold text-slate-900">₹ {getEstimatedRent().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Power ({estimatedUnits} kWh @ ₹10):</span>
                  <span className="font-bold text-slate-900">₹ {(estimatedUnits * 10).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>3 Meals & High-Speed Wi-Fi:</span>
                  <span className="font-bold text-emerald-600">Included (₹0)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Housekeeping & Security:</span>
                  <span className="font-bold text-emerald-600">Included (₹0)</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-sans">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block">Total Monthly Payable</span>
                    <span className="text-[10px] text-slate-500 font-mono">No brokerage fee</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-blue-600">
                    ₹ {(getEstimatedRent() + estimatedUnits * 10).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRoomNumber(`Estimated ${sharingType} Sharing`);
                  setIsBookingModalOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-blue-600/20"
              >
                Lock In This Rate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES & LIFESTYLE */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase text-blue-600 tracking-wider">
            All-Inclusive Campus Living
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Designed for Focus & Comfort
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Everything a student or young working professional needs, managed with modern digital efficiency.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Wifi,
              title: '300 Mbps Wi-Fi',
              desc: 'Dual-band fiber mesh with zero dead zones in every room.',
            },
            {
              icon: Utensils,
              title: '3 Homestyle Meals',
              desc: 'Nutritious breakfast, lunch, and dinner curated for students.',
            },
            {
              icon: Zap,
              title: '24/7 Power Backup',
              desc: 'Dedicated commercial silent generator for uninterrupted study.',
            },
            {
              icon: ShieldCheck,
              title: 'Biometric & CCTV',
              desc: '3-tier digital access security and continuous surveillance.',
            },
            {
              icon: Sparkles,
              title: 'Daily Housekeeping',
              desc: 'Deep cleaning of rooms, washrooms, and common corridors.',
            },
            {
              icon: QrCode,
              title: 'Instant UPI Clearance',
              desc: 'Pay rent in seconds via GPay, PhonePe with instant receipts.',
            },
            {
              icon: Wrench,
              title: 'In-House Repairs',
              desc: 'Tap-to-raise maintenance requests resolved in hours.',
            },
            {
              icon: Star,
              title: 'Police KYC Verified',
              desc: '100% compliant with local Chandigarh administration rules.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <item.icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE STAYSYNC / DUAL-SIDED ADVANTAGE */}
      <section className="bg-slate-100/80 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase text-blue-600 tracking-wider">
            Dual-Sided Co-Living Platform
          </span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Built for Residents & Property Owners Alike
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tenant Experience */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">For Residents</h3>
                <p className="text-xs text-slate-500">Frictionless, modern college living</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant rent payment via GPay/PhonePe with dynamic QR codes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Download verified digital rent receipts anytime for college records.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-tap maintenance ticket submission with live resolution updates.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure Aadhaar police verification upload without paper forms.</span>
              </li>
            </ul>

            <button
              onClick={() => onEnterApp('tenant')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              Try Tenant Portal Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Owner Experience */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">For PG Owners & Managers</h3>
                <p className="text-xs text-slate-500">Autonomous co-living operations</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Live Floor Blueprint matrix with real-time bed vacancy tracking.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1-click WhatsApp payment reminders with pre-filled billing messages.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Automated monthly rent generator with electricity sub-meter calculation.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Full maintenance desk triage board to assign and resolve complaints.</span>
              </li>
            </ul>

            <button
              onClick={() => onEnterApp('owner')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              Try Owner Hub Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase text-blue-600 tracking-wider">
              Strategic Location
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Steps away from Chandigarh University
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Located in a quiet, secure neighborhood right outside Gate 3 of CU. Quick walking access to university libraries, cafes, markets, and transport hubs.
            </p>

            <div className="space-y-3 text-xs font-mono pt-2">
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+91 98765 43210 (Manager Direct)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Daily Visit Hours: 8:00 AM – 8:30 PM IST</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919876543210?text=Hi%20Sunrise%20PG%2C%20I%20would%20like%20to%20inquire%20about%20room%20availability"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Manager
              </a>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                Schedule In-Person Tour
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-slate-900">{property.name}</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">Plot 402, Near CU Gate 3, Kharar, Punjab</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">CU Main Campus: 400m (3 min walk)</p>
              <p>Chandigarh City Bus Stand: 15 mins</p>
              <p>Kharar Railway Station: 10 mins</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
            S
          </div>
          <span className="font-extrabold text-slate-900">StaySync</span>
          <span>• © 2026 Sunrise Luxury PG. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onEnterApp('owner')} className="hover:text-blue-600 transition-colors font-bold">
            Owner Hub
          </button>
          <button onClick={() => onEnterApp('tenant')} className="hover:text-blue-600 transition-colors font-bold">
            Tenant Portal
          </button>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Police Verified
          </span>
        </div>
      </footer>

      {/* SCHEDULE TOUR / BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 font-sans">Tour Confirmed!</h3>
                <p className="text-xs font-bold text-emerald-700">
                  We have registered your inquiry for {selectedRoomNumber}.
                </p>
                <p className="text-[11px] text-slate-500">
                  Our manager will reach out via WhatsApp/Call to confirm your arrival time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                    Quick Booking
                  </span>
                  <h3 className="text-xl font-black text-slate-950">Schedule a Free PG Tour</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Visit Sunrise Luxury PG and inspect rooms in person.</p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Siddharth Sharma"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-sans focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">WhatsApp / Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Room Option</label>
                      <select
                        value={selectedRoomNumber}
                        onChange={(e) => setSelectedRoomNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-bold focus:outline-none focus:border-blue-500"
                      >
                        <option value="Room 101 (2 Sharing)">Room 101 (2 Sharing)</option>
                        <option value="Room 102 (3 Sharing)">Room 102 (3 Sharing)</option>
                        <option value="Room 103 (Single Studio)">Room 103 (Single Studio)</option>
                        <option value="Room 104 (2 Sharing)">Room 104 (2 Sharing)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Notes / Questions (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Course, expected move-in date, or questions..."
                      value={visitorNotes}
                      onChange={(e) => setVisitorNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-sans focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                  >
                    Confirm Tour Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
