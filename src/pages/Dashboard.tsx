import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Calendar,
  MapPin,
  Download,
  ChevronRight,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Activity
} from "lucide-react";

interface BookingRecord {
  id?: string;
  _id?: string;
  bookingRef?: string;
  testName?: string;
  testId?: any;
  labName?: string;
  labId?: any;
  patientName: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  date: string;
  timeSlot?: string;
  time?: string;
  status: string;
  amount: number;
  paymentStatus?: string;
  collectionType?: string;
  reportUrl?: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/my-bookings");
      let data = [];
      if (res.ok) {
        data = await res.json();
      }

      // Check localStorage for any recent submissions to ensure immediate visibility
      const stored = JSON.parse(localStorage.getItem("shree_user_bookings") || "[]");
      const combined = [...stored, ...(Array.isArray(data) ? data : [])];

      // Deduplicate by ID
      const seen = new Set();
      const unique = combined.filter((item) => {
        const key = item.id || item._id || item.bookingRef;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setBookings(unique);
    } catch (err) {
      console.error("Error loading dashboard bookings:", err);
      // Fallback from localStorage
      const stored = JSON.parse(localStorage.getItem("shree_user_bookings") || "[]");
      setBookings(stored);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Health Dashboard</h1>
            <p className="text-slate-600 text-sm">
              Manage your diagnostic test appointments, sample collections, and reports.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-xs w-fit"
          >
            <Plus className="h-4 w-4" /> Book New Test
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  SD
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Shree Diagnostics Patient</h2>
                  <p className="text-xs text-slate-500">Verified Patient Account</p>
                </div>
              </div>
              <nav className="space-y-1.5 text-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> My Bookings
                  </span>
                  <span className="text-xs bg-blue-200/60 px-2 py-0.5 rounded-full">{bookings.length}</span>
                </button>
                <Link
                  to="/records"
                  className="w-full flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Medical Records & Reports
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  to="/search"
                  className="w-full flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Browse Tests & Labs
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100 bg-blue-50/50 p-4 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" /> Digital E-Reports
                </div>
                <p className="text-slate-600">
                  Reports are signed by certified MD Pathologists and available to download as soon as verified.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your Diagnostic Appointments ({bookings.length})</h2>
              <button
                type="button"
                onClick={fetchBookings}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">Loading bookings from database...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="p-4 bg-slate-50 rounded-full w-14 h-14 mx-auto text-slate-400 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No Bookings Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Book diagnostic tests or comprehensive health checkups from our accredited partner laboratories.
                  </p>
                </div>
                <Link
                  to="/search"
                  className="inline-block bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
                >
                  Explore Tests & Packages
                </Link>
              </div>
            ) : (
              bookings.map((booking) => {
                const bId = booking.bookingRef || booking.id || booking._id || "BKG-NEW";
                const testTitle =
                  booking.testName ||
                  (typeof booking.testId === "object" ? booking.testId?.name : null) ||
                  "Diagnostic Health Test";
                const labTitle =
                  booking.labName ||
                  (typeof booking.labId === "object" ? booking.labId?.name : null) ||
                  "Partner Diagnostic Center";
                const timeDisplay = booking.timeSlot || booking.time || "Morning Slot";
                const isCompleted = booking.status === "Completed";

                return (
                  <div key={bId} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-700">{bId}</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {booking.status || "Confirmed"}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 font-medium">
                            {booking.collectionType === "lab" ? "Lab Walk-In" : "Home Sample Pickup"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{testTitle}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{labTitle}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xl font-bold text-slate-900">₹{booking.amount}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {booking.paymentStatus || "Payment Confirmed"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mb-4 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>
                          Patient: <strong className="text-slate-800">{booking.patientName}</strong>
                          {booking.age ? ` (${booking.age}y/${booking.gender || ""})` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>
                          {booking.date} · {timeDisplay}
                        </span>
                      </div>
                      {booking.address && (
                        <div className="sm:col-span-2 flex items-start gap-2 pt-1 border-t border-slate-200/50">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {isCompleted
                          ? "Test report verified and released"
                          : "Phlebotomist assigned · Sample collection scheduled"}
                      </div>

                      {booking.reportUrl || isCompleted ? (
                        <Link
                          to="/records"
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Clinical Report
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                          <FileText className="h-3.5 w-3.5 text-slate-400" /> Sample Collection Pending
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
