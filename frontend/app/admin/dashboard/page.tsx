'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Filter,
  Download,
  LogOut,
  RefreshCw,
  Eye,
  Copy,
  MessageSquare,
  Mail,
  FileText,
  X,
  Save,
  Trash2,
} from 'lucide-react';

import { BookingRecord } from '@/types';

import {
  fetchAdminBookings,
  updateBookingStatusOnServer,
  deleteBookingOnServer,
} from '@/lib/api';

const statusColors: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Contacted: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Discussion: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'Quotation Sent':
    'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  Confirmed:
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'In Progress':
    'bg-studio-orange/15 text-studio-orange border-studio-orange/40',
  Review: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Completed:
    'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const allStatuses = [
  'New',
  'Contacted',
  'Discussion',
  'Quotation Sent',
  'Confirmed',
  'In Progress',
  'Review',
  'Completed',
  'Cancelled',
];

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRecord | null>(null);

  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [confirmDeleteBooking, setConfirmDeleteBooking] =
    useState<BookingRecord | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // =====================================================
  // LOAD ADMIN BOOKING DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await fetchAdminBookings();

      setBookings(data);
    } catch (error) {
      console.error(
        '[Admin Dashboard] Failed to load bookings:',
        error
      );

      // Do NOT automatically sign the user out here.
      // Network/API errors do not necessarily mean
      // the Supabase session is invalid.
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY SUPABASE SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            '[Admin Dashboard] Session error:',
            error.message
          );

          if (mounted) {
            router.replace('/admin');
          }

          return;
        }

        if (!session) {
          console.log(
            '[Admin Dashboard] No active Supabase session.'
          );

          if (mounted) {
            router.replace('/admin');
          }

          return;
        }

        console.log(
          '[Admin Dashboard] Active admin session:',
          session.user.email
        );

        if (mounted) {
          await loadData();
        }
      } catch (error) {
        console.error(
          '[Admin Dashboard] Session initialization failed:',
          error
        );

        if (mounted) {
          router.replace('/admin');
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(
          '[Admin Dashboard] Logout error:',
          error.message
        );
      }
    } catch (error) {
      console.error(
        '[Admin Dashboard] Logout failed:',
        error
      );
    } finally {
      router.replace('/admin');
    }
  };

  // =====================================================
  // COPY BOOKING ID
  // =====================================================

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // =====================================================
  // OPEN BOOKING DETAILS
  // =====================================================

  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setEditingStatus(booking.status);
    setEditingNotes(booking.internal_notes || '');
  };

  // =====================================================
  // SAVE STATUS + NOTES
  // =====================================================

  const handleSaveStatusAndNotes = async () => {
    if (!selectedBooking) return;

    try {
      setIsSaving(true);

      await updateBookingStatusOnServer(
        selectedBooking.booking_id,
        editingStatus,
        editingNotes
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === selectedBooking.booking_id
            ? {
                ...b,
                status: editingStatus as any,
                internal_notes: editingNotes,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );

      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              status: editingStatus as any,
              internal_notes: editingNotes,
            }
          : null
      );
    } catch (error) {
      console.error(
        '[Admin Dashboard] Failed to update booking:',
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // DELETE BOOKING
  // =====================================================

  const handleDeleteBooking = async () => {
    if (!confirmDeleteBooking) return;

    try {
      setIsDeleting(true);

      const result = await deleteBookingOnServer(
        confirmDeleteBooking.booking_id
      );

      if (result.success) {
        setBookings((prev) =>
          prev.filter(
            (b) =>
              b.booking_id !==
              confirmDeleteBooking.booking_id
          )
        );

        if (
          selectedBooking?.booking_id ===
          confirmDeleteBooking.booking_id
        ) {
          setSelectedBooking(null);
        }

        setConfirmDeleteBooking(null);
      }
    } catch (error) {
      console.error(
        '[Admin Dashboard] Failed to delete booking:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      b.booking_id.toLowerCase().includes(query) ||
      b.customer_name.toLowerCase().includes(query) ||
      (b.business_name &&
        b.business_name.toLowerCase().includes(query)) ||
      b.email.toLowerCase().includes(query) ||
      b.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'All' ||
      b.status === statusFilter;

    const matchesService =
      serviceFilter === 'All' ||
      b.selected_service === serviceFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesService
    );
  });

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportToCSV = () => {
    const headers = [
      'Booking ID',
      'Customer Name',
      'Business',
      'Email',
      'Phone',
      'Service',
      'Budget',
      'Deadline',
      'Status',
      'Communication',
      'Created At',
    ];

    const rows = filteredBookings.map((b) => [
      b.booking_id,
      `"${b.customer_name}"`,
      `"${b.business_name || ''}"`,
      b.email,
      b.phone,
      `"${b.selected_service}"`,
      `"${b.budget}"`,
      `"${b.deadline}"`,
      b.status,
      b.preferred_communication,
      b.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rows.map((e) => e.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);

    link.setAttribute(
      'download',
      `yourstop_studio_bookings_${Date.now()}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================================
  // DASHBOARD METRICS
  // =====================================================

  const totalCount = bookings.length;

  const newCount = bookings.filter(
    (b) => b.status === 'New'
  ).length;

  const activeCount = bookings.filter((b) =>
    [
      'Discussion',
      'Quotation Sent',
      'Confirmed',
      'In Progress',
      'Review',
    ].includes(b.status)
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status === 'Completed'
  ).length;

  return (
    <div className="min-h-screen bg-studio-black text-studio-white flex flex-col">

      {/* ================================================= */}
      {/* TOP NAVBAR */}
      {/* ================================================= */}

      <header className="bg-studio-charcoal border-b border-studio-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">

        <div className="flex items-center gap-3">

          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-studio-black border border-studio-orange/40 p-1">

            <Image
              src="/logo.png"
              alt="YourStop Studio Logo"
              fill
              className="object-contain"
            />

          </div>

          <div>

            <h1 className="font-display font-bold text-white text-base leading-tight">

              YourStop Studio{' '}

              <span className="text-studio-orange font-normal">
                Admin Dashboard
              </span>

            </h1>

            <span className="text-[10px] text-studio-muted font-mono">
              Protected Management System
            </span>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-studio-black border border-white/10 text-studio-muted hover:text-white transition-colors"
            title="Refresh Bookings"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />

          </button>

          <button
            onClick={exportToCSV}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-studio-black border border-white/10 text-xs font-semibold text-white hover:border-studio-orange transition-colors"
          >

            <Download className="w-4 h-4 text-studio-orange" />

            <span>Export CSV</span>

          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >

            <LogOut className="w-4 h-4" />

            <span className="hidden sm:inline">
              Logout
            </span>

          </button>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* METRICS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-glass-card p-5 rounded-2xl border border-white/5">

            <div className="text-xs text-studio-muted font-mono uppercase">
              Total Bookings
            </div>

            <div className="text-3xl font-display font-extrabold text-white mt-1">
              {totalCount}
            </div>

          </div>

          <div className="bg-glass-card p-5 rounded-2xl border border-blue-500/30">

            <div className="text-xs text-blue-400 font-mono uppercase">
              New Leads
            </div>

            <div className="text-3xl font-display font-extrabold text-blue-400 mt-1">
              {newCount}
            </div>

          </div>

          <div className="bg-glass-card p-5 rounded-2xl border border-studio-orange/30">

            <div className="text-xs text-studio-orange font-mono uppercase">
              Active Projects
            </div>

            <div className="text-3xl font-display font-extrabold text-studio-orange mt-1">
              {activeCount}
            </div>

          </div>

          <div className="bg-glass-card p-5 rounded-2xl border border-emerald-500/30">

            <div className="text-xs text-emerald-400 font-mono uppercase">
              Completed
            </div>

            <div className="text-3xl font-display font-extrabold text-emerald-400 mt-1">
              {completedCount}
            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <div className="bg-glass-card p-4 rounded-2xl border border-studio-border mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">

          <div className="relative w-full md:w-80">

            <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-3" />

            <input
              type="text"
              placeholder="Search by ID, name, email, phone..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-studio-black border border-white/10 text-xs text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
            />

          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

            <div className="flex items-center gap-2 text-xs text-studio-muted">

              <Filter className="w-3.5 h-3.5" />

              <span>Status:</span>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="px-3 py-1.5 rounded-xl bg-studio-black border border-white/10 text-xs text-white focus:border-studio-orange"
              >

                <option value="All">
                  All Statuses
                </option>

                {allStatuses.map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s}
                  </option>
                ))}

              </select>

            </div>

            <div className="flex items-center gap-2 text-xs text-studio-muted">

              <span>Service:</span>

              <select
                value={serviceFilter}
                onChange={(e) =>
                  setServiceFilter(e.target.value)
                }
                className="px-3 py-1.5 rounded-xl bg-studio-black border border-white/10 text-xs text-white focus:border-studio-orange"
              >

                <option value="All">
                  All Services
                </option>

                <option value="Website Development">
                  Website Development
                </option>

                <option value="UI/UX Designing">
                  UI/UX Designing
                </option>

                <option value="Video Editing">
                  Video Editing
                </option>

                <option value="Reel Making">
                  Reel Making
                </option>

                <option value="Voice Over Services">
                  Voice Over Services
                </option>

                <option value="Content Writing">
                  Content Writing
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* BOOKINGS TABLE */}
        {/* ================================================= */}

        <div className="bg-glass-card rounded-2xl border border-studio-border overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-studio-black text-studio-muted uppercase tracking-wider font-mono border-b border-white/10">

                <tr>

                  <th className="p-4">
                    Booking ID
                  </th>

                  <th className="p-4">
                    Customer & Business
                  </th>

                  <th className="p-4">
                    Service
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Budget & Deadline
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4 text-right">
                    Actions
                  </th>

                  <th className="p-4"></th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {loading ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="p-8 text-center text-studio-muted"
                    >
                      Loading booking records...
                    </td>

                  </tr>

                ) : filteredBookings.length === 0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="p-8 text-center text-studio-muted"
                    >
                      No matching booking records found.
                    </td>

                  </tr>

                ) : (

                  filteredBookings.map((b) => (

                    <tr
                      key={b.id}
                      className="hover:bg-white/5 transition-colors"
                    >

                      <td className="p-4 font-mono font-bold text-studio-orange">

                        <div className="flex items-center gap-1.5">

                          <span>
                            {b.booking_id}
                          </span>

                          <button
                            onClick={() =>
                              handleCopyId(
                                b.booking_id
                              )
                            }
                            className="p-1 text-studio-muted hover:text-white"
                            title="Copy ID"
                          >

                            <Copy className="w-3 h-3" />

                          </button>

                          {copiedId ===
                            b.booking_id && (

                            <span className="text-[10px] text-emerald-400">
                              Copied!
                            </span>

                          )}

                        </div>

                      </td>

                      <td className="p-4">

                        <div className="font-bold text-white">
                          {b.customer_name}
                        </div>

                        <div className="text-studio-muted text-[11px]">
                          {b.business_name ||
                            'Individual'}
                        </div>

                        <div className="text-studio-muted text-[11px]">
                          {b.email}
                        </div>

                      </td>

                      <td className="p-4 font-medium text-white">
                        {b.selected_service}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            statusColors[
                              b.status
                            ] ||
                            'bg-white/10 text-white'
                          }`}
                        >
                          {b.status}
                        </span>

                      </td>

                      <td className="p-4 text-studio-muted">

                        <div>
                          {b.budget}
                        </div>

                        <div className="text-[11px] font-mono text-studio-white">
                          {b.deadline}
                        </div>

                      </td>

                      <td className="p-4 text-studio-muted font-mono text-[11px]">

                        {new Date(
                          b.created_at
                        ).toLocaleDateString()}

                      </td>

                      <td className="p-4 text-right">

                        <button
                          onClick={() =>
                            handleOpenDetail(b)
                          }
                          className="px-3 py-1.5 rounded-lg bg-studio-black border border-white/10 text-studio-orange hover:bg-studio-orange hover:text-white transition-colors inline-flex items-center gap-1 font-semibold"
                        >

                          <Eye className="w-3.5 h-3.5" />

                          <span>
                            View Detail
                          </span>

                        </button>

                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            setConfirmDeleteBooking(
                              b
                            )
                          }
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Record"
                        >

                          <Trash2 className="w-3.5 h-3.5" />

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* BOOKING DETAIL MODAL */}
      {/* ================================================= */}

      {selectedBooking && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

          <div className="bg-studio-charcoal border border-studio-orange/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">

            <button
              onClick={() =>
                setSelectedBooking(null)
              }
              className="absolute top-5 right-5 p-2 rounded-full bg-studio-black text-studio-muted hover:text-white"
            >

              <X className="w-5 h-5" />

            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-studio-orange uppercase mb-1">

              <span>Booking Detail</span>

              •

              <span>
                {selectedBooking.booking_id}
              </span>

            </div>

            <h2 className="text-2xl font-display font-extrabold text-white">
              {selectedBooking.customer_name}
            </h2>

            <p className="text-xs text-studio-muted">
              {selectedBooking.business_name ||
                'Individual Client'}
            </p>

            {/* CONTACT BUTTONS */}

            <div className="mt-4 flex flex-wrap gap-2">

              <a
                href={`mailto:${selectedBooking.email}?subject=YourStop Studio Booking ${selectedBooking.booking_id}`}
                className="px-3.5 py-1.5 rounded-xl bg-studio-black border border-white/10 text-xs font-semibold text-white hover:border-studio-orange flex items-center gap-1.5"
              >

                <Mail className="w-3.5 h-3.5 text-studio-orange" />

                <span>
                  Send Email
                </span>

              </a>

              <a
                href={`https://wa.me/${selectedBooking.phone.replace(
                  /\D/g,
                  ''
                )}?text=Hi%20${encodeURIComponent(
                  selectedBooking.customer_name
                )},%20this%20is%20YourStop%20Studio%20regarding%20booking%20${selectedBooking.booking_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-xs font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center gap-1.5"
              >

                <MessageSquare className="w-3.5 h-3.5" />

                <span>
                  Open WhatsApp
                </span>

              </a>

            </div>

            {/* CUSTOMER DETAILS */}

            <div className="mt-6 grid grid-cols-2 gap-4 p-4 rounded-2xl bg-studio-black/60 border border-white/5 text-xs">

              <div>

                <span className="text-studio-muted block">
                  Selected Service:
                </span>

                <span className="font-bold text-white">
                  {selectedBooking.selected_service}
                </span>

              </div>

              <div>

                <span className="text-studio-muted block">
                  Budget Range:
                </span>

                <span className="font-bold text-white">
                  {selectedBooking.budget}
                </span>

              </div>

              <div>

                <span className="text-studio-muted block">
                  Preferred Deadline:
                </span>

                <span className="font-bold text-white">
                  {selectedBooking.deadline}
                </span>

              </div>

              <div>

                <span className="text-studio-muted block">
                  Preferred Channel:
                </span>

                <span className="font-bold text-studio-orange">
                  {
                    selectedBooking.preferred_communication
                  }
                </span>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-4">

              <span className="text-xs font-bold text-studio-white uppercase tracking-wider block mb-1">
                Project Description
              </span>

              <div className="p-4 rounded-2xl bg-studio-black border border-white/10 text-xs text-studio-white/80 leading-relaxed whitespace-pre-wrap">
                {
                  selectedBooking.project_description
                }
              </div>

            </div>

            {/* ATTACHMENT */}

            {selectedBooking.reference_file_name && (

              <div className="mt-4 p-3 rounded-xl bg-studio-black border border-studio-orange/30 flex items-center justify-between">

                <div className="flex items-center gap-2 text-xs">

                  <FileText className="w-4 h-4 text-studio-orange" />

                  <span className="text-white font-medium">
                    {
                      selectedBooking.reference_file_name
                    }
                  </span>

                </div>

                <span className="text-[10px] text-studio-muted font-mono">
                  Attachment Uploaded
                </span>

              </div>

            )}

            {/* STATUS / NOTES */}

            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">

              <div>

                <label className="block text-xs font-bold text-white mb-1.5">
                  Update Booking Status
                </label>

                <select
                  value={editingStatus}
                  onChange={(e) =>
                    setEditingStatus(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-studio-black border border-white/10 text-xs text-white focus:border-studio-orange"
                >

                  {allStatuses.map((s) => (

                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="block text-xs font-bold text-white mb-1.5">
                  Internal Admin Notes
                </label>

                <textarea
                  rows={3}
                  placeholder="Add private team notes, proposal details, or call summaries..."
                  value={editingNotes}
                  onChange={(e) =>
                    setEditingNotes(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-studio-black border border-white/10 text-xs text-white placeholder-studio-muted focus:border-studio-orange"
                />

              </div>

              <button
                onClick={
                  handleSaveStatusAndNotes
                }
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-studio-orange font-bold text-xs text-white shadow-glow hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >

                <Save className="w-4 h-4" />

                <span>
                  {isSaving
                    ? 'Saving Changes...'
                    : 'Save Status & Internal Notes'}
                </span>

              </button>

              <button
                onClick={() => {
                  setConfirmDeleteBooking(
                    selectedBooking
                  );
                }}
                className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 font-bold text-xs text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >

                <Trash2 className="w-4 h-4" />

                <span>
                  Delete This Record Permanently
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================= */}

      {confirmDeleteBooking && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">

          <div className="bg-studio-charcoal border border-red-500/40 rounded-3xl max-w-md w-full p-7 shadow-2xl relative">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2.5 rounded-2xl bg-red-500/15 border border-red-500/30">

                <Trash2 className="w-5 h-5 text-red-400" />

              </div>

              <div>

                <h3 className="text-base font-display font-bold text-white">
                  Delete Booking Record?
                </h3>

                <p className="text-[11px] text-studio-muted">
                  This action is permanent and cannot be undone.
                </p>

              </div>

            </div>

            <div className="p-4 rounded-2xl bg-red-500/8 border border-red-500/20 mb-6">

              <p className="text-xs text-studio-muted mb-1">
                You are about to permanently delete:
              </p>

              <p className="font-bold text-white">
                {
                  confirmDeleteBooking.customer_name
                }
              </p>

              <p className="text-[11px] text-studio-muted">
                {confirmDeleteBooking.business_name ||
                  'Individual'}
              </p>

              <p className="font-mono text-xs text-red-400 mt-1">
                {
                  confirmDeleteBooking.booking_id
                }
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setConfirmDeleteBooking(null)
                }
                className="flex-1 py-2.5 rounded-xl bg-studio-black border border-white/10 text-xs font-semibold text-white hover:border-white/30 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleDeleteBooking
                }
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 font-bold text-xs text-white hover:bg-red-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >

                <Trash2 className="w-3.5 h-3.5" />

                <span>
                  {isDeleting
                    ? 'Deleting...'
                    : 'Yes, Delete Permanently'}
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}