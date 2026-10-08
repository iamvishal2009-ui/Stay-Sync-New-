'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Bed,
  Users,
  Receipt,
  Wrench,
  Calendar,
  Smartphone,
  Globe,
  Building2,
  Search,
  Plus,
  RefreshCw,
  Bell,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  DollarSign,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X,
  Check,
  Sparkles,
  Phone
} from 'lucide-react';
import { store } from '@/lib/store';
import { RoomWithTenants, Ticket, TicketStatus, Tenant, Invoice, Inquiry } from '@/lib/types';
import { TenantPortal } from '@/components/tenant/TenantPortal';

interface AppInterfaceProps {
  onSwitchToWebsite: () => void;
}

type AppTab = 'dashboard' | 'rooms' | 'residents' | 'billing' | 'maintenance' | 'inquiries' | 'resident_app';

export const AppInterface: React.FC<AppInterfaceProps> = ({ onSwitchToWebsite }) => {
  const property = store.getProperty();
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const [rooms, setRooms] = useState<RoomWithTenants[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<RoomWithTenants | null>(null);
  const [tenantFilter, setTenantFilter] = useState<'all' | 'defaulters' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketFilter, setTicketFilter] = useState<TicketStatus | 'all'>('all');

  // Selected Tenant for Resident App simulation
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  // Invoice generator modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedTenantForInvoice, setSelectedTenantForInvoice] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(7500);
  const [electricityUnits, setElectricityUnits] = useState<number>(50);
  const [ratePerUnit, setRatePerUnit] = useState<number>(10);

  const reloadData = () => {
    const loadedTenants = store.getTenants();
    setRooms(store.getRoomsWithTenants());
    setTickets(store.getTickets());
    setTenants(loadedTenants);
    setInvoices(store.getInvoices());
    setInquiries(store.getInquiries());

    if (loadedTenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(loadedTenants[0].id);
    }
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = store.subscribe(reloadData);
    return () => {
      unsubscribe();
    };
  }, []);

  // Compute Metrics
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied_beds, 0);
  const vacantBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const activeTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const pendingInquiriesCount = inquiries.filter((iq) => iq.status === 'pending').length;

  // Filter Tenants
  const filteredTenants = tenants.filter((tenant) => {
    const tenantInvoices = invoices.filter((i) => i.tenant_id === tenant.id);
    const isDefaulter = tenantInvoices.some((i) => i.status === 'pending' || i.status === 'overdue');
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (tenantFilter === 'defaulters') return isDefaulter;
    if (tenantFilter === 'paid') return !isDefaulter;
    return true;
  });

  // Filter Tickets
  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'all') return true;
    return t.status === ticketFilter;
  });

  // Handle Invoice Submit
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForInvoice) return;

    const totalAmount = rentAmount + electricityUnits * ratePerUnit;
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    store.generateInvoice(selectedTenantForInvoice, totalAmount, dueDate);
    setIsInvoiceModalOpen(false);
    setSelectedTenantForInvoice('');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                <Building2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-slate-950">
                  StaySync<span className="text-blue-600">.</span>
                </span>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                  OS Workspace
                </span>
              </div>
            </div>

            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
              Live
            </span>
          </div>

          {/* Nav menu links */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'rooms'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bed className="w-4 h-4" />
                <span>Room Blueprint</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{rooms.length} Rms</span>
            </button>

            <button
              onClick={() => setActiveTab('residents')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'residents'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4" />
                <span>Resident Ledger</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{tenants.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'billing'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Receipt className="w-4 h-4" />
                <span>Billing & Sub-Meter</span>
              </div>
              {totalPending > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'maintenance'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Wrench className="w-4 h-4" />
                <span>Helpdesk Triage</span>
              </div>
              {activeTicketsCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {activeTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4" />
                <span>Tour Bookings</span>
              </div>
              {pendingInquiriesCount > 0 && (
                <span className="bg-blue-100 text-blue-900 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {pendingInquiriesCount}
                </span>
              )}
            </button>

            {/* Resident Mobile App Mode */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('resident_app')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  activeTab === 'resident_app'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Resident Mobile App</span>
                </div>
                <span className="text-[10px] font-mono uppercase font-black">Open</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <p className="font-extrabold text-slate-900 truncate">{property.name}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{vacantBeds} Beds Free</p>
          </div>

          <button
            onClick={onSwitchToWebsite}
            className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>View Public Website</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE VIEW */}
      <section className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-950 capitalize tracking-tight">
              {activeTab === 'dashboard' && 'Executive Management Suite'}
              {activeTab === 'rooms' && 'Floor 1 Room Inventory Blueprint'}
              {activeTab === 'residents' && 'Resident Ledger & Rent Roll'}
              {activeTab === 'billing' && 'Billing & Electricity Sub-Meter'}
              {activeTab === 'maintenance' && 'Maintenance Desk Triage'}
              {activeTab === 'inquiries' && 'Website Inquiries & Tour Bookings'}
              {activeTab === 'resident_app' && 'Resident Mobile Web Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab !== 'resident_app' && (
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Issue Bill
              </button>
            )}

            {activeTab === 'resident_app' && (
              <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-500 font-bold mr-2 text-[11px]">Resident:</span>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                if (confirm('Reset demo dataset to initial state?')) {
                  store.resetToDefaultSeed();
                }
              }}
              title="Reset Test Data"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 border border-slate-200/60 transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Executive KPI Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-500/15 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-blue-200">REALIZED REVENUE</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-2 text-white">
                    ₹ {totalCollected.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-blue-100 font-bold mt-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-300" /> Settled this billing cycle
                  </p>
                </div>

                <div className="bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-amber-600">PENDING RENT DUES</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-2 text-slate-950">
                    ₹ {totalPending.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-amber-700 font-bold mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Action required on defaulters
                  </p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">OCCUPANCY RATE</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-2 text-slate-950">
                    {occupancyRate}% <span className="text-sm font-bold font-sans text-slate-500">({occupiedBeds}/{totalBeds} Beds)</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-bold mt-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-500" /> {vacantBeds} Beds Vacant
                  </p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">OPERATIONAL FLOW</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-2 text-slate-950">
                    {activeTicketsCount} <span className="text-sm font-bold font-sans text-slate-500">Issues</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" /> {pendingInquiriesCount} Tour Requests Pending
                  </p>
                </div>
              </div>

              {/* Quick Split: Room Blueprint Preview & Top Defaulters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Blueprint */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-lg text-slate-950">Floor 1 Blueprint</h3>
                      <p className="text-xs text-slate-500">Live bed status snapshot</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('rooms')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View All Rooms <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {rooms.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRoom(r)}
                        className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-sm text-slate-950">Room {r.room_number}</span>
                          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            {r.occupied_beds}/{r.capacity} Beds
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {Array.from({ length: r.capacity }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-2 flex-1 rounded-full ${
                                idx < r.occupied_beds ? 'bg-blue-600' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Resident Ledger */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-black text-lg text-slate-950">Recent Dues & Ledger</h3>
                      <p className="text-xs text-slate-500">Follow up on pending rent</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('residents')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Full Ledger <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tenants.slice(0, 3).map((t) => {
                      const tInvoices = invoices.filter((i) => i.tenant_id === t.id);
                      const pendingInv = tInvoices.find((i) => i.status === 'pending' || i.status === 'overdue');

                      return (
                        <div
                          key={t.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
                        >
                          <div>
                            <p className="font-black text-slate-950">{t.name}</p>
                            <p className="text-[11px] font-mono text-slate-500">{t.phone}</p>
                          </div>
                          <div className="text-right">
                            {pendingInv ? (
                              <span className="text-[10px] font-mono font-black text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                ₹{pendingInv.amount} ({pendingInv.status})
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                PAID UP
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOM BLUEPRINT */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-lg font-black text-slate-950">Room {room.room_number}</span>
                      <span className="text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full uppercase font-mono">
                        {room.capacity} Sharing • ₹{room.base_rent}/mo
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {Array.from({ length: room.capacity }).map((_, idx) => {
                        const bedLetter = String.fromCharCode(65 + idx);
                        const bedId = `${room.room_number}-${bedLetter}`;
                        const tenant = room.tenants[idx];

                        let status: 'paid' | 'pending' | 'overdue' | 'vacant' = 'vacant';
                        let tenantName = 'Vacant Bed Slot';

                        if (tenant) {
                          tenantName = tenant.name;
                          const hasUnpaid = tenant.invoices.some((i) => i.status === 'pending' || i.status === 'overdue');
                          const hasOverdue = tenant.invoices.some((i) => i.status === 'overdue');
                          status = hasOverdue ? 'overdue' : hasUnpaid ? 'pending' : 'paid';
                        }

                        return (
                          <div
                            key={bedId}
                            onClick={() => setSelectedRoom(room)}
                            className={`p-3.5 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                              status === 'paid'
                                ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200/80 hover:bg-emerald-100/80'
                                : status === 'pending'
                                ? 'bg-amber-50/80 text-amber-950 border-amber-200/80 hover:bg-amber-100/80'
                                : status === 'overdue'
                                ? 'bg-rose-50/80 text-rose-950 border-rose-200/80 hover:bg-rose-100/80'
                                : 'bg-white text-slate-400 border-dashed border-slate-300 hover:border-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <span className="font-mono text-xs font-bold">{bedId}</span>
                            <span className="text-xs font-black truncate max-w-[140px]">{tenantName}</span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                                status === 'paid'
                                  ? 'bg-emerald-600 text-white'
                                  : status === 'pending'
                                  ? 'bg-amber-500 text-slate-950'
                                  : status === 'overdue'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESIDENTS LEDGER */}
          {activeTab === 'residents' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search resident or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-50 text-slate-900 text-xs font-bold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 w-60"
                    />
                  </div>

                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200/60">
                    <button
                      onClick={() => setTenantFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        tenantFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      ALL ({tenants.length})
                    </button>
                    <button
                      onClick={() => setTenantFilter('defaulters')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        tenantFilter === 'defaulters' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      DEFAULTERS
                    </button>
                    <button
                      onClick={() => setTenantFilter('paid')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        tenantFilter === 'paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      PAID UP
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Resident</th>
                      <th className="p-3.5">Room</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Move-In</th>
                      <th className="p-3.5">Dues Status</th>
                      <th className="p-3.5">KYC Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTenants.map((t) => {
                      const room = rooms.find((r) => r.id === t.room_id);
                      const tInvoices = invoices.filter((i) => i.tenant_id === t.id);
                      const pendingInv = tInvoices.find((i) => i.status === 'pending' || i.status === 'overdue');

                      const whatsappMsg = encodeURIComponent(
                        `Hi ${t.name}, payment reminder from Sunrise Luxury PG. Your rent dues of ₹${
                          pendingInv ? pendingInv.amount : 7500
                        } for Room ${room?.room_number || ''} are pending. Please pay via StaySync UPI.`
                      );

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-black text-slate-950">{t.name}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-700">Room {room?.room_number || 'N/A'}</td>
                          <td className="p-3.5 font-mono text-slate-500">{t.phone}</td>
                          <td className="p-3.5 font-mono text-slate-500">{t.move_in_date}</td>
                          <td className="p-3.5 font-mono">
                            {pendingInv ? (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                                ₹{pendingInv.amount} ({pendingInv.status})
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                                PAID UP
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {t.kyc_url ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                                VERIFIED
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
                                MISSING ID
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            {pendingInv ? (
                              <a
                                href={`https://wa.me/${t.phone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs inline-flex items-center gap-1.5 transition-all shadow-xs"
                              >
                                <Send className="w-3 h-3" /> Nudge WhatsApp
                              </a>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No Dues</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">Active & Past Invoices</h3>
                    <p className="text-xs text-slate-500 font-medium">Monthly rent ledger with electricity split</p>
                  </div>

                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Issue Monthly Bill
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Resident</th>
                        <th className="p-3.5">Invoice Amount</th>
                        <th className="p-3.5">Due Date</th>
                        <th className="p-3.5">Payment Status</th>
                        <th className="p-3.5">Reference ID</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {invoices.map((inv) => {
                        const tenant = tenants.find((t) => t.id === inv.tenant_id);

                        return (
                          <tr key={inv.id} className="hover:bg-slate-50/80">
                            <td className="p-3.5 font-bold font-sans text-slate-900">{tenant?.name || 'Resident'}</td>
                            <td className="p-3.5 font-bold text-slate-900">₹ {inv.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5 text-slate-500">{inv.due_date}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  inv.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inv.status === 'overdue'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-[11px] text-slate-500">{inv.payment_ref || 'Pending'}</td>
                            <td className="p-3.5 text-right font-sans">
                              {inv.status !== 'paid' && (
                                <button
                                  onClick={() => store.markInvoicePaid(inv.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MAINTENANCE DESK */}
          {activeTab === 'maintenance' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Maintenance Complaints & Triage</h3>
                  <p className="text-xs text-slate-500">Live service desk pipeline</p>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200/60">
                  <button
                    onClick={() => setTicketFilter('all')}
                    className={`px-3 py-1.5 rounded-lg ${ticketFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    ALL ({tickets.length})
                  </button>
                  <button
                    onClick={() => setTicketFilter('open')}
                    className={`px-3 py-1.5 rounded-lg ${ticketFilter === 'open' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'}`}
                  >
                    OPEN
                  </button>
                  <button
                    onClick={() => setTicketFilter('in_progress')}
                    className={`px-3 py-1.5 rounded-lg ${ticketFilter === 'in_progress' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    IN PROGRESS
                  </button>
                  <button
                    onClick={() => setTicketFilter('resolved')}
                    className={`px-3 py-1.5 rounded-lg ${ticketFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    RESOLVED
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredTickets.map((t) => {
                  const tenant = tenants.find((item) => item.id === t.tenant_id);
                  const room = rooms.find((r) => r.id === tenant?.room_id);

                  return (
                    <div key={t.id} className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-100/80 text-blue-800 text-xs font-black px-3 py-0.5 rounded-full uppercase">
                            {t.category}
                          </span>
                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              t.status === 'open'
                                ? 'bg-amber-100 text-amber-800'
                                : t.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-base font-black text-slate-950 mt-3">{t.description}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          Resident: {tenant?.name || 'Unknown'} (Room {room?.room_number || 'N/A'})
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Today'}
                        </span>

                        <div className="flex items-center gap-2">
                          {t.status !== 'in_progress' && t.status !== 'resolved' && (
                            <button
                              onClick={() => store.updateTicketStatus(t.id, 'in_progress')}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs"
                            >
                              In Progress
                            </button>
                          )}
                          {t.status !== 'resolved' && (
                            <button
                              onClick={() => store.updateTicketStatus(t.id, 'resolved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE TOUR BOOKINGS */}
          {activeTab === 'inquiries' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Website Inquiries & Tour Bookings</h3>
                  <p className="text-xs text-slate-500">Prospective tenants scheduling visits through the landing page</p>
                </div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {inquiries.length} Inquiries Total
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => {
                  const whatsappTourMsg = encodeURIComponent(
                    `Hello ${inq.name}! Thank you for your inquiry about ${inq.room_preference} at Sunrise Luxury PG. We would love to host you on ${inq.visit_date}. Please let us know what time works best!`
                  );

                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-base text-slate-950">{inq.name}</h4>
                            <p className="text-xs font-mono text-slate-500">{inq.phone}</p>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              inq.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inq.status === 'completed'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                          <p className="text-slate-700">
                            <strong>Preference:</strong> {inq.room_preference}
                          </p>
                          <p className="text-slate-700">
                            <strong>Visit Date:</strong> {inq.visit_date}
                          </p>
                          {inq.notes && (
                            <p className="text-slate-500 italic font-sans text-[11px]">
                              &ldquo;{inq.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {inq.status !== 'confirmed' && (
                            <button
                              onClick={() => store.updateInquiryStatus(inq.id, 'confirmed')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                            >
                              Confirm
                            </button>
                          )}
                          {inq.status !== 'completed' && (
                            <button
                              onClick={() => store.updateInquiryStatus(inq.id, 'completed')}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
                            >
                              Done
                            </button>
                          )}
                        </div>

                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${whatsappTourMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: RESIDENT MOBILE APP (SIMULATED PORTAL) */}
          {activeTab === 'resident_app' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md">
                <TenantPortal tenantId={selectedTenantId} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Invoice Generator Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoice} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-950">Issue Monthly Rent Slip</h3>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Resident</label>
                <select
                  required
                  value={selectedTenantForInvoice}
                  onChange={(e) => {
                    setSelectedTenantForInvoice(e.target.value);
                    const tenant = tenants.find((t) => t.id === e.target.value);
                    const room = rooms.find((r) => r.id === tenant?.room_id);
                    if (room) setRentAmount(room.base_rent);
                  }}
                  className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-bold"
                >
                  <option value="">-- Choose Resident --</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Base Rent (₹)</label>
                  <input
                    type="number"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Electricity (Units)</label>
                  <input
                    type="number"
                    value={electricityUnits}
                    onChange={(e) => setElectricityUnits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Rate per Unit (₹)</label>
                <input
                  type="number"
                  value={ratePerUnit}
                  onChange={(e) => setRatePerUnit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl font-bold"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Electricity ({electricityUnits}u):</span>
                  <span>₹ {electricityUnits * ratePerUnit}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Base Rent:</span>
                  <span>₹ {rentAmount}</span>
                </div>
                <div className="flex justify-between font-black text-slate-950 text-base pt-2 border-t border-slate-200 font-sans">
                  <span>Total Payable:</span>
                  <span className="font-mono text-xl text-blue-600">₹ {rentAmount + electricityUnits * ratePerUnit}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 font-mono font-bold text-xs text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105"
              >
                Confirm & Issue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Drawer Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-950">Room {selectedRoom.room_number} Overview</h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-slate-900 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-600">Capacity: {selectedRoom.capacity} Beds | Rent: ₹{selectedRoom.base_rent}/mo</p>
              <div className="space-y-2.5">
                <span className="font-bold text-slate-900 uppercase">Assigned Residents:</span>
                {selectedRoom.tenants.length > 0 ? (
                  selectedRoom.tenants.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-black text-slate-950 font-sans text-sm">{t.name}</p>
                        <p className="text-slate-500 text-[11px]">{t.phone} | Joined: {t.move_in_date}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        t.invoices.some(i => i.status !== 'paid') ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.invoices.some(i => i.status !== 'paid') ? 'Dues Pending' : 'Paid Up'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">Room is currently vacant.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedRoom(null)}
                className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
